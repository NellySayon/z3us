import { sprinkles, darkMode } from 'ui/src/components-v2/system/sprinkles.css'
// import { responsiveStyle } from 'ui/src/components-v2/system/theme-utils'
import { style, globalStyle } from '@vanilla-extract/css'
// import { vars } from 'ui/src/components-v2/system/theme.css'

export const transactionWrapper = style([
	sprinkles({
		position: 'relative',
	}),
	{},
])
