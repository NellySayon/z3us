import React from 'react'
import { useEventListener } from 'usehooks-ts'
import { useRoute } from 'wouter'

import { Box, Flex, Image, StyledLink, Text } from 'ui/src/components/atoms'
import Button from 'ui/src/components/button'

import { HardwareWalletReconnect } from '@src/components/hardware-wallet-reconnect'
import { PageHeading, PageSubHeading, PageWrapper } from '@src/components/layout'
import { useMessanger } from '@src/hooks/use-messanger'
import { useSignature } from '@src/hooks/use-signature'
import { useNoneSharedStore } from '@src/hooks/use-store'
import { CONFIRM } from '@src/lib/v1/actions'
import { hexToJSON } from '@src/utils/encoding'

export const Sign = (): JSX.Element => {
	const [, { id }] = useRoute<{ id: string }>('/sign/:id')

	const { sendResponseAction: sendResponse } = useMessanger()
	const { sign, verify } = useSignature()
	const { action } = useNoneSharedStore(state => ({
		action:
			state.pendingActions[id] && state.pendingActions[id].payloadHex
				? hexToJSON(state.pendingActions[id].payloadHex)
				: {},
	}))

	const { host, request = {} } = action
	const { challenge = '' } = request

	const handleCancel = async () => {
		await sendResponse(CONFIRM, {
			id,
			host,
			payload: { request, value: { code: 403, error: 'Declined' } },
		})
		window.close()
	}

	const handleConfirm = async () => {
		const signature = await sign(challenge)
		if (!verify(signature, challenge)) {
			throw new Error('Invalid signature')
		}
		sendResponse(CONFIRM, {
			id,
			host,
			payload: { request, value: signature },
		})
	}

	// keypress does not handle ESC on Mac
	useEventListener('keydown', async e => {
		switch (e.code) {
			case 'Escape':
				await handleCancel()
				break
			default:
				break
		}
	})

	useEventListener('keypress', async e => {
		switch (e.code) {
			case 'Enter':
				await handleConfirm()
				break
			default:
				break
		}
	})

	return (
		<>
			<PageWrapper css={{ flex: '1' }}>
				<Box>
					<PageHeading>Sign</PageHeading>
					<PageSubHeading>
						Sign message from{' '}
						<StyledLink underline href="#" target="_blank">
							{host}
						</StyledLink>
						.
					</PageSubHeading>
				</Box>
				<Box css={{ mt: '$8', flex: '1' }}>
					<HardwareWalletReconnect />
				</Box>
				<Box css={{ pt: '$2', pb: '$8', flex: '1' }}>
					<Box
						css={{
							br: '$3',
							p: '16px',
							border: '1px solid $borderPanel',
						}}
					>
						<Text size="2">{challenge}</Text>
					</Box>
				</Box>
				<Flex
					direction="column"
					justify="center"
					align="center"
					css={{ mt: '$2', borderTop: '1px solid $borderPanel', borderBottom: '1px solid $borderPanel', py: '$5' }}
				>
					<Box css={{ pb: '$3' }}>
						<Image src="/images/z3us-spinner.svg" css={{ width: '90px', height: '90px' }} />
					</Box>
					<StyledLink href="#" target="_blank">
						<Text size="4" color="muted" css={{ mt: '$2' }}>
							{host}
						</Text>
					</StyledLink>
				</Flex>
			</PageWrapper>

			<PageWrapper css={{ display: 'flex' }}>
				<Button
					onClick={handleCancel}
					size="6"
					color="tertiary"
					aria-label="cancel"
					css={{ px: '0', flex: '1', mr: '$1' }}
				>
					Cancel
				</Button>
				<Button
					onClick={handleConfirm}
					size="6"
					color="primary"
					aria-label="confirm"
					css={{ px: '0', flex: '1', ml: '$1' }}
				>
					Sign
				</Button>
			</PageWrapper>
		</>
	)
}

export default Sign
