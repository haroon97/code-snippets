import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { NavbarProps } from './NavbarProps';
import { CbButton } from '../../components';
// import { useNavbar } from '../../context';

/**
 * TODO: Navbar is being used within the screen but
 * move it to the navigation context by using navbar
 */
const Navbar: React.FC<NavbarProps> = ({ title, showHelp, onBackIconPress }: NavbarProps) => {
  const theme = useTheme();
  // const {
  //   navbarProps: { title, showHelp },
  // } = useNavbar();

  const { colors } = theme;

  return (
    <Box
      display="flex"
      paddingX={2}
      paddingY={2}
      justifyContent={'space-between'}
      alignItems={'center'}
      boxShadow={2}
    >
      <Box display="flex" alignItems="center">
        <Box marginRight={0.5}>
          <IconButton size="small" onClick={onBackIconPress}>
            <ArrowBack color="primary" fontSize="medium" />
          </IconButton>
        </Box>
        <Typography variant="h4" color={colors.highEmphasis}>
          {title}
        </Typography>
      </Box>
      {showHelp && (
        <CbButton variant="outlined" size="small">
          <Typography variant="bodyXSmallBold">Help</Typography>
        </CbButton>
      )}
    </Box>
  );
};

/**
 * Ensure that navbar is fixed on top
 */
const FixedNavbar = (props: NavbarProps) => {
  // const {
  //   navbarProps: { hidden },
  // } = useNavbar();
  const theme = useTheme();
  const { colors } = theme;

  // if (hidden) {
  //   return <></>;
  // }

  return (
    <Box height={66}>
      <Box
        position="fixed"
        left={0}
        top={0}
        height={66}
        zIndex={100}
        width="100vw"
        sx={{ backgroundColor: colors.appBg }}
      >
        <Navbar {...props} />
      </Box>
    </Box>
  );
};

export { FixedNavbar as Navbar };
