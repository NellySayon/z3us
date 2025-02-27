import { Runtime } from 'webextension-polyfill'
import newQueryClient from '@src/hooks/react-query/query-client'
import { sharedStore } from '@src/store'
import { Message, PublicKey } from '@radixdlt/crypto'
import { BrowserService } from '@src/services/browser'
import { VaultService } from '@src/services/vault'
import { RadixService } from '@src/services/radix'
import { addPendingAction } from '@src/services/actions-pending'
import {
	HAS_WALLET,
	IS_CONNECTED,
	CONNECT,
	DISCONNECT,
	ACCOUNTS,
	BALANCES,
	STAKES,
	UNSTAKES,
	ENCRYPT,
	DECRYPT,
	SIGN,
	SEND_TRANSACTION,
} from '@src/lib/v1/actions'
import { getNoneSharedStore } from '@src/services/state'
import { KeystoreType } from '@src/types'
import { showDisconnected } from '@src/services/content-script'
import {
	getStakedPositionsQueryKey,
	getTokenBalancesQueryKey,
	getUnstakePositionsQueryKey,
} from '@src/hooks/react-query/queries/radix'

const responseOK = { code: 200 }
const responseBadRequest = { code: 400, error: 'Bad request' }
const responseUnauthorized = { code: 401, error: 'Unauthorized' }

// eslint-disable-next-line no-restricted-globals
const queryClient = newQueryClient(self.localStorage)

