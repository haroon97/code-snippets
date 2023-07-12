import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Typography, useTheme } from '@mui/material'
import { fetchTaxes } from 'store/settings/actions'
import { FlexCol, Gutter } from 'components'
import { styled } from '@mui/system'
import { TaxesTable } from './TaxesTable'

const Wrapper = styled(FlexCol)`
	width: 100%;
	height: 100%;
`

export const Taxes = () => {
	const dispatch = useDispatch()
	const theme = useTheme()
	const { colors } = theme.palette

	useEffect(() => {
		dispatch(fetchTaxes())
	}, [dispatch])

	return (
		<Wrapper>
			<Typography
				variant={'h5'}
				fontWeight={600}
				color={colors.green['900']}
			>
				Taxes
			</Typography>
			<Gutter spacing={0.4} />
			<Typography
				variant={'subtitle1'}
				fontWeight={500}
				lineHeight={'1.4'}
				color={colors.gray['600']}
				fontFamily={'Inter'}
			>
				Manage the taxes applied to your invoices and quotations.
			</Typography>
			<Gutter spacing={1.2} />
			<TaxesTable />
		</Wrapper>
	)
}
