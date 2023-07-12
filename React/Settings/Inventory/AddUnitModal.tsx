import * as React from 'react'
import {
	Button as MUIButton,
	styled,
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store/index-reducer'
import { Formik } from 'formik'
import { Button, FieldTextInput, FlexCol, FlexRow, Gutter } from 'components'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { IStockUnits } from 'typings/setting/stockUnit'
import { useAppErrors } from 'hooks/useAppErrors'
import { createStockUnit, deleteStockUnit, updateStockUnit } from 'api'
import { useSnackbar } from 'notistack'
import { fetchAllStock } from 'store/settings/actions'

const validationSchema = Yup.object().shape({
	name: Yup.string().required('Required')
})

const Wrapper = styled(FlexCol)`
	width: 100%;
	height: 100%;
`

const Btn = styled(MUIButton)`
	padding: 8px 20px;
`

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2)
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1)
	}
}))

type AddUnitModalProps = {
	id?: string
	open: boolean
	onClose(): void
}

export interface DialogTitleProps {
	id: string
	children?: React.ReactNode
	onClose: () => void
}

function BootstrapDialogTitle(props: DialogTitleProps) {
	const { children, onClose, ...other } = props

	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme => theme.palette.grey[500]
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	)
}

export const AddUnitModal: React.ComponentType<AddUnitModalProps> = ({
	open,
	onClose,
	id
}) => {
	const dispatch = useDispatch()
	const { setAppError } = useAppErrors()
	const { enqueueSnackbar } = useSnackbar()
	const { dataSource } = useSelector(
		(state: RootState) => state.settings.stockUnit
	)

	const initialValue = useMemo(() => {
		return id ? dataSource.filter(f => f.id === id)[0] : { name: '' }
	}, [dataSource, id])

	const onSubmit = async (
		payload: Pick<IStockUnits, 'name'> | { name: string },
		actions: any
	) => {
		try {
			actions.setSubmitting(true)
			if (id) {
				await updateStockUnit(id, payload)
				enqueueSnackbar('Successfully Updated', {
					variant: 'success'
				})
			} else {
				await createStockUnit(payload)
				enqueueSnackbar('Successfully Created', {
					variant: 'success'
				})
			}
			dispatch(fetchAllStock())
			onClose()
		} catch (e: any) {
			setAppError(e, actions)
		} finally {
			actions.setSubmitting(false)
		}
	}

	const onDelete = async (actions: any) => {
		try {
			actions.setSubmitting(true)
			await deleteStockUnit(id || '')
			enqueueSnackbar('Successfully Deleted', {
				variant: 'success'
			})
			dispatch(fetchAllStock())
			onClose()
		} catch (e: any) {
			setAppError(e, actions)
		} finally {
			actions.setSubmitting(true)
		}
	}

	return (
		<BootstrapDialog
			onClose={onClose}
			aria-labelledby="customized-dialog-title"
			open={open}
		>
			<BootstrapDialogTitle
				id="customized-dialog-title"
				onClose={onClose}
			>
				<Typography variant={'h6'} fontWeight={600}>
					{id ? 'Edit Unit' : 'Add Custom Unit'}
				</Typography>
			</BootstrapDialogTitle>
			<DialogContent style={{ width: 400 }}>
				<Formik
					initialValues={initialValue}
					validationSchema={validationSchema}
					onSubmit={(values, actions) => {
						onSubmit(values, actions)
					}}
				>
					{({ handleSubmit, ...actions }) => (
						<Wrapper>
							<FlexRow>
								<FieldTextInput name={'name'} />
							</FlexRow>
							<Gutter spacing={4} />
							<FlexRow
								justify={'flex-end'}
								align={'center'}
								style={{
									width: '100%'
								}}
							>
								{id && (
									<Btn
										variant="outlined"
										color="error"
										onClick={() => onDelete(actions)}
										disabled={actions.isSubmitting}
									>
										<Typography
											fontWeight={600}
											variant={'subtitle1'}
										>
											{'Delete'}
										</Typography>
									</Btn>
								)}
								{!id && (
									<Btn
										variant={'text'}
										onClick={() => {
											onClose()
										}}
										disabled={actions.isSubmitting}
									>
										Cancel
									</Btn>
								)}
								<Gutter gap={1} />
								<Button
									type="submit"
									disabled={
										actions.isSubmitting || !actions.dirty
									}
									onClick={() => handleSubmit()}
									style={{ padding: '10px 20px' }}
								>
									{id ? 'Done' : 'Save'}
								</Button>
							</FlexRow>
						</Wrapper>
					)}
				</Formik>
			</DialogContent>
		</BootstrapDialog>
	)
}
