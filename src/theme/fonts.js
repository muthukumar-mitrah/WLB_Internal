/**
 * Typography system
 * Font families, sizes, weights, line heights, letter spacing
 */

// Font families — BeVietnamPro loaded from src/assets/fonts/
// Run: npx react-native-asset  (or react-native link) after adding fonts
const fontFamily = {
  regular: 'BeVietnamPro-Regular',
  medium: 'BeVietnamPro-Medium',
  semiBold: 'BeVietnamPro-SemiBold',
  bold: 'BeVietnamPro-Bold',
  // No ExtraBold variant in assets — fall back to Bold
  extraBold: 'BeVietnamPro-Bold',

  // Heading fonts
  headingSemiBold: 'SpaceGrotesk-SemiBold',
  headingBold: 'SpaceGrotesk-Bold',

  // Fallback system fonts
  systemRegular: 'System',
  monospace: 'Courier New',
};

const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,
};

const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

const lineHeight = {
  xs: 16,
  sm: 18,
  base: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 36,
  '3xl': 40,
  '4xl': 44,
};

const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 1.5,
};

/**
 * Semantic text variants – use these across the app
 * for consistent typography
 */
const textVariants = {
  // Display / Large headings
  displayLarge: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['4xl'],
    letterSpacing: letterSpacing.tight,
  },
  display: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['3xl'],
    letterSpacing: letterSpacing.tight,
  },

  // Headings
  h1: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['2xl'],
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.normal,
  },

  // Titles
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  },
  titleMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  },

  // Subtitle
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  },
  subtitleMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },

  // Body
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },

  // Caption / Small
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.normal,
  },
  captionMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.normal,
  },
  captionSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.normal,
  },

  // Labels / Buttons
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.wide,
  },
  buttonLarge: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.wide,
  },
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.wide,
  },

  // Overline / Micro
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
};

export { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textVariants };
