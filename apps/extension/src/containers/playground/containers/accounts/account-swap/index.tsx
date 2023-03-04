/* eslint-disable */
import clsx from 'clsx'
import React, { forwardRef, useEffect, useState } from 'react'

import { Box } from 'ui/src/components-v2/box'
import { Text } from 'ui/src/components-v2/typography'

import { Button } from '@src/components/button'

import * as styles from './account-swap.css'

interface IAccountSwapRequiredProps {}

interface IAccountSwapOptionalProps {
	className?: string
}

interface IAccountSwapProps extends IAccountSwapRequiredProps, IAccountSwapOptionalProps {}

const defaultProps: IAccountSwapOptionalProps = {
	className: undefined,
}

export const AccountSwap = forwardRef<HTMLElement, IAccountSwapProps>((props, ref: React.Ref<HTMLElement | null>) => {
	const { className } = props

	return (
		<Box ref={ref} className={clsx(className)}>
			<Box>Swap</Box>
		</Box>
	)
})

AccountSwap.defaultProps = defaultProps
