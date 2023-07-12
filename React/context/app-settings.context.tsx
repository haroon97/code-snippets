import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  Direction,
  AppSettingsContextProps,
  Locale,
  SettingsKey,
} from './app-settings.context.types';
import { LocalStorage } from '../../helpers';

const defaultLocale = Locale.RomanUrdu;
const defaultDirection = Direction.LTR;

const AppSettingsContext = createContext<AppSettingsContextProps>({} as AppSettingsContextProps);

export const AppSettingsProvider = ({ children, settings }: any) => {
  const localStorage = new LocalStorage();
  const [locale, setLocale] = useState(localStorage.getValue(SettingsKey.Locale) || defaultLocale);
  const [direction, setDirection] = useState(
    localStorage.getValue(SettingsKey.Direction) || defaultDirection
  );

  const value = useMemo(() => {
    return {
      ...settings,
      locale,
      setAppLocale: (locale: Locale) => {
        setLocale(locale);
        localStorage.setValue(SettingsKey.Locale, locale);
      },
      direction,
      setAppDirection: (direction: Direction) => {
        setDirection(direction);
        localStorage.setValue(SettingsKey.Direction, direction);
      },
    };
  }, [locale, direction, setLocale, setDirection]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
};

export const useAppSettings = () => useContext(AppSettingsContext);
