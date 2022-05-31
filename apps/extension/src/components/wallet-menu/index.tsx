import React, { useState } from 'react'
import { useSharedStore } from '@src/store'
import { useLocation } from 'wouter'
import Button from 'ui/src/components/button'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { HardwareWalletIcon } from 'ui/src/components/icons'
import { Box, MotionBox } from 'ui/src/components/atoms'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuItemIndicator,
	DropdownMenuTriggerItem,
	DropdownMenuRightSlot,
	DropdownMenuHamburgerIcon,
} from 'ui/src/components/drop-down-menu'

export const WalletMenu: React.FC = () => {
	const [, setLocation] = useLocation()
	const { seed, theme, setTheme } = useSharedStore(state => ({
		theme: state.theme,
		setTheme: state.setThemeAction,
		lock: state.lockAction,
		seed: state.masterSeed,
	}))
	const [isOpen, setIsopen] = useState(false)

	const handleConnectHW = () => {
		window.open(`${window.location.origin}/popup-theme-light.html#/hardware-wallet`)
		setLocation('#/hardware-wallet')
	}

	return (
		<MotionBox animate={isOpen ? 'open' : 'closed'}>
			<DropdownMenu onOpenChange={setIsopen}>
				<DropdownMenuTrigger asChild>
					<Button iconOnly aria-label="wallet options" color="ghost" size="3">
						<DropdownMenuHamburgerIcon
							css={{
								stroke: isOpen ? '$iconDefault' : '$iconDefault',
								mt: isOpen ? '3px' : '2px',
							}}
						/>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					avoidCollisions={false}
					align="end"
					side="bottom"
					sideOffset={6}
					alignOffset={-5}
					css={{ minWidth: '130px' }}
				>
					<DropdownMenu>
						<DropdownMenuTriggerItem>
							<Box css={{ flex: '1', pr: '$1' }}>Theme</Box>
							<DropdownMenuRightSlot>
								<ChevronRightIcon />
							</DropdownMenuRightSlot>
						</DropdownMenuTriggerItem>
						<DropdownMenuContent avoidCollisions side="right" css={{ minWidth: '90px' }}>
							<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
								<DropdownMenuRadioItem value="light">
									<DropdownMenuItemIndicator />
									Light
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="dark">
									<DropdownMenuItemIndicator />
									Dark
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="system">
									<DropdownMenuItemIndicator />
									System
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					{seed && (
						<DropdownMenuItem onSelect={handleConnectHW}>
							<Box css={{ flex: '1', pr: '$4' }}>Connect ledger</Box>
							<DropdownMenuRightSlot>
								<HardwareWalletIcon />
							</DropdownMenuRightSlot>
						</DropdownMenuItem>
					)}
					{/*{(seed || hw) && (
						<DropdownMenuItem onSelect={handleLockWallet}>
							<Box css={{ flex: '1' }}>Lock wallet</Box>
							<DropdownMenuRightSlot>
								<LockClosedIcon />
							</DropdownMenuRightSlot>
						</DropdownMenuItem>
					)}*/}
				</DropdownMenuContent>
			</DropdownMenu>
		</MotionBox>
	)
}
