import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
	Pagination,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme
} from '@mui/material'
import { Button as Btn, Capsule, FlexCol, FlexRow, Gutter } from 'components'
import { useSelector } from 'react-redux'
import { RootState } from 'store/index-reducer'
import { styled } from '@mui/system'
import { MdModeEdit, MdOutlineAdUnits } from 'react-icons/md'
import moment from 'moment'
import { ColorsCodeType } from 'typings'
import { AiOutlinePlus } from 'react-icons/ai'
import { IStockUnits } from 'typings/setting/stockUnit'
import { AddUnitModal } from 'screen/Settting/Inventory/AddUnitModal'

const StyledTableRow = styled(TableRow)(() => ({
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0
	}
}))

const StyledButton = styled(Btn)`
	padding: 5px 10px;
`

const CircleWrapper = styled(FlexRow)`
	border-radius: 50%;
	background-color: ${({ theme }) => theme.palette.colors.green['50']};
	padding: 10px;
`

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	padding: 7,
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.background.paper,
		color:
			theme.palette.mode === 'dark'
				? theme.palette.colors['gray']['400']
				: theme.palette.colors['gray']['500']
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14
	}
}))

const MUITable = styled(Table)`
	display: flex;
	flex-direction: column;
`

const MUIRow = styled(StyledTableRow)`
	display: grid;
	justify-content: center;
	grid-template-columns: 3fr 1fr 1fr;
`

const Footer = styled(FlexRow)`
	position: absolute;
	bottom: 0;
	flex: 1;
	width: 100%;
	justify-content: space-between;
	padding: 7px;
	align-items: center;
`

const Wrapper = styled(FlexCol)`
	position: relative;
	flex: 1;
	width: 100%;
	border: 1px ${({ theme }) => theme.palette.background.paper} solid;
`

const StyledCapsule = styled(Capsule)`
	border-radius: 5px;
	max-width: 80px;
	padding: 7px 10px;
`

type InventoryTablePrpos = {
	isEditable?: boolean
}
export const InventoryTable: React.ComponentType<InventoryTablePrpos> = ({
	isEditable = true
}) => {
	const [open, setOpen] = useState(false)
	const [editId, setEditId] = useState<undefined | string>(undefined)
	const ref = useRef<HTMLDivElement>(null)
	const theme = useTheme()
	const { dataSource } = useSelector(
		(state: RootState) => state.settings.stockUnit
	)
	const [config, setConfig] = useState({
		page: 0,
		count: 0
	})

	useEffect(() => {
		if (config.count !== dataSource.length) {
			setConfig({ ...config, count: dataSource.length })
		}
	}, [config, dataSource])

	const { page, count } = config
	const rowsPerPage = ref?.current
		? Math.ceil(ref?.current?.clientHeight / 67) - 1
		: 5

	const paginationCount = Math.ceil(count / rowsPerPage)

	const onConfigChange = useCallback(
		(key: string, value: any) => {
			setConfig({ ...config, [key]: value })
		},
		[config]
	)

	const onClose = () => {
		setOpen(false)
		setEditId(undefined)
	}

	const RenderRow = useCallback(
		({ name, createdAt, id }: IStockUnits) => {
			return (
				<MUIRow>
					<StyledTableCell component="th" scope="row">
						<FlexRow align="center">
							<CircleWrapper>
								<MdOutlineAdUnits color={'green'} size="20px" />
							</CircleWrapper>
							<Gutter gap={0.5} />
							<Typography variant={'subtitle1'} fontWeight={500}>
								{name}
							</Typography>
						</FlexRow>
					</StyledTableCell>
					<StyledTableCell align="left">
						{moment(createdAt).format('D MMMM YYYY')}
					</StyledTableCell>
					{isEditable && (
						<StyledTableCell align="right">
							<StyledCapsule
								renderLeft={
									<FlexRow>
										<MdModeEdit />
										<Gutter gap={0.4} />
									</FlexRow>
								}
								name={'Edit'}
								value={'edit'}
								color={'green'}
								onItemClick={() => {
									setEditId(id)
									setOpen(true)
								}}
								isSelected
							/>
						</StyledTableCell>
					)}
				</MUIRow>
			)
		},
		[isEditable]
	)

	return (
		<Wrapper ref={ref}>
			<TableContainer>
				<MUITable aria-label="customized table">
					<TableHead>
						<MUIRow>
							<StyledTableCell>Custom Unit</StyledTableCell>
							<StyledTableCell align="left">
								Created Date
							</StyledTableCell>
							{isEditable && <StyledTableCell align="right" />}
						</MUIRow>
					</TableHead>
					<TableBody>
						{dataSource
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map(row => (
								<RenderRow key={row.name} {...row} />
							))}
					</TableBody>
				</MUITable>
				<Footer>
					{isEditable && (
						<StyledButton
							textColor={
								theme.palette.colors['gray'][
									'900'
								] as ColorsCodeType
							}
							mode={'primary'}
							buttonColor={
								theme.palette.colors['yellow'][
									'300'
								] as ColorsCodeType
							}
							onClick={() => {
								setOpen(true)
							}}
						>
							<AiOutlinePlus />
							<Gutter gap={0.5} />
							Add a new Unit
						</StyledButton>
					)}
					<Pagination
						page={page + 1}
						count={
							paginationCount === Infinity ? 1 : paginationCount
						}
						variant="outlined"
						shape="rounded"
						onChange={(event, page) =>
							onConfigChange('page', page - 1)
						}
					/>
				</Footer>
			</TableContainer>
			<AddUnitModal onClose={onClose} open={open} id={editId} />
		</Wrapper>
	)
}
