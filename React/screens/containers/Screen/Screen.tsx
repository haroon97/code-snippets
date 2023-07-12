import React from 'react';
import { Footer, Navbar } from '../../../containers';
import { ScreenProps } from './ScreenProps';

export const Screen = ({ navbarProps, footerProps, children }: ScreenProps) => {
  return (
    <>
      {navbarProps && <Navbar {...navbarProps} />} {/* Render navbar if navbarProps exist */}
      {children} {/* Render the children */}
      {footerProps && <Footer {...footerProps} />} {/* Render footer if footerProps exist */}
    </>
  );
};

export default Screen;
