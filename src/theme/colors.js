/**
 * Centralized color palette
 * Supports light and dark mode
 */

const palette = {
  // Primary Brand
  primary: '#0B2EF3',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primarySurface: '#EFF6FF',

  // Secondary
  secondary: '#7C3AED',
  secondaryDark: '#6D28D9',
  secondaryLight: '#8B5CF6',

  // Accent
  accent: '#F59E0B',
  accentDark: '#D97706',
  accentLight: '#FCD34D',

  // Success
  success: '#10B981',
  successDark: '#059669',
  successLight: '#34D399',
  successSurface: '#ECFDF5',

  // Warning
  warning: '#F59E0B',
  warningSurface: '#FFFBEB',

  // Error
  error: '#EF4444',
  errorDark: '#DC2626',
  errorLight: '#F87171',
  errorSurface: '#FEF2F2',

  // Info
  info: '#3B82F6',
  infoSurface: '#EFF6FF',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',

  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
};

const lightColors = {
  // Backgrounds
  background: palette.white,
  backgroundSecondary: palette.gray50,
  backgroundTertiary: palette.gray100,
  surface: palette.white,
  surfaceElevated: palette.white,

  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textInverse: palette.white,
  textDisabled: palette.gray300,
  textBlack: palette.black,

  // Border
  border: palette.gray200,
  borderFocused: palette.primary,
  divider: palette.gray100,

  // Icon
  iconPrimary: palette.gray700,
  iconSecondary: palette.gray400,

  // Input
  inputBackground: palette.white,
  inputBorder: palette.gray300,
  inputPlaceholder: palette.gray400,

  // Card
  cardBackground: palette.white,
  cardBorder: palette.gray200,
  cardShadow: palette.gray200,

  // Nav
  tabBarBackground: palette.white,
  tabBarBorder: palette.gray200,
  tabBarActive: palette.primary,
  tabBarInactive: palette.gray400,

  // Status bar
  statusBar: 'dark-content',

  ...palette,
};

const darkColors = {
  ...palette,
  primary: palette.primaryLight,

  // Backgrounds
  background: palette.gray900,
  backgroundSecondary: palette.gray800,
  backgroundTertiary: palette.gray700,
  surface: palette.gray800,
  surfaceElevated: palette.gray700,

  // Text
  textPrimary: palette.white,
  textSecondary: palette.gray300,
  textTertiary: palette.gray500,
  textInverse: palette.gray900,
  textDisabled: palette.gray600,

  // Border
  border: palette.gray700,
  borderFocused: palette.primaryLight,
  divider: palette.gray800,

  // Icon
  iconPrimary: palette.gray200,
  iconSecondary: palette.gray500,

  // Input
  inputBackground: palette.gray800,
  inputBorder: palette.gray600,
  inputPlaceholder: palette.gray500,

  // Card
  cardBackground: palette.gray800,
  cardBorder: palette.gray700,
  cardShadow: 'rgba(0,0,0,0.5)',

  // Nav
  tabBarBackground: palette.gray900,
  tabBarBorder: palette.gray800,
  tabBarActive: palette.primaryLight,
  tabBarInactive: palette.gray500,

  // Status bar
  statusBar: 'light-content',

  // Dark Mode specific surface overrides
  primarySurface: '#1E293B',
  successSurface: '#022C22',
  errorSurface: '#450A0A',
};

export { lightColors, darkColors, palette };
