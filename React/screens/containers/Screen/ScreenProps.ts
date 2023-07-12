import React from 'react';
import { FooterProps, NavbarProps } from '../../../containers';

export interface ScreenProps {
  navbarProps?: NavbarProps;
  footerProps?: FooterProps;
  children: React.ReactNode;
}
