import { sprinkles } from 'ui/src/components-v2/system/sprinkles.css'
import { style } from '@vanilla-extract/css'

export const transactionWrapper = style([
	sprinkles({
		position: 'relative',
	}),
	{
		width: '100px',
		height: '64px',
	},
])
