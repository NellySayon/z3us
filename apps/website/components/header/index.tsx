import React from 'react'
import { useImmer } from 'use-immer'
import { Text, Box, Flex, StyledLink } from 'ui/src/components/atoms'
import { useEventListener } from 'usehooks-ts'
import { PageContainer } from 'components/page-container'
import { Container, Row, Col } from 'react-grid-system'
import Button from 'ui/src/components/button'
import { TelegramIcon, TwitterIcon, GithubIcon } from 'ui/src/components/icons'
import { ToolTip } from 'ui/src/components/tool-tip'
import Link from 'next/link'
import { Z3usText } from 'ui/src/components/z3us-text'
import { config } from 'config'

interface IProps {
	isLandingPage?: boolean
}

const defaultProps = {
	isLandingPage: false,
}

export const Header: React.FC<IProps> = ({ isLandingPage }) => {
	const [state, setState] = useImmer({
		isScrolled: false,
		isThemeMenuOpen: false,
	})

	useEventListener('scroll', () => {
		if (window.scrollY > 0) {
			setState(draft => {
				draft.isScrolled = true
			})
		} else if (window.scrollY === 0) {
			setState(draft => {
				draft.isScrolled = false
			})
		}
	})

	return (
		<Box
			css={{
				position: !isLandingPage ? 'sticky' : 'relative',
				top: '0',
				zIndex: '1',
				transition: '$default',
				py: !isLandingPage && state.isScrolled ? '10px' : '20px',
				'&:after': {
					content: '',
					background: !isLandingPage && state.isScrolled ? '$bgPanelHeaderTransparent' : 'transparent',
					borderBottom: !isLandingPage && state.isScrolled ? '1px solid $borderPanel2' : '1px solid transparent',
					backdropFilter: !isLandingPage && state.isScrolled ? 'blur(15px)' : 'blur(0px)',
					transition: '$default',
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: '0',
					pe: 'none',
				},
			}}
		>
			<PageContainer css={{ position: 'relative', zIndex: '2' }}>
				<Container fluid>
					<Row>
						<Col>
							<Flex
								css={{
									width: '100%',
									'@md': {
										px: '24px',
									},
								}}
							>
								<Link href="/" passHref>
									<StyledLink css={{ display: 'inline-flex', mt: '8px' }}>
										<Z3usText
											css={{
												width: '110px',
												height: 'auto',
												color: '#7448fe',
												transition: '$default',
												'&:hover': {
													color: '#ff9400',
												},
											}}
										/>
									</StyledLink>
								</Link>
							</Flex>
						</Col>
						<Col>
							<Box css={{ width: '100%' }}>
								<Flex
									css={{
										width: '100%',
										'@md': {
											px: '24px',
										},
									}}
								>
									<Flex
										gap="2"
										align="center"
										justify="end"
										css={{
											flex: '1',
											svg: {
												width: '20px',
												'-webkit-backface-visibility': 'hidden',
												'-webkit-transform': 'translateZ(0) scale(1.0, 1.0)',
												transform: 'translateZ(0)',
											},
										}}
									>
										<Link href="/docs" passHref>
											<StyledLink underlineOnHover css={{ mr: '$2' }}>
												<Text bold size="4" css={{ pt: '1px' }}>
													Docs
												</Text>
											</StyledLink>
										</Link>
										<ToolTip message="GitHub" bgColor="$bgPanel2">
											<Button target="_blank" href={config.GITHUB_URL} as="a" size="3" color="ghost" iconOnly>
												<GithubIcon />
											</Button>
										</ToolTip>
										<ToolTip message="Twitter" bgColor="$bgPanel2">
											<Button target="_blank" href={config.TWITTER_URL} as="a" size="3" color="ghost" iconOnly>
												<TwitterIcon />
											</Button>
										</ToolTip>
										<ToolTip message="Telegram" bgColor="$bgPanel2">
											<Button target="_blank" href={config.TELEGRAM_URL} as="a" size="3" color="ghost" iconOnly>
												<TelegramIcon />
											</Button>
										</ToolTip>
									</Flex>
								</Flex>
							</Box>
						</Col>
					</Row>
				</Container>
			</PageContainer>
		</Box>
	)
}

Header.defaultProps = defaultProps
