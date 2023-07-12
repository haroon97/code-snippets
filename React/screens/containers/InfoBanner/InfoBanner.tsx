import React from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { InfoBannerProps } from './InfoBannerProps';

export const InfoBanner: React.FC<InfoBannerProps> = ({ text }) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Box
      alignItems="center"
      bgcolor={colors.cardImportant}
      borderRadius={3}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      paddingY={1.5}
      paddingX={1.5}
    >
      <InfoOutlined color="info" />
      <Typography variant="bodyXSmall" textAlign="center" marginTop={0.75}>
        {text}
      </Typography>
    </Box>
  );
};
