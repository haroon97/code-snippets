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
import { MdModeEdit } from 'react-icons/md'
import moment from 'moment'
import { ColorsCodeType, ITaxUnitRes } from 'typings'
import { AiOutlinePlus } from 'react-icons/ai'
import { AddTaxModal } from 'screen/Settting/Taxes/AddTaxesModal'

const StyledTableRow = styled(TableRow)(() => ({
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0
	}
}))

const StyledButton = styled(Btn)`
	padding: 5px 10px;
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
	grid-template-columns: 1fr 1fr 1fr 0.5fr;
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
export const TaxesTable: React.ComponentType<InventoryTablePrpos> = ({
	isEditable = true
}) => {
	const [open, setOpen] = useState(false)
	const [editId, setEditId] = useState<undefined | string>(undefined)
	const ref = useRef<HTMLDivElement>(null)
	const theme = useTheme()
	const { dataSource } = useSelector(
		(state: RootState) => state.settings.taxUnits
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
		({ name, id, updatedAt, rate }: ITaxUnitRes) => {
			return (
				<MUIRow>
					<StyledTableCell component="th" scope="row">
						<Typography variant={'body2'} fontWeight={500}>
							{name}
						</Typography>
					</StyledTableCell>
					<StyledTableCell component="th" scope="row">
						<Typography variant={'body2'} fontWeight={500}>
							{rate}%
						</Typography>
					</StyledTableCell>
					<StyledTableCell align="left">
						<Typography variant={'body2'} fontWeight={500}>
							{moment(updatedAt).format('D MMMM YYYY')}
						</Typography>
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
							<StyledTableCell>Tax Name</StyledTableCell>
							<StyledTableCell>Tax Rate</StyledTableCell>
							<StyledTableCell align="left">
								Last Updated
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
							Add a new Tax
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
			<AddTaxModal onClose={onClose} open={open} id={editId} />
		</Wrapper>
	)
}
