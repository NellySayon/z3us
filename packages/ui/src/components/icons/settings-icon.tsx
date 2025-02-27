/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'
import { IconProps } from './types'

export const SettingsIcon = React.forwardRef<SVGSVGElement, IconProps>(
	({ color = 'currentColor', ...props }, forwardedRef) => (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			ref={forwardedRef}
		>
			<path
				fill={color}
				d="M12.1,20h-0.3c-0.9,0-1.6-0.6-1.7-1.5l-0.1-0.6c0-0.1-0.1-0.2-0.3-0.3l-0.2-0.1c-0.1-0.1-0.3-0.1-0.4,0l-0.3,0.2
	c-0.7,0.5-1.7,0.5-2.3-0.2l-0.2-0.2c-0.6-0.6-0.7-1.6-0.2-2.3l0.2-0.3c0.1-0.1,0.1-0.2,0-0.4l-0.1-0.2c-0.1-0.1-0.2-0.2-0.3-0.3
	l-0.6-0.1C4.6,13.7,4,13,4,12.1v-0.3c0-0.9,0.6-1.6,1.5-1.7l0.6-0.1c0.1,0,0.2-0.1,0.3-0.3l0.1-0.2c0.1-0.1,0.1-0.3,0-0.4L6.3,8.9
	C5.7,8.2,5.8,7.2,6.4,6.6l0.2-0.2c0.6-0.6,1.6-0.7,2.3-0.2l0.3,0.2c0.1,0.1,0.2,0.1,0.4,0l0.2-0.1c0.1-0.1,0.3-0.2,0.3-0.3l0.1-0.6
	C10.3,4.6,11,4,11.9,4h0.3c0.9,0,1.6,0.6,1.7,1.5c0,0,0,0,0,0l0.1,0.6c0,0.1,0.1,0.2,0.3,0.3l0.2,0.1c0.2,0.1,0.3,0.1,0.4,0l0.3-0.2
	c0.7-0.5,1.7-0.5,2.3,0.2l0.2,0.2c0.6,0.6,0.7,1.6,0.2,2.3l-0.2,0.3c-0.1,0.1-0.1,0.2,0,0.4l0.1,0.2c0.1,0.1,0.2,0.3,0.3,0.3
	l0.6,0.1c0.9,0.1,1.5,0.9,1.5,1.7v0.3c0,0.9-0.6,1.6-1.5,1.7l-0.6,0.1c-0.1,0-0.2,0.1-0.3,0.3l-0.1,0.2c-0.1,0.1-0.1,0.3,0,0.4
	l0.2,0.3c0.5,0.7,0.4,1.7-0.2,2.3l-0.2,0.2c-0.6,0.6-1.6,0.7-2.3,0.2l-0.3-0.2c-0.1-0.1-0.2-0.1-0.4,0l-0.2,0.1
	c-0.1,0.1-0.2,0.2-0.3,0.3l-0.1,0.6C13.7,19.4,13,20,12.1,20z M9.4,16c0.3,0,0.5,0.1,0.8,0.2l0.1,0.1c0.6,0.3,1.1,0.8,1.2,1.5
	l0.1,0.6c0,0.1,0.1,0.2,0.2,0.2h0.3c0.1,0,0.2-0.1,0.2-0.2l0.1-0.6c0.1-0.6,0.5-1.2,1.2-1.5l0.1-0.1c0.6-0.3,1.4-0.2,1.9,0.2
	l0.3,0.2c0.1,0.1,0.2,0.1,0.3,0l0.2-0.2c0.1-0.1,0.1-0.2,0-0.3l-0.2-0.3c-0.4-0.5-0.5-1.2-0.2-1.9l0.1-0.1c0.3-0.7,0.8-1.1,1.5-1.2
	l0.6-0.1c0.1,0,0.2-0.1,0.2-0.2v-0.3c0-0.1-0.1-0.2-0.2-0.2l-0.6-0.1c-0.6-0.1-1.2-0.5-1.5-1.2l-0.1-0.1c-0.3-0.6-0.2-1.4,0.2-1.9
	L16.5,8c0.1-0.1,0.1-0.2,0-0.3l-0.2-0.2c-0.1-0.1-0.2-0.1-0.3,0l-0.3,0.2c-0.5,0.4-1.2,0.5-1.9,0.2l-0.1-0.1C13,7.6,12.6,7,12.5,6.3
	l-0.1-0.6c0-0.1-0.1-0.2-0.2-0.2h-0.3c-0.1,0-0.2,0.1-0.2,0.2l-0.1,0.6C11.4,7,11,7.6,10.3,7.8l-0.1,0.1C9.6,8.2,8.8,8.1,8.3,7.7
	L8,7.5c-0.1-0.1-0.2-0.1-0.3,0L7.5,7.7C7.4,7.8,7.4,7.9,7.5,8l0.2,0.3c0.4,0.5,0.5,1.2,0.2,1.9l-0.1,0.1C7.6,11,7,11.4,6.3,11.5
	l-0.6,0.1c-0.1,0-0.2,0.1-0.2,0.2v0.3c0,0.1,0.1,0.2,0.2,0.2l0.6,0.1C7,12.6,7.6,13,7.8,13.7l0.1,0.1c0.3,0.6,0.2,1.4-0.2,1.9
	L7.5,16c-0.1,0.1-0.1,0.2,0,0.3l0.2,0.2c0.1,0.1,0.2,0.1,0.3,0l0.3-0.2C8.6,16.1,9,16,9.4,16z"
			/>
			<path
				fill={color}
				d="M12,14c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2C14,13.1,13.1,14,12,14z M12,11.5c-0.3,0-0.5,0.2-0.5,0.5
	s0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5S12.3,11.5,12,11.5z"
			/>
		</svg>
	),
)

export default SettingsIcon
