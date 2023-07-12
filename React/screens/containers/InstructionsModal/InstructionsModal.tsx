import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import Modal from '@mui/material/Modal';
import { InstructionsModalProps } from './InstructionsModalProps';

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isVisible,
  onClose,
  onOkClick,
}: InstructionsModalProps) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Modal open={isVisible} onClose={onClose} disableAutoFocus>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width="90%"
        bgcolor={colors.appBg}
        boxShadow={24}
        p={2}
        borderRadius={2}
        sx={{ transform: 'translate(-50%, -50%)' }}
      >
        <Typography variant="h5">Instructions</Typography>
        <Typography variant="bodyMedium" color={colors.mediumEmphasis}>
          1Bill Invoice Voucher ke zariye adayigi:
          <ol style={{ marginTop: 0, paddingLeft: 20 }}>
            <li>
              Apnay Banking App mein log in karein, yaqeeni bana lein ke aapka balance kaafi hai
            </li>
            <li>Biller ke taur par 1Bill (Invoice/Voucher) ka intekhaab karein</li>
            <li>Consumer Invoice Number paste karein</li>
            <li>Maloomat ki tasdeeq kar ke Submit karein</li>
          </ol>
        </Typography>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button variant="contained" sx={{ textTransform: 'none' }} onClick={onOkClick}>
            Okay
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
