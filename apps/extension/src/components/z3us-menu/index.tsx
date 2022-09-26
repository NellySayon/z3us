import React, { useRef } from 'react'
import { useLocation, useRoute } from 'wouter'
import { useSharedStore, useAccountStore } from '@src/hooks/use-store'
import { useImmer } from 'use-immer'
import Button from 'ui/src/components/button'
import { Z3usIcon, TrashIcon, HardwareWalletIcon } from 'ui/src/components/icons'
import { ToolTip } from 'ui/src/components/tool-tip'
import { LockClosedIcon, ChevronRightIcon, Pencil2Icon } from '@radix-ui/react-icons'
import { Box, MotionBox, Text, Flex } from 'ui/src/components/atoms'
import Input from 'ui/src/components/input'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from 'ui/src/components/alert-dialog'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuItemIndicator,
	DropdownMenuRightSlot,
	DropdownMenuTriggerItem,
} from 'ui/src/components/drop-down-menu'
import { KeystoreType } from '@src/types'

interface ImmerT {
	isOpen: boolean
	keystoreId: string | undefined
	editing: string | undefined
	tempEdit: string | undefined
}

export const Z3usMenu: React.FC = () => {
	const [, setLocation] = useLocation()
	const [isSendRoute] = useRoute('/wallet/account/send')
	const [isSendRouteRri] = useRoute('/wallet/account/send/:rri')
	const [isDepositRoute] = useRoute('/wallet/account/deposit')
	const [isDepositRouteRri] = useRoute('/wallet/account/deposit/:rri')
	const [isActivityRoute] = useRoute('/wallet/account/activity')
	const [isSwapRoute] = useRoute('/wallet/swap/review')
	const { keystores, keystoreId, selectKeystore, removeKeystore, changeKeystoreName, removeWallet, lock } =
		useSharedStore(state => ({
			keystores: state.keystores,
			keystoreId: state.selectKeystoreId,
			addKeystore: state.addKeystoreAction,
			removeKeystore: state.removeKeystoreAction,
			selectKeystore: state.selectKeystoreAction,
			changeKeystoreName: state.changeKeystoreNameAction,
			lock: state.lockAction,
			removeWallet: state.removeWalletAction,
		}))
	const { reset, isUnlocked } = useAccountStore(state => ({
		reset: state.resetAction,
		isUnlocked: state.isUnlocked,
	}))
	const walletInputRef = useRef(null)
	const [state, setState] = useImmer<ImmerT>({
		isOpen: false,
		keystoreId: undefined,
		editing: undefined,
		tempEdit: '',
	})
	const isHideZ3usMenu =
		isSendRoute || isSendRouteRri || isDepositRoute || isDepositRouteRri || isActivityRoute || isSwapRoute

	const handleLockWallet = async () => {
		await lock()
	}

	const handleValueChange = async (id: string) => {
		if (id === keystoreId) return
		selectKeystore(id)
		setLocation('#/wallet/account')
		await lock()
	}

	const handleAdd = () => {
		window.location.hash = '#/onboarding'
	}

	const confirmRemoveWallet = () => async () => {
		await removeWallet()
		reset()
		removeKeystore(state.keystoreId)
		setState(draft => {
			draft.keystoreId = undefined
		})
		handleLockWallet()
	}

	const handleRemoveWallet = (wallet: string) => {
		setState(draft => {
			draft.keystoreId = wallet
		})
	}

	const handleDropDownMenuOpenChange = (open: boolean) => {
		setState(draft => {
			draft.isOpen = open
		})
	}

	const handleCancelRemoveWallet = () => {
		setState(draft => {
			draft.keystoreId = undefined
		})
	}

	const handleEditWalletName = (keyStoreId: string) => {
		const findKeystore = keystores.find(keystore => keystore.id === keyStoreId)
		setState(draft => {
			draft.editing = keyStoreId
			draft.tempEdit = findKeystore?.name || keyStoreId
		})

		// select the input text when the dialog becomes visible
		setTimeout(() => {
			walletInputRef.current.select()
		}, 50)
	}

	const editWalletName = (name: string) => {
		setState(draft => {
			draft.tempEdit = name
		})
	}

	const handleCancelEditWalletName = () => {
		setState(draft => {
			draft.editing = undefined
			draft.tempEdit = undefined
		})
	}

	const handleSaveWalletName = () => {
		changeKeystoreName(state.editing, state.tempEdit)
		setState(draft => {
			draft.editing = undefined
			draft.tempEdit = undefined
		})
	}

	const handleSubmitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		handleSaveWalletName()
	}

	return (
		<Box
			css={{
				position: 'fixed',
				top: '6px',
				left: '6px',
				zIndex: '1',
				transition: '$default',
				pe: isHideZ3usMenu ? 'none' : 'auto',
				opacity: isHideZ3usMenu ? '0' : '1',
			}}
		>
			<MotionBox animate={state.isOpen ? 'open' : 'closed'}>
				<DropdownMenu onOpenChange={handleDropDownMenuOpenChange}>
					<DropdownMenuTrigger asChild>
						<Button iconOnly aria-label="Z3US menu" color="ghost" size="4" css={{ mr: '2px' }}>
							<Z3usIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" sideOffset={6} alignOffset={-3} css={{ minWidth: '130px' }}>
						{keystores.length > 0 && (
							<DropdownMenu>
								<DropdownMenuTriggerItem>
									<Box css={{ flex: '1', pr: '$1' }}>Wallet</Box>
									<DropdownMenuRightSlot>
										<ChevronRightIcon />
									</DropdownMenuRightSlot>
								</DropdownMenuTriggerItem>
								<DropdownMenuContent avoidCollisions side="right" css={{ minWidth: '130px' }}>
									<DropdownMenuRadioGroup value={keystoreId} onValueChange={handleValueChange}>
										{keystores.map(({ id, name, type }) => (
											<DropdownMenuRadioItem key={id} value={id}>
												<DropdownMenuItemIndicator css={{ width: '16px', left: '0', right: 'unset' }} />
												<Flex align="center" css={{ width: '100%', pl: '$1', pr: '$2' }}>
													<Flex
														justify="start"
														align="center"
														css={{
															pr: '$3',
															flex: '1',
														}}
													>
														<Text
															size="2"
															bold
															truncate
															css={{ maxWidth: `${type === KeystoreType.HARDWARE ? '100px' : '124px'}` }}
														>
															{name}
														</Text>
													</Flex>
													<Flex justify="end" css={{ mr: '-6px' }}>
														{type === KeystoreType.HARDWARE && (
															<ToolTip message="Hardware wallet account">
																<Box css={{ width: '24px', height: '24px', mr: '3px' }}>
																	<Button size="1" clickable={false}>
																		<HardwareWalletIcon />
																	</Button>
																</Box>
															</ToolTip>
														)}
														{isUnlocked && keystoreId === id && (
															<>
																<ToolTip message="Remove">
																	<Button size="1" iconOnly color="ghost" onClick={() => handleRemoveWallet(id)}>
																		<TrashIcon />
																	</Button>
																</ToolTip>
																<ToolTip message="Edit name">
																	<Button size="1" iconOnly color="ghost" onClick={() => handleEditWalletName(id)}>
																		<Pencil2Icon />
																	</Button>
																</ToolTip>
															</>
														)}
													</Flex>
												</Flex>
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						<DropdownMenuItem onSelect={handleAdd}>
							<Box css={{ flex: '1', pr: '$4' }}>Add new wallet</Box>
						</DropdownMenuItem>
						{isUnlocked && (
							<DropdownMenuItem onSelect={handleLockWallet}>
								<Box css={{ flex: '1' }}>Lock wallet</Box>
								<DropdownMenuRightSlot>
									<LockClosedIcon />
								</DropdownMenuRightSlot>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</MotionBox>
			<AlertDialog open={!!state.editing}>
				<AlertDialogContent>
					<form onSubmit={handleSubmitForm}>
						<AlertDialogTitle>Edit wallet name</AlertDialogTitle>
						<AlertDialogDescription>
							<Text>
								Enter name for your wallet and click <b>Save</b>.
							</Text>
							<Box css={{ pt: '$3', pb: '$1' }}>
								<Input
									ref={walletInputRef}
									type="text"
									value={state.tempEdit}
									placeholder="Enter wallet name"
									onChange={(e: React.ChangeEvent<HTMLInputElement>): void => editWalletName(e.target.value)}
								/>
							</Box>
						</AlertDialogDescription>
						<Flex justify="end">
							<AlertDialogCancel asChild>
								<Button size="2" color="tertiary" css={{ mr: '$2' }} onClick={handleCancelEditWalletName}>
									Cancel
								</Button>
							</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button size="2" color="primary" type="submit">
									Save
								</Button>
							</AlertDialogAction>
						</Flex>
					</form>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={!!state.keystoreId}>
				<AlertDialogContent>
					<AlertDialogTitle>Remove wallet</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to remove the wallet? This action cannot be undone.
					</AlertDialogDescription>
					<Flex justify="end">
						<AlertDialogCancel asChild>
							<Button size="2" color="tertiary" css={{ mr: '$2' }} onClick={handleCancelRemoveWallet}>
								Cancel
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button size="2" color="red" onClick={confirmRemoveWallet()}>
								Yes, remove wallet
							</Button>
						</AlertDialogAction>
					</Flex>
				</AlertDialogContent>
			</AlertDialog>
		</Box>
	)
}
