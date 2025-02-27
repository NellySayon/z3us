import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Box } from '../atoms/box'
import { PropsWithCSS } from '../../types'
import { styled, keyframes } from '../../theme'

const EXT_HEIGHT = '100%'
const EXT_WIDTH = '100%'

const overlayAnimateIn = keyframes({
	from: { opacity: 0 },
	to: { opacity: 1 },
})

const overlayAnimateOut = keyframes({
	from: { opacity: 1 },
	to: { opacity: 0 },
})

const animateIn = keyframes({
	from: { opacity: 0, transform: ' scale(.96)' },
	to: { opacity: 1, transform: ' scale(1)' },
})

const animateOut = keyframes({
	from: { opacity: 1, transform: ' scale(1)' },
	to: { opacity: 0, transform: ' scale(0.96)' },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
	backgroundColor: '$bgTransparentDialog',
	backdropFilter: 'blur(6px)',
	position: 'absolute',
	width: EXT_WIDTH,
	height: EXT_HEIGHT,
	top: '0',
	left: '0',
	inset: 0,
	'&[data-state="open"]': {
		animation: `${overlayAnimateIn} 200ms ease`,
		animationFillMode: 'forwards',
	},
	'&[data-state="closed"]': {
		animation: `${overlayAnimateOut} 200ms ease`,
		animationFillMode: 'forwards',
	},
})

const StyledOverlaySpan = styled('span', {
	zIndex: '1',
	backgroundColor: '$bgTransparentDialog',
	backdropFilter: 'blur(6px)',
	position: 'absolute',
	width: EXT_WIDTH,
	height: EXT_HEIGHT,
	top: '0',
	left: '0',
	inset: 0,
})

const StyledContent = styled(DialogPrimitive.Content, {
	zIndex: '1',
	position: 'absolute',
	width: EXT_WIDTH,
	height: EXT_HEIGHT,
	top: '0',
	left: '0',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	'&:focus': { outline: 'none' },
	'&[data-state="open"]': {
		animation: `${animateIn} 200ms ease`,
		animationFillMode: 'forwards',
	},
	'&[data-state="closed"]': {
		animation: `${animateOut} 200ms ease`,
		animationFillMode: 'forwards',
	},
})

type ContentProps = {
	children: React.ReactNode
	container?: React.RefObject<HTMLElement>
	modal?: boolean
} & typeof defaultContentProps

const defaultContentProps = {
	container: undefined,
	modal: false,
}

export type DialogContentProps = PropsWithCSS<ContentProps>

const Content = ({ children, container, css, modal }: DialogContentProps) => (
	<DialogPrimitive.Portal container={container}>
		{modal ? <StyledOverlay /> : null}
		<StyledContent>
			{!modal ? <StyledOverlaySpan /> : null}
			<Box
				css={{
					zIndex: '1',
					p: '$3',
					position: 'relative',
					width: '100%',
					border: '1px solid $borderDialog',
					color: '$txtDefault',
					backgroundColor: '$bgPanelDialog',
					br: '$2',
					m: '$6',
					...css,
				}}
			>
				{children}
			</Box>
		</StyledContent>
	</DialogPrimitive.Portal>
)

Content.defaultProps = defaultContentProps

const StyledTitle = styled(DialogPrimitive.Title, {
	margin: 0,
	fontWeight: 500,
	color: 'grey',
	fontSize: 17,
})

const StyledDescription = styled(DialogPrimitive.Description, {
	margin: '10px 0 20px',
	color: 'grey',
	fontSize: 15,
	lineHeight: 1.5,
})

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogContent = Content
export const DialogTitle = StyledTitle
export const DialogDescription = StyledDescription
export const DialogClose = DialogPrimitive.Close
