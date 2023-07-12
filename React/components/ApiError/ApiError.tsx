import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { ApiErrorProps } from ".";

export const ApiError: React.FC<ApiErrorProps> = ({ refreshData }) => {
  const theme = useTheme();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <ErrorIcon fontSize="large" color="error" />
      <Typography marginTop={1} variant="h3">
        Something went wrong
      </Typography>
      <Typography
        marginTop={1}
        variant="bodyLarge"
        color={theme.colors.placeholder}
      >
        Try refreshing the page
      </Typography>
      <Button sx={{ marginTop: 1 }} size="small" onClick={refreshData}>
        Refresh
      </Button>
    </Box>
  );
};
