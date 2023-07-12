export interface NavbarProps {
  /**
   * Text in the header
   */
  title: string;

  /**
   * A flag that tells if the header should have help button
   */
  showHelp?: boolean;

  /**
   * Navbar get hidden if true
   */
  hidden?: boolean;

  /**
   * Function that is called when back icon is pressed
   */
  onBackIconPress?: () => void;
}
