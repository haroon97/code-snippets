import React, { useState } from 'react';
import { Box, InputAdornment, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { Chip, TextInput, CbButton, Text } from '../../../components';
import { Screen } from '../../containers';
import { useStores } from '../../../stores/useStores';
import { useApis } from '../../../api-services/useApis';
import RupeeImage from '../../../assets/rs.png';
import { CreatePaymentInvoiceParams } from '../../../api-services/retailpay/retailpay.api.types';
import { Route } from '../../../router/routes';
import { InvoiceGenerator } from '../../../models';
import { MessageType } from '../../../helpers';

const MIN_LOAN_AMOUNT = 1000;

export const PayNowScreen: React.FC = observer(() => {
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [inputErrors, setInputErrors] = useState({
    invoiceAmount: false,
    invoiceAmountText: '',
    consumerName: false,
    consumerNameText: '',
  });

  const navigate = useNavigate();
  const theme = useTheme();

  const {
    retailpayStore: { loan, outstandingLoanAmount },
  } = useStores();
  const { retailpayApi } = useApis();

  const { colors } = theme;

  const validateInvoiceAmountField = (invoiceAmount: string) => {
    if (Number(invoiceAmount) < MIN_LOAN_AMOUNT) {
      setInputErrors({
        ...inputErrors,
        invoiceAmount: true,
        invoiceAmountText: `Amount should be greater than or equal to ${MIN_LOAN_AMOUNT.toLocaleString()}`,
      });
      return false;
    } else if (Number(invoiceAmount) > outstandingLoanAmount) {
      setInputErrors({
        ...inputErrors,
        invoiceAmount: true,
        invoiceAmountText: `Amount should be less than or equal to ${outstandingLoanAmount.toLocaleString()}`,
      });
      return false;
    }

    setInputErrors({
      ...inputErrors,
      invoiceAmount: false,
      invoiceAmountText: '',
    });

    return true;
  };

  const validateConsumerNameField = (consumerName: string) => {
    if (consumerName.length < 3) {
      setInputErrors({
        ...inputErrors,
        consumerName: true,
        consumerNameText: 'Consumer name should be atleast 3 characters',
      });
      return false;
    }

    setInputErrors({ ...inputErrors, consumerName: false, consumerNameText: '' });

    return true;
  };

  const generateOneBillInvoice = async () => {
    const isInvoiceAmountValid = validateInvoiceAmountField(invoiceAmount);
    const isConsumerNameValid = validateConsumerNameField(consumerName);

    if (isInvoiceAmountValid && isConsumerNameValid) {
      const params: CreatePaymentInvoiceParams = {
        consumer_name: consumerName,
        invoice_amount: Number(invoiceAmount),
        generated_by: InvoiceGenerator.RetailPay,
      };
      const response = await retailpayApi.createPaymentInvoice(params, loan.id);

      if (response.data) {
        navigate(Route.InvoiceDetails);
      }
    }
  };

  const footerContent = (
    <CbButton
      fullWidth
      disabled={!invoiceAmount || !consumerName}
      size="large"
      variant="contained"
      onClick={generateOneBillInvoice}
    >
      <Text variant="buttonMedium" tx="generateOneBillInvoice" />
    </CbButton>
  );

  const closeWebView = () => {
    retailpayApi.publishQuery({
      type: MessageType.ExitApp,
    });
  };

  return (
    <Screen
      navbarProps={{ title: 'Adayigi Karein', onBackIconPress: closeWebView }}
      footerProps={{ content: footerContent }}
    >
      <Box pt={2} px={2} display="flex" flexDirection="column">
        <Box boxShadow={1} py={1.25} pl={1.5} borderRadius={2}>
          <Text
            color="primary.dark"
            variant="h4"
            tx="remainingAmount"
            txOptions={{ amount: outstandingLoanAmount.toLocaleString() }}
          />
        </Box>
        <Text variant="bodySmall" color={colors.mediumEmphasis} my={2} tx="payNowHeading" />
        <Text variant="bodySmallBold" color={colors.mediumEmphasis} mb={1} tx="paymentMethod" />
        <Box display={'flex'}>
          <Chip isSelected icon="phonelink_ring" text="1Bill" onClick={() => {}} mr={1} />
        </Box>
        <Box marginTop={3}>
          <TextInput
            fullWidth
            type="number"
            placeholder="Raqam*"
            label="Raqam"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={RupeeImage} width={20} height={12} />
                </InputAdornment>
              ),
            }}
            value={invoiceAmount}
            onChange={(event) => {
              setInvoiceAmount(event.target.value);
              validateInvoiceAmountField(event.target.value);
            }}
            error={inputErrors.invoiceAmount}
            helperText={inputErrors.invoiceAmountText}
          />
        </Box>
        <Box marginTop={3}>
          <TextInput
            fullWidth
            label="Name*"
            placeholder="Name*"
            onChange={(event) => {
              setConsumerName(event.target.value);
              validateConsumerNameField(event.target.value);
            }}
            error={inputErrors.consumerName}
            helperText={inputErrors.consumerNameText}
          />
        </Box>
        <Text mt={3} variant="bodyMedium" color={colors.highEmphasis} tx="minimumAmount" />
      </Box>
    </Screen>
  );
});
