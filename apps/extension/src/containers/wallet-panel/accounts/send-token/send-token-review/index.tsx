import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { BuiltTransactionReadyToSign } from '@radixdlt/application'
import BigNumber from 'bignumber.js'
import React from 'react'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import { useLocation } from 'wouter'

import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from 'ui/src/components/alert-dialog'
import { Box, Flex, StyledLink, Text } from 'ui/src/components/atoms'
import Button from 'ui/src/components/button'
import InputFeedBack from 'ui/src/components/input/input-feedback'
import { ToolTip } from 'ui/src/components/tool-tip'

import { HardwareWalletReconnect } from '@src/components/hardware-wallet-reconnect'
import { InfoStatBlock } from '@src/components/info-stat-block'
import { SendReceiveHeader } from '@src/components/send-receive-header'
import { SlippageBox } from '@src/components/slippage-box'
import { Z3usSpinnerAnimation } from '@src/components/z3us-spinner-animation'
import { useExplorerURL } from '@src/hooks/use-explorer-url'
import { useNoneSharedStore, useSharedStore } from '@src/hooks/use-store'
import { useTransaction } from '@src/hooks/use-transaction'
import { Token } from '@src/types'
import { formatBigNumber } from '@src/utils/formatters'
import { getShortAddress } from '@src/utils/string-utils'

interface ImmerT {
	txID: string
	errorMessage: string
	isSendingAlertOpen: boolean
	isSendingTransaction: boolean
}

interface IProps {
	token: Token
	to: string
	totalTokenAmount: string
	amount: BigNumber
	fee: BigNumber
	transaction: BuiltTransactionReadyToSign
	onExit: () => void
}

