import React from 'react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { Container, Grid } from '@nextui-org/react'
import { Box, Text, Flex, StyledLink } from 'ui/src/components/atoms'
import Button from 'ui/src/components/button'
import { Header } from 'components/header'
import { config, bp } from 'config'

export const LandingPage: React.FC = () => (
	<>
		<NextSeo
			title="An open source UX driven web3 wallet built for DeFi & NFTs "
			openGraph={{
				type: 'website',
				url: config.Z3US_URL,
				title: 'Z3US web3 wallet',
				description: 'A community centric open source browser wallet for the Radix DLT network.',
				images: [
					{
						url: `${config.Z3US_URL}/og-image-1.png`,
						width: 800,
						height: 600,
						alt: 'Og Image Alt',
					},
					{
						url: `${config.Z3US_URL}/og-image-2.png`,
						width: 800,
						height: 600,
						alt: 'Og Image Alt 2',
					},
				],
			}}
		/>

		<Box
			css={{
				position: 'relative',
			}}
		>
			<Header isLandingPage />
			<Container css={{ position: 'relative' }}>
				<Flex css={{ flex: '1' }}>
					<Grid.Container
						gap={2}
						justify="center"
						css={{
							position: 'relative',
						}}
					>
						<Grid xs={12} md={12}>
							<Flex
								css={{
									position: 'relative',
									flexDirection: 'column-reverse',
									background: 'linear-gradient(180deg, #7345fc, #4f21e6 100%)',
									borderRadius: '32px',
									width: '100%',
									gap: '12px',
									color: '$white',
									overflow: 'hidden',

									'&:before': {
										content: '',
										position: 'absolute',
										pe: 'none',
										top: '0',
										left: '0',
										right: '0',
										bottom: '0',
										backgroundImage: 'url(/images/landing-lightening-bg.png)',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: '-100px -100px',
										backgroundSize: 'auto 100%',
										opacity: '0.7',
										minHeight: '100%',
									},

									'@md': {
										flexDirection: 'row',
										'&:before': {
											backgroundRepeat: 'no-repeat',
											backgroundPosition: 'top right',
											backgroundSize: 'auto 100%',
										},
									},
								}}
							>
								<Box
									css={{
										width: '100%',
										flexBasis: '100%',
										position: 'relative',
										pt: '20px',
										pb: '50px',
										px: '20px',
										'@md': { width: '50%', flexBasis: '50%', pt: '150px', pb: '150px', pl: '40px' },
										'@lg': { pl: '100px' },
									}}
								>
									<Box>
										<Text
											bold
											size="14"
											//css={{
											//backgroundColor: 'yellow',
											//'@xs': { backgroundColor: 'brown' },
											//'@sm': { backgroundColor: 'green' },
											//'@md': { backgroundColor: 'purple' },
											//'@lg': { backgroundColor: 'red' },
											//}}
										>
											Control your future. Finance at your fingertips.
										</Text>
										<Text size="7" css={{ pt: '20px', lineHeight: '30px' }}>
											Manage accounts, send and receive tokens, stake tokens to receive rewards and connect to DApps
											from the Z3US browser wallet.
										</Text>
										<Flex css={{ mt: '$6', justifyContent: 'center', '@md': { justifyContent: 'flex-start' } }}>
											<Button
												target="_blank"
												href="https://t.me/z3us_dapps/4"
												as="a"
												size="6"
												color="secondary"
												rounded
												css={{
													width: '200px',
													color: '$black',
													backgroundColor: '#FFFFFF',
													'&:hover': {
														backgroundColor: '#eee',
													},
												}}
											>
												Get BETA access
											</Button>
										</Flex>
									</Box>
								</Box>

								<Flex
									align="center"
									justify="center"
									css={{
										width: '100%',
										flexBasis: '100%',
										position: 'relative',
										pt: '20px',
										pb: '0px',
										px: '20px',
										img: {
											maxWidth: '100%',
										},
										'@md': { width: '50%', flexBasis: '50%', position: 'relative', pt: '34px', pb: '44px' },
									}}
								>
									<img src="images/landing-product-bg.png" alt="product" style={{ width: '398px' }} />
								</Flex>
							</Flex>
						</Grid>
					</Grid.Container>
				</Flex>
				{/*<Flex>
								<Grid.Container
									gap={2}
									justify="center"
									css={{
										position: 'relative',
										color: '$white',
									}}
								>
									<Grid xs={12} md={6} justify={isLg ? 'center' : 'flex-start'}>
										<Flex
											align="center"
											css={{ py: '100px', backgroundColor: '#ffcd6c', borderRadius: '32px', width: '100%' }}
										>
											<Box>
												<Text bold size="9">
													Control your future. Finance at your fingertips.
												</Text>
												<Text size="6" css={{ pt: '20px' }}>
													Manage accounts, send and receive tokens, stake tokens to receive rewards and connect to DApps
													from the Z3US browser wallet.
												</Text>
											</Box>
										</Flex>
									</Grid>
									<Grid xs={12} md={6}>
										<Box css={{ backgroundColor: '#75ccb2', borderRadius: '32px', width: '100%' }}>sdf asdfasdf</Box>
									</Grid>
								</Grid.Container>
							</Flex>

							<Flex>
								<Grid.Container
									gap={2}
									justify="center"
									css={{
										position: 'relative',
									}}
								>
									<Grid xs={12} md={12}>
										<Flex
											align="center"
											justify="center"
											css={{
												background: '#e4ddf7',
												borderRadius: '32px',
												width: '100%',
												gap: '12px',
												textAlign: 'center',
											}}
										>
											<Box css={{ pt: '150px', pb: '150px', px: '105px' }}>
												<Text bold size="14">
													Control your future. Finance at your fingertips.
												</Text>
												<Text size="7" css={{ pt: '20px', lineHeight: '30px' }}>
													Manage accounts, send and receive tokens, stake tokens to receive rewards and connect to DApps
													from the Z3US browser wallet.
												</Text>
											</Box>
										</Flex>
									</Grid>
								</Grid.Container>
							</Flex>*/}

				{/*FOOTER*/}
				<Flex>
					<Grid.Container
						gap={2}
						justify="center"
						css={{
							position: 'relative',
							mt: '40px',
						}}
					>
						<Grid xs={6}>
							<Flex align="center" css={{ width: '100%' }}>
								<Box css={{ p: '24px' }}>
									<Text size="4" color="help">
										&copy; {new Date().getFullYear()} Z3US
									</Text>
								</Box>
							</Flex>
						</Grid>
						<Grid xs={6}>
							<Box css={{ width: '100%' }}>
								<Flex justify="end" gap="3" css={{ flex: '1', p: '24px', color: '$txtHelp' }}>
									<Link href="/privacy" passHref>
										<StyledLink underlineOnHover>
											<Text size="5">Privacy</Text>
										</StyledLink>
									</Link>

									<Link href="/terms" passHref>
										<StyledLink underlineOnHover>
											<Text size="5">Terms</Text>
										</StyledLink>
									</Link>
								</Flex>
							</Box>
						</Grid>
					</Grid.Container>
				</Flex>
			</Container>
		</Box>
	</>
)
