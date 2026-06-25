import { StyleSheet } from 'react-native';
import { fontSize, fontWeight } from '../../theme/fonts';

const createStyles = ({ colors, spacing, borderRadius, insets = { bottom: 0 } }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[5],
      paddingBottom: 100,
    },
    successScrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[6],
      paddingBottom: 100,
      marginTop: spacing[20],
    },
    firstInputContainer: {
      marginBottom: spacing[1],
      marginTop: spacing[4],
    },
    inputSection: {
      marginBottom: spacing[1],
    },
    forgotLink: {
      alignSelf: 'flex-end',
      marginBottom: spacing[4],
    },
    // Sticky footer (Change Password screen only)
    footerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: spacing[6],
      paddingBottom: Math.max(insets.bottom, spacing[4]),
      paddingTop: spacing[3],
      backgroundColor: colors.background,
    },
    primaryBtn: {
      borderRadius: borderRadius.lg,
    },
    primaryBtnText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semiBold,
      letterSpacing: -0.32,
    },
    primaryBtnTop: {
      borderRadius: borderRadius.lg,
      marginTop: spacing[2],
      fontSize:fontSize.md,
      fontWeight:fontWeight.semiBold,
      letterSpacing: -0.32,
    },
    cancelBtn: {
      alignSelf: 'center',
      marginTop: spacing[4],
      paddingVertical: spacing[2],
    },
    // Heading section
    headingSection: {
      marginTop: spacing[2],
      marginBottom: spacing[12],
    },
    headingSectionTop: {
      marginTop: spacing[1.5],
      marginBottom: spacing[10],
    },
    heading: {
      marginBottom: spacing[3],
    },
    subheading: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.regular,
      letterSpacing: -0.32,
      lineHeight: 21,
    },
    textAlignCenter: {
      textAlign: 'center',
    },
    // Email icon
    emailIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primarySurface,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: spacing[8],
      marginBottom: spacing[6],
    },
    descriptionContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop:spacing[2],
      marginBottom: spacing[8],
      flexWrap: 'wrap',
    },
    verifySubheadingContainer: {
      marginTop: spacing[1],
      marginBottom: spacing[6],
    },
    verifySubheadingText: {
      textAlign: 'center',
      lineHeight: 22,
      fontWeight: '400',
      fontSize:fontSize.base
    },
    continueBtn: {
      borderRadius: borderRadius.lg,
      marginBottom: spacing[4],
    },
    otpWrapper: {
      marginBottom: spacing[6],
      alignItems: 'center',
    },
    // Password rules
    rulesContainer: {
      marginTop: spacing[4],
      marginBottom: spacing[4],
      paddingHorizontal: spacing[1],
    },
    ruleTitle: {
      marginBottom: spacing[3],
    },
    ruleItem: {
      marginBottom: spacing[2],
    },
    // Success
    successWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    successIconOuter: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.successSurface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[2],
    },
    successIconInner: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.success,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTitle: {
      textAlign: 'center',
      fontWeight: fontWeight.bold,
      fontSize: fontSize['2xl'],
      lineHeight: 28,
      letterSpacing: -0.96,
      marginBottom: spacing[2],
    },

    pageTitle: {
      fontWeight: fontWeight.bold,
      fontSize: fontSize['2xl'],
      lineHeight: 26,
      letterSpacing: -0.96,
      marginBottom: spacing[2],
      marginTop: spacing[6],
    },
    successMessage: {
      textAlign: 'center',
      marginBottom: spacing[6],
    },
    successBtn: {
      borderRadius: borderRadius.lg,
      width: '100%',
    },
    // Email label
    emailLabel: {
      marginBottom: spacing[2],
      fontWeight: fontWeight.medium,
      fontSize:fontSize.md,
      letterSpacing: -0.32,
    },
    otpContainer: {
      width: 300,
      alignSelf: 'center',
      justifyContent: 'space-between',
    },
    pinCodeContainer: {
      width: 52,
      height: 56,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      marginHorizontal: spacing[1],
    },
    focusedPinCodeContainer: {
      borderColor: colors.borderFocused,
      borderWidth: 2,
    },
    pinCodeText: {
      fontSize: fontSize.xl,
      color: colors.textPrimary,
    },
  });

export default createStyles;
