import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { OfferBannerProps } from './OfferBannerProps';

export const OfferBanner: React.FC<OfferBannerProps> = ({ loan }: OfferBannerProps) => {
  const theme = useTheme();
  const { colors } = theme;

  const offerAmount = loan.getMaxOutstanding() - loan.getOutstandingTillDate();
  return (
    <Box
      display="flex"
      flexDirection={'column'}
      paddingX={1.5}
      paddingY={1.5}
      boxShadow={1}
      borderRadius={2}
      sx={{
        background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryExtraLight})`,
      }}
    >
      <Box flexDirection={'column'}>
        <Typography variant="h6" color={colors.appBg}>
          Order aaj clear kar ke
        </Typography>
        <Typography
          variant="h6"
          sx={{
            background: `linear-gradient(-100deg, ${colors.gradientDark}, ${colors.gradientLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Rs. {offerAmount.toLocaleString()} bachayen!
        </Typography>
      </Box>
      <Box display={'flex'} alignSelf={'flex-end'} flexDirection={'row'} alignItems={'center'}>
        <Typography variant="bodyXSmall" color={colors.appBg} mr={0.3} mt={0.6}>
          Pay only
        </Typography>
        <Typography variant="h5" color={colors.appBg}>
          Rs. {loan.getOutstandingTillDate().toLocaleString()}*
        </Typography>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography variant="bodyXSmall" color={colors.appBg}>
          *only valid for today
        </Typography>
        <Typography
          variant="h8"
          color={colors.appBg}
          sx={{
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            textDecorationColor: colors.overlayBlack,
          }}
        >
          Rs. {loan.getMaxOutstanding().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};