export const SendTokenReview: React.FC<IProps> = ({
	token,
	to,
	totalTokenAmount,
	amount,
	transaction,
	fee,
	onExit,
}) => {
	const [, setLocation] = useLocation()
	const queryClient = useQueryClient()
	const explorerURL = useExplorerURL()
	const { signTransaction, submitTransaction } = useTransaction()
	const { signingKey } = useSharedStore(state => ({
		signingKey: state.signingKey,
	}))
	const { address, publicAddresses, addressBook } = useNoneSharedStore(state => ({
		address: state.getCurrentAddressAction(),
		publicAddresses: Object.values(state.publicAddresses),
		addressBook: state.addressBook,
	}))
	const [state, setState] = useImmer<ImmerT>({
		txID: '',
		errorMessage: '',
		isSendingAlertOpen: false,
		isSendingTransaction: false,
	})

	const entry = addressBook[address] || publicAddresses.find(_account => _account.address === address)
	const shortAddress = getShortAddress(address, 5)

	const toEntry = addressBook[to] || publicAddresses.find(_account => _account.address === to)
	const toShort = getShortAddress(to, 5)
	const tokenSymbol = token.symbol.toUpperCase()

	const handleCancelTransaction = () => {
		onExit()
	}

	const handleGoBack = () => {
		setState(draft => {
			draft.isSendingTransaction = false
			draft.isSendingAlertOpen = false
			draft.errorMessage = ''
		})
		onExit()
	}

	const handleCloseTransactionModal = () => {
		setLocation(`/account/token/${token.rri}`)
	}

	const handleConfirmSend = async () => {
		if (!signingKey) return

		setState(draft => {
			draft.isSendingAlertOpen = true
			draft.isSendingTransaction = true
		})

		try {
			const { blob, txID } = await signTransaction(token.symbol, transaction)
			setState(draft => {
				draft.txID = txID
			})
			const result = await submitTransaction(blob)
			await queryClient.invalidateQueries({ active: true, inactive: true, stale: true })
			setState(draft => {
				draft.txID = result.txID
				draft.errorMessage = ''
			})
		} catch (error) {
			setState(draft => {
				draft.errorMessage = (error?.message || error).toString().trim()
			})
		}
		setState(draft => {
			draft.isSendingTransaction = false
		})
	}

	return (
		<Flex
			direction="column"
			css={{
				bg: '$bgPanel',
				height: '600px',
				position: 'absolute',
				zIndex: '1',
				left: '0',
				right: '0',
				bottom: '0',
			}}
		>
			<SendReceiveHeader onExit={handleGoBack} />
			<HardwareWalletReconnect />
			<Box css={{ p: '$2', px: '23px', flex: '1' }}>
				<Box>
					<Text css={{ fontSize: '32px', lineHeight: '38px', fontWeight: '800' }}>Confirm send</Text>
					<Text css={{ fontSize: '14px', lineHeight: '17px', fontWeight: '500', mt: '20px' }}>
						Transaction details:
					</Text>
				</Box>
				<ToolTip message={address} css={{ maxWidth: '230px', wordWrap: 'break-word' }}>
					<Box>
						<InfoStatBlock
							addressBookBackground={entry?.background}
							statSubTitle={`From: ${shortAddress} (${totalTokenAmount}${tokenSymbol})`}
							statTitle={entry?.name || ''}
						/>
					</Box>
				</ToolTip>

				<ToolTip message={to} css={{ maxWidth: '230px', wordWrap: 'break-word' }}>
					<Box>
						<InfoStatBlock
							addressBookBackground={toEntry?.background}
							statSubTitle={`To: ${toShort}`}
							statTitle={toEntry?.name || ''}
						/>
					</Box>
				</ToolTip>
				<InfoStatBlock
					image={token?.image}
					statSubTitle="Amount:"
					statTitle={`${formatBigNumber(amount)} ${tokenSymbol}`}
				/>
				<SlippageBox token={token} amount={amount} fee={fee} css={{ mt: '12px' }} />
			</Box>
			<Flex css={{ p: '$2' }}>
				<Button
					size="6"
					color="tertiary"
					aria-label="cancel send token"
					fullWidth
					css={{ px: '0', flex: '1', mr: '$1' }}
					onClick={handleCancelTransaction}
				>
					Cancel
				</Button>

				<AlertDialog open={state.isSendingAlertOpen}>
					<AlertDialogTrigger asChild>
						<Button
							data-test-e2e="accounts-send-confirm-btn"
							size="6"
							color="primary"
							aria-label="confirm send token"
							css={{ px: '0', flex: '1', ml: '$1' }}
							onClick={handleConfirmSend}
							disabled={!signingKey}
							fullWidth
						>
							Confirm send
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<Flex direction="column" css={{ p: '$2', position: 'relative' }}>
							<Box css={{ flex: '1' }}>
								<Flex
									direction="column"
									align="center"
									css={{ bg: '$bgPanel2', width: '100%', pt: '$8', pb: '$6', br: '$2' }}
								>
									<Z3usSpinnerAnimation
										infinite
										animationPlayState={state.isSendingTransaction ? 'running' : 'paused'}
										animationTime="5000ms"
										bgColor="$bgPanel2"
									/>
									<Box css={{ pb: '$4', ta: 'center' }}>
										<Flex css={{ mt: '30px' }}>
											<Text medium size="6" bold css={{ position: 'relative' }}>
												<Box as="span">{state.isSendingTransaction ? 'Sending transaction' : 'Transaction sent'}</Box>
												<Box
													as="span"
													css={{
														position: 'absolute',
														top: '0',
														right: '-22px',
														width: '20px',
														ta: 'left',
														opacity: state.isSendingTransaction ? '1' : '0',
														transition: '$default',
													}}
												>
													<span className="ellipsis-anim">
														<span>.</span>
														<span>.</span>
														<span>.</span>
													</span>
												</Box>
											</Text>
										</Flex>
										<Text
											size="4"
											css={{
												mt: '10px',
												opacity: !state.isSendingTransaction ? '1' : '0',
												transition: '$default',
											}}
										>
											<StyledLink
												underline
												target="_blank"
												href={state.txID ? `${explorerURL}/transactions/${state.txID}` : ``}
												css={{ px: '$1' }}
											>
												View on explorer
											</StyledLink>
										</Text>
									</Box>
									<InputFeedBack showFeedback={state.errorMessage !== ''} animateHeight={51}>
										<Box
											css={{
												display: 'block',
												width: '100%',
												textAlign: 'center',
												opacity: state.errorMessage !== '' ? '1' : '0',
												transition: '$default',
											}}
										>
											<Text size="3" css={{ pb: '$2' }}>
												Oh no! An
												<StyledLink
													underline
													target="_blank"
													href={state.txID ? `${explorerURL}/transactions/${state.txID}` : ``}
													css={{ px: '$1', color: 'red' }}
												>
													error
												</StyledLink>
												has occured.
											</Text>
											{!state.txID && state.errorMessage && (
												<Text size="3" css={{ pb: '$2' }}>
													{state.errorMessage}
												</Text>
											)}
											<Button size="2" color="ghost" aria-label="go back" onClick={handleGoBack}>
												<ArrowLeftIcon />
												Go back
											</Button>
										</Box>
									</InputFeedBack>
								</Flex>
							</Box>
							<Box css={{ mt: '$2' }}>
								<Button
									data-test-e2e="accounts-send-transaction-close"
									size="6"
									color="primary"
									aria-label="Close confirm send"
									css={{ px: '0', flex: '1' }}
									onClick={handleCloseTransactionModal}
									disabled={state.isSendingTransaction}
									fullWidth
								>
									Close
								</Button>
							</Box>
						</Flex>
					</AlertDialogContent>
				</AlertDialog>
			</Flex>
		</Flex>
	)
}
