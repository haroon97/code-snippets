import React, { useEffect } from 'react'
import { Typography, useTheme } from '@mui/material'
import { styled } from '@mui/system'
import { FlexCol, Gutter } from 'components'
import { useDispatch } from 'react-redux'
import { fetchAllStock } from 'store/settings/actions'
import { InventoryTable } from 'screen/Settting/Inventory/InventoryTable'

const Wrapper = styled(FlexCol)`
	width: 100%;
	height: 100%;
`

export const SettingInventory = () => {
	const dispatch = useDispatch()
	const theme = useTheme()
	const { colors } = theme.palette

	useEffect(() => {
		dispatch(fetchAllStock())
	}, [dispatch])

	return (
		<Wrapper>
			<Typography
				variant={'h5'}
				fontWeight={600}
				color={colors.green['900']}
			>
				Inventory
			</Typography>
			<Gutter spacing={0.4} />
			<Typography
				variant={'subtitle1'}
				fontWeight={500}
				lineHeight={'1.4'}
				color={colors.gray['600']}
				fontFamily={'Inter'}
			>
				Customise your inventory units to manage stock items easily.
			</Typography>
			<Gutter spacing={1.2} />
			<Typography variant={'h6'}>Units</Typography>
			<Gutter spacing={0.4} />
			<InventoryTable />
		</Wrapper>
	)
}
