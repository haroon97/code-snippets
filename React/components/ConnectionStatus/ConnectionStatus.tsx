import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import CloudOffIcon from '@mui/icons-material/CloudOff';

export const ConnectionStatus: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <CloudOffIcon fontSize="large" color='disabled' />
      <Typography marginTop={1} variant="h3">
        You're not connected to the internet
      </Typography>
      <Typography
        marginTop={1}
        variant="bodyLarge"
        color={theme.colors.placeholder}
      >
        Please check your internet connection
      </Typography>
    </Box>
  );
};
