export enum Direction {
  LTR = 'ltr',
  RTL = 'rtl',
}

export enum Locale {
  English = 'english',
  RomanUrdu = 'romanUrdu',
}

export enum SettingsKey {
  Locale = 'locale',
  Direction = 'direction',
}

export interface AppSettingsContextProps {
  locale: Locale;
  setAppLocale: (locale: Locale) => void;
  direction: Direction;
  setAppDirection: (direction: Direction) => void;
}
