import { globalCss } from 'ui/src/theme'

const docsGlobalStyles = globalCss({
	body: {
		height: '100%',
		minHeight: '100%',
		position: 'relative',
		'> div': {
			position: 'relative',
		},
	},
})

export default docsGlobalStyles
