/* eslint-disable no-nested-ternary */
import { PublicKey } from '@radixdlt/crypto'
import { useAnimationControls } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { useTimeout } from 'usehooks-ts'

import { Box, Flex, MotionBox, StyledLink, Text } from 'ui/src/components/atoms'
import Button from 'ui/src/components/button'
import Input from 'ui/src/components/input'
import { Z3usText } from 'ui/src/components/z3us-text'

import { WalletMenu } from '@src/components/wallet-menu'
import { useColorMode } from '@src/hooks/use-color-mode'
import { useMessanger } from '@src/hooks/use-messanger'
import { useSharedStore } from '@src/hooks/use-store'
import { createLocalSigningKey } from '@src/services/signing-key'
import { KeystoreType } from '@src/types'
import { sleep } from '@src/utils/sleep'

import { Z3USLogoInner, Z3USLogoOuter } from '../z3us-logo'
// import { isWebAuthSupported } from '@src/services/credentials'
import { WalletSelector } from './wallet-selector'

interface IImmer {
	password: string
	passwordError: boolean
	isLoading: boolean
	isInputFocused: boolean
	isMounted: boolean
}

export const LockedPanel: React.FC = () => {
	const isDarkMode = useColorMode()
	const panelControls = useAnimationControls()
	const z3usLogoControls = useAnimationControls()
	const z3usLogoSpinnerControls = useAnimationControls()
	const inputControls = useAnimationControls()
	const imageControls = useAnimationControls()
	const inputRef = useRef(null)
	const { messanger, unlockWalletAction: unlock } = useMessanger()
	const { keystore, isUnlocked, setIsUnlocked, setSigningKey, addToast } = useSharedStore(state => ({
		isUnlocked: state.isUnlocked,
		keystore: state.keystores.find(({ id }) => id === state.selectKeystoreId),
		setIsUnlocked: state.setIsUnlockedAction,
		setSigningKey: state.setSigningKeyAction,
		// hasAuth: state.hasAuthAction,
		// authenticate: state.authenticateAction,
		addToast: state.addToastAction,
	}))

	const [state, setState] = useImmer<IImmer>({
		password: '',
		passwordError: false,
		isLoading: false,
		isInputFocused: false,
		isMounted: false,
	})

	const fillZ3usPurple = '#8457FF'
	const logoFill = isDarkMode ? '#323232' : '#FFFFFF'
	const logoBackgroundStart = isDarkMode ? '#1F1F1F' : '#DBDBDB'
	const logoBackgroundEnd = isDarkMode ? '#323232' : '#FFFFFF'
	const logoShadow = isDarkMode ? '0px 10px 44px rgba(0, 0, 0, 0.35)' : '0px 10px 34px rgba(0, 0, 0, 0.15)'

	const resetAnimElements = () => {
		z3usLogoSpinnerControls.stop()
		z3usLogoSpinnerControls.set({
			rotate: [null, 0],
		})
		z3usLogoControls.start({
			y: '0',
			fill: logoFill,
			backgroundColor: logoBackgroundStart,
			transition: { duration: 0.1, ease: 'anticipate' },
		})
		inputControls.start({ y: '0px', opacity: 1, transition: { duration: 0.3, ease: 'anticipate' } })
		imageControls.start({ opacity: 0, transition: { delay: 0.1, duration: 0.4, ease: 'easeIn' } })
	}

	const prepareUnlockAnim = () => {
		inputControls.set({ opacity: 1 })
		imageControls.set({ opacity: 0 })
		z3usLogoControls.start({
			fill: logoFill,
			backgroundColor: logoBackgroundEnd,
			transition: { duration: 0.1, ease: 'anticipate' },
		})
		inputControls.start({ y: '40px', opacity: 0, transition: { duration: 0.3, ease: 'anticipate' } })
		z3usLogoSpinnerControls.start({
			rotate: [null, 360],
			transition: {
				delay: 0.1,
				duration: 5,
				repeat: Infinity,
				ease: 'linear',
			},
		})
		z3usLogoControls.start({
			y: '96px',
			fill: fillZ3usPurple,
			transition: { duration: 0.1, ease: 'anticipate' },
		})
		imageControls.start({ opacity: 1, transition: { delay: 0.1, duration: 0.4, ease: 'easeIn' } })
	}

	const handleUnlock = async (password: string) => {
		setState(draft => {
			draft.isLoading = true
		})
		prepareUnlockAnim()
		await sleep(700)

		try {
			const { isUnlocked: isUnlockedBackground, publicKey, type } = await unlock(password)
			switch (keystore?.type) {
				case KeystoreType.LOCAL: {
					if (publicKey) {
						const publicKeyBuffer = Buffer.from(publicKey, 'hex')
						const publicKeyResult = PublicKey.fromBuffer(publicKeyBuffer)
						if (!publicKeyResult.isOk()) throw publicKeyResult.error

						const newSigningKey = createLocalSigningKey(messanger, publicKeyResult.value, type)
						setSigningKey(newSigningKey)
					}

					setIsUnlocked(isUnlockedBackground)
					break
				}
				case KeystoreType.HARDWARE:
					setIsUnlocked(isUnlockedBackground)
					break
				default:
					throw new Error(`Unknown keystore ${keystore?.id} (${keystore?.name}) type: ${keystore?.type}`)
			}
		} catch (error) {
			resetAnimElements()
			if (state.passwordError) {
				addToast({
					type: 'error',
					title: 'Invalid password',
					subTitle: 'Are you sure you typed it correctly?',
					duration: 8000,
				})
			}
			setState(draft => {
				draft.passwordError = true
			})

			if (inputRef.current) {
				inputRef.current.focus()
			}
		}
		setState(draft => {
			draft.isLoading = false
		})
	}

	const unlockWithWebAuth = async () => {
		// try {
		// 	const isSupported = await isWebAuthSupported()
		// 	const has = await hasAuth()
		// 	if (isSupported && has) {
		// 		handleUnlock(await authenticate())
		// 	}
		// } catch (error) {
		// 	// eslint-disable-next-line no-console
		// 	console.error(error)
		// }
	}

	const unlockAnimation = async (_isUnlocked: boolean, isMounted: boolean) => {
		if (_isUnlocked) {
			if (isMounted) {
				z3usLogoSpinnerControls.stop()
				z3usLogoSpinnerControls.set({ rotate: [null, 0] })
				await z3usLogoControls.start({
					y: '96px',
					fill: fillZ3usPurple,
					scale: 22,
					transition: { delay: 0.05, duration: 0.05, ease: 'anticipate' },
				})
				await panelControls.start({
					y: '0px',
					opacity: 0,
					transition: { delay: 0, duration: 0.5, ease: 'anticipate' },
				})
				z3usLogoControls.set({ fill: logoFill, backgroundColor: logoBackgroundStart })
				panelControls.start({ y: '-3620px', opacity: 0, transition: { delay: 0, duration: 0 } })
			} else {
				panelControls.start({ y: '-3620px', opacity: 0, transition: { delay: 0, duration: 0 } })
				z3usLogoControls.start({
					y: '96px',
					fill: logoFill,
					backgroundColor: logoBackgroundStart,
					scale: 22,
					transition: { delay: 0.05, duration: 0.05, ease: 'anticipate' },
				})
			}
		} else {
			z3usLogoControls.start({
				y: '0',
				fill: logoFill,
				backgroundColor: logoBackgroundStart,
				scale: 1,
				transition: { duration: 0, ease: 'anticipate' },
			})
			inputControls.start({ y: '0px', opacity: 1, transition: { duration: 0, ease: 'anticipate' } })
			imageControls.start({ opacity: 0, transition: { delay: 0, duration: 0, ease: 'easeIn' } })
			panelControls.start({ y: '0px', opacity: 1, transition: { delay: 0, duration: 0, ease: 'easeOut' } })
		}
	}

	useEffect(() => {
		if (isUnlocked === null) return
		unlockAnimation(isUnlocked, state.isMounted)

		setState(draft => {
			draft.password = ''
			draft.isLoading = false
		})
		unlockWithWebAuth()
	}, [isUnlocked])

	useEffect(() => {
		unlockAnimation(isUnlocked, false)
	}, [isDarkMode])

	// @Note:
	useTimeout(() => {
		setState(draft => {
			draft.isMounted = true
		})
	}, 1000)

	const handleSubmitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		handleUnlock(state.password)
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setState(draft => {
			draft.password = e.target.value
			draft.passwordError = false
		})
	}

	return (
		<MotionBox
			animate={panelControls}
			css={{
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%',
				backgroundColor: '$bgPanel2',
			}}
		>
			<Flex direction="column" css={{ height: '100%', position: 'relative', zIndex: '1' }}>
				<Flex
					css={{
						display: 'flex',
						height: '48px',
						pt: '6px',
						pl: '6px',
						pr: '6px',
						justifyContent: 'flex-end',
					}}
				>
					<WalletMenu />
					<Box
						css={{
							width: '102px',
							height: '18px',
							fill: '$iconDefault',
							position: 'absolute',
							top: '15px',
							left: '50%',
							marginLeft: '-51px',
						}}
					>
						<Z3usText css={{ width: '102px', height: '18px', fill: '$iconDefault' }} />
					</Box>
				</Flex>
				<Flex align="center" justify="center" css={{ flex: '1', position: 'relative' }}>
					<MotionBox
						animate={imageControls}
						css={{
							pe: 'none',
							opacity: '0',
							position: 'absolute',
							width: '204px',
							height: '347px',
							top: '-16px',
							right: '0px',
							backgroundImage: 'url("/images/locked-panel-right.webp")',
							backgroundSize: '100%',
						}}
					/>
					<MotionBox
						animate={z3usLogoControls}
						css={{
							width: '232px',
							height: '232px',
							borderRadius: '50%',
							position: 'absolute',
							top: '40px',
							left: '50%',
							marginLeft: '-116px',
							transition: '$default',
							zIndex: '99',
							boxShadow: logoShadow,
							fill: logoFill,
							backgroundColor: logoBackgroundStart,
						}}
					>
						<MotionBox
							animate={z3usLogoSpinnerControls}
							css={{ width: '232px', height: '232px', position: 'absolute', top: '0', left: '0' }}
						>
							<Z3USLogoOuter />
						</MotionBox>
						<Box
							css={{
								width: '168px',
								height: '168px',
								position: 'absolute',
								top: '32px',
								left: '32px',
							}}
						>
							<Z3USLogoInner />
						</Box>
					</MotionBox>
				</Flex>

				<form onSubmit={handleSubmitForm}>
					<Box css={{ p: '$6' }}>
						<MotionBox animate={inputControls}>
							<WalletSelector />
							{keystore?.type === KeystoreType.LOCAL && (
								<Box
									onClick={() => {
										if (inputRef.current) {
											inputRef.current.focus()
										}
									}}
									css={{
										pb: '10px',
										position: 'relative',
										transition: '$default',
										borderBottom: '2px solid',
										color: '$txtMuted',
										borderColor: state.passwordError
											? '$borderInputError'
											: state.isInputFocused
											? '$borderInputFocus'
											: '$borderPanel3',
									}}
								>
									<Input
										data-test-e2e="wallet-password-input"
										type="password"
										theme="minimal"
										size="2"
										ref={inputRef}
										focusOnMount
										value={state.password}
										error={state.passwordError}
										onChange={handlePasswordChange}
										onFocus={() => {
											setState(draft => {
												draft.isInputFocused = true
											})
										}}
										onBlur={() => {
											setState(draft => {
												draft.isInputFocused = false
											})
										}}
									/>
									<Box css={{ pb: '7px' }}>
										{state.passwordError ? (
											<Text size="5" color="red">
												<StyledLink underlineOnHover href="#/onboarding" css={{ display: 'block' }}>
													Forgot password?
												</StyledLink>
											</Text>
										) : (
											<Text size="5" color="muted">
												Password
											</Text>
										)}
									</Box>
								</Box>
							)}
						</MotionBox>
						<Flex css={{ mt: '$4', transition: '$default', opacity: state.isLoading ? '0.4' : '1.0', zIndex: '1' }}>
							<Button
								data-test-e2e="wallet-unlock-btn"
								type="submit"
								loading={state.isLoading}
								color="primary"
								size="6"
								css={{ flex: '1' }}
							>
								Unlock
							</Button>
						</Flex>
					</Box>
				</form>
			</Flex>
			<MotionBox
				animate={imageControls}
				css={{
					opacity: '0',
					pe: 'none',
					position: 'absolute',
					width: '180px',
					height: '277px',
					bottom: '0px',
					left: '0px',
					backgroundImage: 'url("/images/locked-panel-left.webp")',
					backgroundSize: '100%',
				}}
			/>
		</MotionBox>
	)
}
