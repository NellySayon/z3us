import { CurrencyDollarIcon, ExclamationCircleIcon, LockClosedIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useMemo } from 'react'
import { useEventListener } from 'usehooks-ts'
import { useRoute } from 'wouter'

import { Box, Flex, StyledLink, Text } from 'ui/src/components/atoms'
import Button from 'ui/src/components/button'

import { PageHeading, PageWrapper } from '@src/components/layout'
import { useMessanger } from '@src/hooks/use-messanger'
import { useNoneSharedStore } from '@src/hooks/use-store'
import { CONFIRM } from '@src/lib/v1/actions'
import { handleContentScriptInject, showConnected } from '@src/services/content-script'
import { hexToJSON } from '@src/utils/encoding'

import matches from '../../../../content_matches.json'

const patternPrefix = '*://*.'

export const Connect = (): JSX.Element => {
	const [, { id }] = useRoute<{ id: string }>('/connect/:id')

	const { sendResponseAction: sendResponse } = useMessanger()
	const { accountAddress, action, approveWebsite, declineWebsite, approvedWebsites } = useNoneSharedStore(state => ({
		accountAddress: state.getCurrentAddressAction(),
		approvedWebsites: state.approvedWebsites,
		approveWebsite: state.approveWebsiteAction,
		declineWebsite: state.declineWebsiteAction,
		action:
			state.pendingActions[id] && state.pendingActions[id].payloadHex
				? hexToJSON(state.pendingActions[id].payloadHex)
				: {},
	}))

	const { host, request = {} } = action
	const { tabId = '' } = request

	const isVerified = useMemo(() => {
		const found = matches.find(pattern => {
			const regexpString = pattern.startsWith(patternPrefix) ? pattern.slice(patternPrefix.length) : pattern
			const match = new RegExp(regexpString).test(host)
			return match
		})
		return !!found
	}, [host])

	useEffect(() => {
		if (host in approvedWebsites) {
			sendResponse(CONFIRM, { id, host, payload: { request, value: accountAddress } })
		}
	}, [approvedWebsites])

	const handleCancel = async () => {
		declineWebsite(host)
		if (tabId) {
			window.location.hash = `#/wallet/account`
		} else {
			await sendResponse(CONFIRM, {
				id,
				host,
				payload: { request: action.request, value: { code: 403, error: 'Declined' } },
			})
			window.close()
		}
	}

	const handleConfirm = async () => {
		approveWebsite(host)
		await showConnected()
		if (tabId) {
			await handleContentScriptInject(tabId)
			window.location.hash = `#/wallet/account`
		}
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
		<Box css={{ display: 'flex', flexDirection: 'column', height: '100%', bg: '$bgPanel3' }}>
			<PageWrapper css={{ flex: '1' }}>
				<Box css={{ pt: '10px' }}>
					<PageHeading>Connect</PageHeading>
					<Text css={{ fontSize: '16px', lineHeight: '20px', fontWeight: '400', mt: '4px' }}>
						This will allow{' '}
						<StyledLink underline href={host} target="_blank">
							{host}
						</StyledLink>{' '}
						to:
					</Text>
				</Box>
				<Box
					css={{
						py: '$5',
					}}
				>
					<Box
						as="ul"
						css={{
							mt: '10px',
							pl: '2px',
							svg: {
								width: '20px',
								height: '20px',
								color: '$iconDefault',
							},
						}}
					>
						<Flex align="center" as="li">
							<CurrencyDollarIcon />
							<Text size="5" bold css={{ ml: '7px' }}>
								View wallet balance
							</Text>
						</Flex>
						<Flex align="center" as="li" css={{ mt: '15px' }}>
							<UserPlusIcon />
							<Text size="5" bold css={{ ml: '7px' }}>
								Request approval for transactions
							</Text>
						</Flex>
					</Box>
					<Flex
						align="center"
						css={{
							bg: '$bgPanel4',
							mt: '25px',
							br: '$3',
							pr: '12px',
							pl: '17px',
							py: '12px',
							svg: !isVerified
								? {
										width: '20px',
										height: '20px',
										color: '$iconDefault',
								  }
								: {
										width: '20px',
										height: '20px',
										color: '#19B00C',
								  },
						}}
					>
						<Box css={{ flexShrink: '0', width: '31px' }}>
							{!isVerified ? <ExclamationCircleIcon /> : <LockClosedIcon />}
						</Box>
						<Box>
							<Text size="2">
								Since{' '}
								<StyledLink underline href={host} target="_blank">
									{host}
								</StyledLink>{' '}
								{!isVerified ? (
									<>
										is not verified Dapp, we are unable to automatically inject script into the page to maintain
										connection after your session has ended. {host} requires a unique connection for each session.{' '}
										{/* @TODO: link docs */}
										{/* <StyledLink underline href={host} target="_blank">
											Learn more
										</StyledLink> */}
									</>
								) : (
									'is a verified Dapp, script is automatically injected into the page to maintain the connection after the current session.'
								)}
							</Text>
						</Box>
					</Flex>
				</Box>
			</PageWrapper>
			<PageWrapper css={{ display: 'flex', gridGap: '12px', borderTop: '1px solid $borderPanel2' }}>
				<Button
					onClick={handleCancel}
					size="6"
					color="tertiary"
					aria-label="cancel connect wallet"
					css={{ px: '0', flex: '1' }}
				>
					Cancel
				</Button>
				<Button
					onClick={handleConfirm}
					size="6"
					color="primary"
					aria-label="confirm connect wallet"
					css={{ px: '0', flex: '1' }}
				>
					Connect
				</Button>
			</PageWrapper>
		</Box>
	)
}

export default Connect