export default function NewV1BackgroundInpageActions(
	browser: BrowserService,
	vault: VaultService,
	sendInpageMessage: (port: Runtime.Port, id: string, request: any, response: any) => void,
) {
	async function isApprovedWebsite(port: Runtime.Port, id: string, payload: any): Promise<boolean> {
		const url = new URL(port.sender.url)

		const { selectKeystoreId } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { approvedWebsites } = state

		if (url.host in approvedWebsites) {
			return true
		}
		sendInpageMessage(port, id, payload, responseUnauthorized)
		return false
	}

	async function hasWallet(port: Runtime.Port, id: string, payload: any) {
		const { keystores, selectKeystoreId } = sharedStore.getState()
		const keystore = keystores.find(key => key.id === selectKeystoreId)
		const has = await vault.has()
		sendInpageMessage(port, id, payload, has || (keystore && keystore.type === KeystoreType.HARDWARE))
	}

	async function isConnected(port: Runtime.Port, id: string, payload: any) {
		const url = new URL(port.sender.url)

		const { selectKeystoreId } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { approvedWebsites } = state

		sendInpageMessage(port, id, payload, url.host in approvedWebsites)
	}

	async function connect(port: Runtime.Port, id: string, payload: any) {
		const url = new URL(port.sender.url)

		const { selectKeystoreId, theme } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { approvedWebsites, selectedAccountIndex, publicAddresses } = state
		const allAddresses = Object.values(publicAddresses).map(entry => entry.address)

		if (url.host in approvedWebsites) {
			if (allAddresses.length > 0) {
				sendInpageMessage(port, id, payload, allAddresses[selectedAccountIndex])
				return
			}
		}

		await addPendingAction(id, port)
		state.addPendingActionAction(id, { host: url.host, request: payload, action: 'connect' })

		await browser.showPopup(theme, `/notification/connect/${id}`)
	}

	async function disconnect(port: Runtime.Port, id: string, payload: any) {
		const url = new URL(port.sender.url)

		const { selectKeystoreId } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { declineWebsiteAction } = state

		declineWebsiteAction(url.host)
		await showDisconnected()
		sendInpageMessage(port, id, payload, responseOK)
	}

	async function addresses(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const { selectKeystoreId } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { publicAddresses } = state

		sendInpageMessage(
			port,
			id,
			payload,
			Object.values(publicAddresses).map(entry => entry.address),
		)
	}

	async function encrypt(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const url = new URL(port.sender.url)

		const { selectKeystoreId, theme } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()

		await addPendingAction(id, port)
		state.addPendingActionAction(id, { host: url.host, request: payload, action: 'encrypt' })

		await browser.showPopup(theme, `/notification/encrypt/${id}`)
	}

	async function decrypt(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const { input, publicKey } = payload

		const publicKeyBuffer = Buffer.from(publicKey, 'hex')
		const publicKeyResult = PublicKey.fromBuffer(publicKeyBuffer)
		if (!publicKeyResult.isOk()) {
			sendInpageMessage(port, id, payload, responseBadRequest)
			return
		}

		const messageBuffer = Buffer.from(input, 'hex')
		const encryptedMessageResult = Message.fromBuffer(messageBuffer)
		if (!encryptedMessageResult.isOk()) {
			sendInpageMessage(port, id, payload, input)
			return
		}

		const encryptedMessage = encryptedMessageResult.value
		if (encryptedMessage.kind !== 'ENCRYPTED') {
			sendInpageMessage(port, id, payload, encryptedMessage.plaintext)
			return
		}

		const url = new URL(port.sender.url)

		const { selectKeystoreId, theme } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()

		await addPendingAction(id, port)
		state.addPendingActionAction(id, { host: url.host, request: payload, action: 'decrypt' })

		await browser.showPopup(theme, `/notification/decrypt/${id}`)
	}

	async function sign(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const url = new URL(port.sender.url)

		const { selectKeystoreId, theme } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()

		await addPendingAction(id, port)
		state.addPendingActionAction(id, { host: url.host, request: payload, action: 'sign' })

		await browser.showPopup(theme, `/notification/sign/${id}`)
	}

	async function transaction(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const url = new URL(port.sender.url)

		const { selectKeystoreId, theme } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()

		await addPendingAction(id, port)
		state.addPendingActionAction(id, { host: url.host, request: payload, action: 'transaction' })

		await browser.showPopup(theme, `/notification/transaction/${id}`)
	}

	async function balances(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const { selectKeystoreId } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { networks, selectedNetworkIndex, selectedAccountIndex, publicAddresses } = state
		const allAddresses = Object.values(publicAddresses).map(entry => entry.address)

		const network = networks[selectedNetworkIndex]
		const address = allAddresses[selectedAccountIndex]

		const service = new RadixService(network.url)

		try {
			const response = await queryClient.fetchQuery(getTokenBalancesQueryKey(address), async () =>
				service.tokenBalancesForAddress(address),
			)
			sendInpageMessage(port, id, payload, response)
		} catch (error: any) {
			sendInpageMessage(port, id, payload, { code: 500, error: error?.message || error })
		}
	}

	async function stakes(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const { selectKeystoreId } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { networks, selectedNetworkIndex, selectedAccountIndex, publicAddresses } = state
		const allAddresses = Object.values(publicAddresses).map(entry => entry.address)

		const network = networks[selectedNetworkIndex]
		const address = allAddresses[selectedAccountIndex]

		const service = new RadixService(network.url)

		try {
			const response = await queryClient.fetchQuery(getStakedPositionsQueryKey(address), async () =>
				service.stakesForAddress(address),
			)
			sendInpageMessage(port, id, payload, response)
		} catch (error: any) {
			sendInpageMessage(port, id, payload, { code: 500, error: error?.message || error })
		}
	}

	async function unstakes(port: Runtime.Port, id: string, payload: any) {
		const allowed = await isApprovedWebsite(port, id, payload)
		if (!allowed) {
			return
		}

		const { selectKeystoreId } = sharedStore.getState()
		const noneSharedStore = await getNoneSharedStore(selectKeystoreId)
		const state = noneSharedStore.getState()
		const { networks, selectedNetworkIndex, selectedAccountIndex, publicAddresses } = state
		const allAddresses = Object.values(publicAddresses).map(entry => entry.address)

		const network = networks[selectedNetworkIndex]
		const address = allAddresses[selectedAccountIndex]

		const service = new RadixService(network.url)

		try {
			const response = await queryClient.fetchQuery(getUnstakePositionsQueryKey(address), async () =>
				service.unstakesForAddress(address),
			)
			sendInpageMessage(port, id, payload, response)
		} catch (error: any) {
			sendInpageMessage(port, id, payload, { code: 500, error: error?.message || error })
		}
	}

	return {
		[HAS_WALLET]: hasWallet,
		[IS_CONNECTED]: isConnected,
		[CONNECT]: connect,
		[DISCONNECT]: disconnect,
		[ACCOUNTS]: addresses,
		[BALANCES]: balances,
		[STAKES]: stakes,
		[UNSTAKES]: unstakes,
		[DECRYPT]: decrypt,
		[ENCRYPT]: encrypt,
		[SIGN]: sign,
		[SEND_TRANSACTION]: transaction,
	}
}
