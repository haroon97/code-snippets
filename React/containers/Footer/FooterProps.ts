import React from 'react';

export interface FooterProps {
  /**
   * Content to be shown in the footer
   */
  content?: React.ReactNode;

  /**
   * To pass custom height of the box
   */
  height?: number;
}
