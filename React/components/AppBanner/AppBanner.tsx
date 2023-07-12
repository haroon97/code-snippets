import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { AppBannerProps } from "./AppBannerProps";

export const AppBanner: React.FC<AppBannerProps> = ({ message }) => {
  const theme = useTheme();

  return (
    <Box
      paddingX={2}
      paddingY={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color={theme.colors.cardSuccess}
      bgcolor="primary.dark"
    >
      <Box>
        <Typography  variant="h4">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};
