import React, { useCallback, useMemo, useState } from 'react'
import { styled } from '@mui/system'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { SETTING_SIDEBAR } from 'data/sidebar'
import { useTranslate } from 'hooks'
import { useTheme, outlinedInputClasses, Typography } from '@mui/material'
import { Gutter, SearchBar } from 'components'

const MainContainer = styled('div')`
	display: flex;
	height: 100%;
`

const Sections = styled('section')`
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: flex-start;
`

const LinkText = styled(motion.div)`
	white-space: nowrap;
`

const StyledNavLink = styled(NavLink, {})`
	text-decoration-line: none;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding-inline-start: 15px;
	column-gap: 25px;
	border-radius: 4px;
	row-gap: 10px;
	width: 100%;
	height: 40px;
	margin: 3px 0;
	background-color: ${({ theme }) => theme.palette.background.default};
	color: ${({ theme }) => theme.palette.primary.contrastText};

	:hover {
		background-color: ${({ theme }) => theme.palette.colors.green['200']};
		color: ${({ theme }) => theme.palette.primary.main};
	}
`

const SearchInput = styled(SearchBar)(({ theme }) => ({
	width: '100%',
	backgroundColor: theme.palette.background.default,
	overflow: 'hidden',

	[`& .${outlinedInputClasses.root}`]: {
		borderRadius: '40px'
	}
}))

const MotionDiv = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	color: theme.palette.primary.contrastText,
	display: 'flex',
	flex: 1,
	width: '230px',
	height: '100%',
	alignItems: 'stretch',
	padding: '7px 12px',
	flexDirection: 'column'
}))

const SettingSideBar = () => {
	const [activeItem, setActiveItem] = useState<string | undefined>(undefined)
	const translate = useTranslate()
	const theme = useTheme()

	const isActiveStyle = useMemo(() => {
		return {
			backgroundColor: theme.palette.colors.green['600'],
			color: theme.palette.background.default
		}
	}, [theme.palette])

	const activeStyle = useCallback(
		(isActive: boolean, path?: string) => {
			return activeItem
				? activeItem === path
					? isActiveStyle
					: {}
				: isActive
				? isActiveStyle
				: {}
		},
		[activeItem, isActiveStyle]
	)

	return (
		<MainContainer>
			<MotionDiv>
				<Gutter spacing={0.5} />
				<Typography variant={'subtitle1'}>Quick Access Menu</Typography>
				<Gutter />
				<SearchInput />
				<Gutter spacing={2} />
				<Sections>
					{SETTING_SIDEBAR.map(item => (
						<StyledNavLink
							style={({ isActive }) =>
								activeStyle(isActive, item.path)
							}
							onMouseOver={() => {
								setActiveItem(item.path)
							}}
							onMouseOut={() => {
								setActiveItem(undefined)
							}}
							to={item.path}
							key={item.name}
						>
							<LinkText
								initial={'hidden'}
								animate={'show'}
								exit={'hidden'}
							>
								{translate(item.name)}
							</LinkText>
						</StyledNavLink>
					))}
				</Sections>
			</MotionDiv>
		</MainContainer>
	)
}

export { SettingSideBar }
