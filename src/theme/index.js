/**
 * Theme index — central export point
 * Usage: import { useTheme } from '../theme';
 */

import React, {createContext, useContext, useState} from 'react';
import {useColorScheme} from 'react-native';
import {lightColors, darkColors} from './colors';
import {fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textVariants} from './fonts';
import {spacing, borderRadius, iconSize, avatarSize, buttonHeight, inputHeight, zIndex} from './spacing';
import {shadows} from './shadows';

// Build theme object from mode
const buildTheme = mode => {
  const colors = mode === 'dark' ? darkColors : lightColors;
  return {
    mode,
    isDark: mode === 'dark',
    colors,
    fonts: {fontFamily, fontSize, fontWeight, lineHeight, letterSpacing},
    textVariants,
    spacing,
    borderRadius,
    iconSize,
    avatarSize,
    buttonHeight,
    inputHeight,
    zIndex,
    shadows,
  };
};

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');

// ─── Theme Context ────────────────────────────────────────────────────────────

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({children}) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(systemScheme || 'light');

  const theme = buildTheme(themeMode);

  const toggleTheme = () =>
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));

  const setMode = mode => setThemeMode(mode);

  return (
    <ThemeContext.Provider value={{...theme, toggleTheme, setMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default buildTheme;
