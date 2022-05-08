/*eslint-disable*/
import React from 'react'
import { useStore } from '@src/store'
import { Router, Route, useRoute, useLocation } from 'wouter'
import { Box, Flex } from 'ui/src/components/atoms'
import { WalletPanel } from '@src/containers/wallet-panel'
import { Notification } from '@src/containers/notification'
import { OnboardingWorkFlow } from '@src/containers/onboarding'
import { HardwareWallet } from '@src/containers/hardware-wallet'
import { Toasts } from '@src/containers/toasts'
import { useHashLocation, multipathMatcher } from '@src/hooks/use-hash-location'
import { useColorMode } from '@src/hooks/use-color-mode'
import { useVault } from '@src/hooks/use-vault'
import { domExists } from '@src/utils/dom-exists'

export const App: React.FC = () => {
	const isHardwareWalletRoute = domExists && window.location.href.includes('index.html#/hardware-wallet')

	useColorMode()
	useVault()

	const { messanger } = useStore(state => ({
		messanger: state.messanger,
	}))

	return (
		<Box
			css={{
				position: 'relative',
				opacity: messanger ? '1' : '0',
				transition: '$default',
				...(isHardwareWalletRoute
					? {
							width: '100%',
							height: '100%',
					  }
					: {
							width: '360px',
							height: '600px',
					  }),
			}}
		>
			{messanger ? (
				<Router matcher={multipathMatcher as any} hook={useHashLocation as any}>
					<Route path="/wallet/:rest*" component={WalletPanel} />
					<Route path="/notification/:rest*" component={Notification} />
					<Route path="/onboarding/:rest*">
						<OnboardingWorkFlow />
					</Route>
					<Route path="/hardware-wallet/:rest*">
						<HardwareWallet />
					</Route>
					<Route component={WalletPanel} />
				</Router>
			) : (
				<Flex align="center" justify="center" css={{ height: '100%' }} />
			)}
			<Toasts />
		</Box>
	)
}
