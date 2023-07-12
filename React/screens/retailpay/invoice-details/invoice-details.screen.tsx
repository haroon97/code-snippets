import React, { useState } from 'react';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { Box, Grid, Icon, IconButton, useTheme } from '@mui/material';
import { CbButton, Text } from '../../../components';
import { InfoBanner, InstructionsModal, Screen } from '../../containers';
import { useStores } from '../../../stores/useStores';
import { useApis } from '../../../api-services/useApis';
import { useNavbar } from '../../../context';
import { MessageType } from '../../../helpers';

export const InvoiceDetails: React.FC = () => {
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const {
    retailpayStore: { paymentInvoice, loan },
  } = useStores();
  const { retailpayApi } = useApis();
  const theme = useTheme();

  useNavbar({
    title: 'Adaiyagi Karein',
    showHelp: true,
  });

  const { colors } = theme;
  const { consumerNumber, consumerName } = paymentInvoice;

  const downloadInvoice = () => {
    retailpayApi.getPaymentInvoicePdf(loan.id, paymentInvoice.id);
  };

  const closeWebView = () => {
    retailpayApi.publishQuery({
      type: MessageType.ExitApp,
    });
  };

  const footerContent = (
    <Grid container spacing={1} alignItems="flex-end">
      <Grid item xs={6}>
        <CbButton
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => setShowInstructionsModal(!showInstructionsModal)}
        >
          <Text variant="buttonMedium" tx="instructions" />
        </CbButton>
      </Grid>
      <Grid item xs={6}>
        <CbButton fullWidth variant="contained" size="large" onClick={closeWebView}>
          <Text variant="buttonMedium" tx="done" />
        </CbButton>
      </Grid>
    </Grid>
  );

  return (
    <Screen
      navbarProps={{ title: 'Adayigi Karein', onBackIconPress: closeWebView }}
      footerProps={{ content: footerContent }}
    >
      <Box display="flex" flexDirection="column" flex={1} overflow="hidden">
        <Box marginX={3} marginTop={2}>
          <InfoBanner
            text={`Yeh 1Bill invoice ${paymentInvoice
              .getExpiryDate()
              .format('DD/MM/YYYY hh:mm A')} par expire hojaye gi, jiskay baad
        aapko dobara nayi invoice banani hogi`}
          />
        </Box>
        <Box bgcolor={colors.surfaceBasic} borderRadius={3} marginX={3} my={2}>
          <Box mx={3} my={2} height="100%">
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Text variant="h5" color="primary.dark" tx="oneBillInvoiceVoucher" />
              <IconButton onClick={downloadInvoice}>
                <FileDownloadIcon sx={{ color: colors.highEmphasis }} />
              </IconButton>
            </Box>
            <Box display="flex" flexDirection="column" mt={1}>
              <Text
                variant="bodyMediumBold"
                color={colors.highEmphasis}
                tx="consumerInvoiceNumber"
              />
              <Box display="flex" alignItems="center">
                <Text variant="bodyMedium" color={colors.highEmphasis}>
                  {consumerNumber}
                </Text>
                <Icon sx={{ color: colors.mediumEmphasis, marginLeft: 1 }} fontSize="small">
                  content_copy
                </Icon>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" mt={2}>
              <Text variant="bodyMediumBold" color={colors.highEmphasis} tx="paymentDueDate" />
              <Text variant="bodyMedium" color={colors.highEmphasis}>
                {paymentInvoice.getDueDate().format('DD/MM/YYYY')}
              </Text>
            </Box>
            <Box display="flex" flexDirection="column" mt={2}>
              <Text variant="bodyMediumBold" color={colors.highEmphasis} tx="billTitle" />
              <Text variant="bodyMedium" color={colors.highEmphasis}>
                {consumerName}
              </Text>
            </Box>

            <Box display="flex" flexDirection="column" mt={2}>
              <Text variant="bodyMediumBold" color={colors.highEmphasis} tx="billedAmount" />
              <Text
                variant="bodyMedium"
                color={colors.highEmphasis}
                tx="invoiceAmount"
                txOptions={{ amount: paymentInvoice.invoiceAmount }}
              />
              <Text
                variant="bodyMedium"
                color={colors.highEmphasis}
                tx="transactionFee"
                txOptions={{ amount: paymentInvoice.getTransactionFee() }}
              />
              <Box mt={1}>
                <Text
                  variant="bodyMediumBold"
                  color={colors.highEmphasis}
                  tx="outstandingAmount"
                  txOptions={{ amount: paymentInvoice.amountWithinDueDate }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <InstructionsModal
          isVisible={showInstructionsModal}
          onClose={() => setShowInstructionsModal(false)}
          onOkClick={() => setShowInstructionsModal(false)}
        />
      </Box>
    </Screen>
  );
};
