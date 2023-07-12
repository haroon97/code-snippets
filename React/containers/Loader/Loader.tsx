import React from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { LoaderProps } from './LoaderProps';

export const Loader = ({ isLoading }: LoaderProps) => {
  const theme = useTheme();
  const { colors } = theme;

  if (!isLoading) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex={9999}
      sx={{ backgroundColor: colors.appBg }}
    >
      <CircularProgress />
    </Box>
  );
};
