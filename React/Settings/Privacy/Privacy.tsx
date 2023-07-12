import React from 'react'
import { Button, FlexCol, FlexRow, Gutter } from 'components'
import { styled } from '@mui/system'
import { Typography, useTheme } from '@mui/material'
import { ColorsCodeType } from 'typings'
import { IoMdClose } from 'react-icons/io'

const Wrapper = styled(FlexCol)``

const CloseIcon = styled(FlexCol)`
	justify-content: center;
	align-items: center;
	height: 30px;
	width: 30px;
	border-radius: 15px;

	background-color: ${({ theme }) => theme.palette.colors.red['100']};
`

export const Privacy = () => {
	const theme = useTheme()
	const { colors } = theme.palette
	return (
		<Wrapper>
			<Typography
				variant={'h5'}
				fontWeight={600}
				color={theme.palette.colors.green['900']}
			>
				Screen Lock
			</Typography>
			<Gutter spacing={0.4} />
			<Typography
				variant={'subtitle1'}
				fontWeight={500}
				lineHeight={'1.4'}
				color={theme.palette.colors.gray['600']}
				fontFamily={'Inter'}
			>
				Setting up Screen Lock allows you to instantly lock and hide
				your WebApp screen, so you can keep your confidential data
				secure. You can enable it from the side navigation.
			</Typography>
			<Gutter spacing={2} />
			<FlexRow align={'center'}>
				<CloseIcon>
					<IoMdClose color={colors.red['900']} />
				</CloseIcon>
				<Gutter gap={1} />
				<Typography
					variant={'subtitle1'}
					fontWeight={500}
					lineHeight={'1.4'}
					color={theme.palette.colors.gray['600']}
					fontFamily={'Inter'}
				>
					You do not have a Screen Lock PIN
				</Typography>
			</FlexRow>
			<Gutter spacing={2} />
			<Button
				textColor={colors['gray']['900'] as ColorsCodeType}
				mode={'primary'}
				buttonColor={colors['yellow']['300'] as ColorsCodeType}
			>
				Setup Pin
			</Button>
		</Wrapper>
	)
}
