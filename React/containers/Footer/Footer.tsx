import React from 'react';
import { Box, useTheme } from '@mui/material';
import { FooterProps } from './FooterProps';

/**
 * Ensure that footer is fixed on bottom
 */
export const Footer = ({ content, height = 88 }: FooterProps) => {
  const { colors } = useTheme();

  return (
    <Box height={height}>
      <Box
        position="fixed"
        bottom={0}
        px={2}
        py={3}
        height={height}
        width="100vw"
        bgcolor={colors.appBg}
        boxShadow={6}
        zIndex={100}
      >
        {content}
      </Box>
    </Box>
  );
};
