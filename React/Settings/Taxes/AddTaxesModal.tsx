import * as React from 'react'
import {
	Button as MUIButton,
	styled,
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Typography,
	InputAdornment
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store/index-reducer'
import { Formik } from 'formik'
import {
	Button,
	FieldNumberInput,
	FieldTextInput,
	FlexCol,
	FlexRow,
	Gutter
} from 'components'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { useAppErrors } from 'hooks/useAppErrors'
import { createTaxUnit, updateTaxUnit } from 'api'
import { useSnackbar } from 'notistack'
import { fetchTaxes } from 'store/settings/actions'
import { ITaxUnit } from 'typings'

const validationSchema = Yup.object().shape({
	name: Yup.string().required('Required'),
	rate: Yup.string().required('Required')
})

const Wrapper = styled(FlexCol)`
	width: 100%;
	height: 100%;
	max-width: 350px;
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

type AddTaxModalProps = {
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

export const AddTaxModal: React.ComponentType<AddTaxModalProps> = ({
	open,
	onClose,
	id
}) => {
	const dispatch = useDispatch()
	const { setAppError } = useAppErrors()
	const { enqueueSnackbar } = useSnackbar()
	const { dataSource } = useSelector(
		(state: RootState) => state.settings.taxUnits
	)

	const initialValue = useMemo(() => {
		return id
			? dataSource.filter(f => f.id === id)[0]
			: { name: '', rate: '' }
	}, [dataSource, id])

	const onSubmit = async (
		payload: Pick<ITaxUnit, 'name' | 'rate'>,
		actions: any
	) => {
		try {
			actions.setSubmitting(true)
			if (id) {
				await updateTaxUnit(id, payload)
				enqueueSnackbar('Successfully Updated', {
					variant: 'success'
				})
			} else {
				await createTaxUnit(payload)
				enqueueSnackbar('Successfully Created', {
					variant: 'success'
				})
			}
			dispatch(fetchTaxes())
			onClose()
		} catch (e: any) {
			setAppError(e, actions)
		} finally {
			actions.setSubmitting(false)
		}
	}

	/*TODO:// need delete apis*/
	const onDelete = async (actions: any) => {
		try {
			actions.setSubmitting(true)
			/*await deleteStockUnit(id || '')
			enqueueSnackbar('Successfully Deleted', {
				variant: 'success'
			})
			dispatch(fetchTaxes())*/
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
					{id ? 'Edit Tax' : 'Add Tax'}
				</Typography>
			</BootstrapDialogTitle>
			<DialogContent sx={{ width: '65ch' }}>
				<Formik
					initialValues={initialValue}
					validationSchema={validationSchema}
					onSubmit={(values, actions) => {
						const finalValue = Object.assign({}, values, {
							rate: parseInt(values.rate.toString())
						})
						onSubmit(finalValue, actions)
					}}
				>
					{({ handleSubmit, ...actions }) => (
						<Wrapper>
							<FieldTextInput
								name={'name'}
								sx={{ width: '30ch' }}
								size={'small'}
								placeholder={'Tax Name'}
							/>
							<Gutter spacing={0.8} />
							<FieldNumberInput
								name={'rate'}
								size={'small'}
								placeholder={'Tax Percentage'}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Typography variant={'body2'}>
												%
											</Typography>
										</InputAdornment>
									)
								}}
							/>

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
