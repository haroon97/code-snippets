import React from 'react'
import { styled } from '@mui/system'
import { SettingSideBar } from 'screen/Settting/Sidebar'
import { useDimension } from 'hooks'
import { LAYOUT_PADDING } from 'data/constants'
import { FlexCol, FlexRow, Gutter } from 'components'
import { Typography } from '@mui/material'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const TitleBar = styled(FlexRow)`
	height: 40px;
	align-items: center;
`

const Container = styled('div')<{ height: number }>`
	display: grid;
	grid-template-columns: 1fr 4.5fr;
	width: 100%;
	height: ${({ height }) => height - LAYOUT_PADDING * 2 - 68}px;
`

const Icon = styled(IoIosArrowBack)`
	color: ${({ theme }) => theme.palette.primary.contrastText};

	:hover {
		cursor: pointer;
	}
`

const Children = styled(FlexCol)`
	padding: 0 20px;
`

type SettingsLayoutProps = {
	children?: React.ReactNode
}

export const SettingLayout: React.ComponentType<SettingsLayoutProps> = ({
	children
}) => {
	const navigate = useNavigate()
	const { height } = useDimension()
	return (
		<>
			<TitleBar>
				<Icon onClick={() => navigate('/')} />
				<Gutter gap={0.3} />
				<Typography color={'primary'} variant={'h5'} fontWeight={600}>
					Setting
				</Typography>
			</TitleBar>
			<Gutter spacing={1} />
			<Container height={height}>
				<SettingSideBar />
				<Children>{children}</Children>
			</Container>
		</>
	)
}
