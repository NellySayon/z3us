/* eslint-disable */
import React, { useState } from 'react'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { PlusIcon, MagnifyingGlassIcon, ArrowLeftIcon, ChevronRightIcon } from 'ui/src/components/icons'
import { AnimatedPage } from '@src/containers/playground/components/animated-route'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Routes, Route, useLocation, Link as LinkRouter, useNavigate } from 'react-router-dom'
import { AccountsList } from '@src/containers/playground/containers/accounts/accounts-list'
import { AccountSwitcher } from '@src/containers/playground/containers/accounts/account-switcher'
import { AccountSearch } from '@src/containers/playground/containers/accounts/account-search'
import { AccountActivity } from '@src/containers/playground/containers/accounts/account-activity'
import { useAccountParams } from '@src/containers/playground/hooks/use-account-params'
import { ScrollPanel } from '@src/containers/playground/components/scroll-panel'
// import { Button } from '@src/components/button'
import { Avatar, AvatarImage, AvatarFallback } from 'ui/src/components-v2/avatar'
// inone { Button as ButtonLink } from '@src/components/button'
import { Box } from 'ui/src/components-v2/box'
import { Text } from 'ui/src/components-v2/typography'
import { Link } from '@src/components/link'

import * as styles from './accounts-home.css'

export const AccountsHome = () => {
	const location = useLocation()
	const { account, assetType, asset } = useAccountParams()
	const isAllAccount = account === 'all'

	return (
		<Box
			display="flex"
			justifyContent="center"
			paddingX="large"
			paddingBottom="xxlarge"
			paddingTop="xxlarge"
			height="full"
		>
			<Box height="full" width="full" maxWidth="xxlarge">
				<Box className={clsx(styles.panelWrapper)}>
					<ScrollPanel
						className={styles.leftPanel}
						renderPanel={(panelRef: React.Ref<HTMLElement | null>, isScrolled: boolean) => {
							return (
								<>
									{/* <AccountsRouteWrapper isScrolled={isScrolled} /> */}
									<Box position="relative">
										<AnimatePresence initial={false}>
											<Routes location={location} key={location.pathname}>
												<Route
													path="/:account"
													element={
														<AnimatedPage>
															<AccountsRouteWrapper isScrolled={isScrolled} />
															<AccountsIndexAssets />
														</AnimatedPage>
													}
												/>
												{['/:account/:assetType', '/:account/:assetType/:asset'].map(path => (
													<Route
														key="Assets" // optional: avoid full re-renders on route changes
														path={path}
														element={
															<AnimatedPage>
																<AccountsList ref={panelRef} isScrolled={isScrolled} />
															</AnimatedPage>
														}
													/>
												))}
											</Routes>
										</AnimatePresence>
									</Box>
								</>
							)
						}}
					/>
					<ScrollPanel
						className={styles.rightPanel}
						renderPanel={(panelRef: React.Ref<HTMLElement | null>, isScrolled: boolean) => {
							return (
								<Box>
									{isAllAccount && !assetType ? (
										<Box paddingTop="xlarge" paddingX="xlarge">
											<Box background="backgroundPrimary" style={{ width: '100%', height: '200px' }}></Box>
										</Box>
									) : (
										<AccountSwitcher isScrolled={isScrolled} />
									)}
									<Box
										paddingX="large"
										paddingTop="xlarge"
										paddingBottom="small"
										className={styles.recentActivityWrapper}
									>
										<Box display="flex" alignItems="center" position="relative" gap="large">
											<Box flexShrink={0}>
												{asset ? (
													<Text size="large" weight="medium" color="strong">
														{asset} activity
													</Text>
												) : null}
												{!asset ? (
													<Text size="large" weight="medium" color="strong">
														{assetType ? assetType : 'All'} activity
													</Text>
												) : null}
											</Box>
											<AccountSearch placeholder="search" />
										</Box>
									</Box>
									<AccountActivity ref={panelRef} />
								</Box>
							)
						}}
					/>
				</Box>
			</Box>
		</Box>
	)
}

export const AccountsRouteWrapper = ({ isScrolled }: { isScrolled: boolean }) => {
	const { account, assetType, asset } = useAccountParams()
	const navigate = useNavigate()

	return (
		<Box className={clsx(styles.accountIndexWrapper, isScrolled && styles.accountIndexWrapperShadow)}>
			<Box display="flex" width="full">
				<Box flexGrow={1}>
					<Box display="flex" alignItems="center" paddingBottom="xsmall" flexGrow={0}>
						<Box>
							<Text size="large">Account balance</Text>
						</Box>
					</Box>
					<Text
						weight="medium"
						// size={isScrolled ? 'xxlarge' : 'xxxlarge'}
						size="xxxlarge"
						color="strong"
						className={styles.pricingText}
					>
						$4,440,206.25
					</Text>
				</Box>
				{assetType || asset ? (
					<Box flexGrow={1}>
						<AccountSearch
							placeholder="Search"
							onChange={_value => {
								console.log(_value)
							}}
						/>
					</Box>
				) : null}
			</Box>
		</Box>
	)
}

export const AccountsIndexAssets = () => {
	const [hoveredLink, setHoveredLink] = useState<string | null>(null)

	return (
		<>
			<Box paddingBottom="xlarge">
				<Box display="flex" paddingBottom="small" paddingTop="large" paddingX="xlarge" alignItems="center" gap="large">
					<Box>
						<Text size="xlarge" color="strong" weight="medium">
							Assets and badges
						</Text>
					</Box>
					<Box flexGrow={1}>
						<AccountSearch
							placeholder="Search"
							onChange={_value => {
								console.log(_value)
							}}
						/>
					</Box>
				</Box>
				<Box className={styles.indexAssetsWrapper}>
					{[{ name: 'Tokens' }, { name: 'NFTs' }, { name: 'LP Tokens' }, { name: 'Badges' }].map(({ name }) => (
						<Box key={name} className={styles.indexAssetWrapper}>
							<Link
								to="/accounts/all/tokens"
								underline="never"
								className={clsx(styles.indexAssetLinkRow, name === hoveredLink && styles.indexAssetLinkRowHover)}
							>
								<Box
									className={styles.indexAssetLinkRowInner}
									onMouseOver={() => setHoveredLink(name)}
									onMouseLeave={() => setHoveredLink(null)}
								>
									<Box display="flex" alignItems="center">
										<Text size="medium" color="strong">
											{name}
										</Text>
										<Box paddingLeft="xsmall">
											<Text size="medium">(12)</Text>
										</Box>
									</Box>
									<Box display="flex" alignItems="center" gap="xsmall">
										<Text size="small" color="strong" weight="strong">
											$12,401
										</Text>
										<Text size="xsmall" color="green">
											+1.23%
										</Text>
									</Box>
								</Box>
							</Link>
							<Box className={styles.indexAssetRowOverlay}>
								<Box display="flex" alignItems="center" marginRight="large">
									<Text size="xsmall" weight="medium">
										+7
									</Text>
								</Box>
								{[...Array(4)].map((x, i) => (
									<Link key={i} to="/accounts/all/tokens" className={styles.indexAssetCircle}>
										<Box onMouseOver={() => setHoveredLink(name)}>
											<Avatar>
												<AvatarImage
													className="AvatarImage"
													src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
													alt="Colm Tuite"
												/>
												<AvatarFallback className="AvatarFallback" delayMs={600}>
													CT
												</AvatarFallback>
											</Avatar>
										</Box>
									</Link>
								))}
								<Box paddingLeft="xsmall">
									<ChevronRightIcon />
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		</>
	)
}
