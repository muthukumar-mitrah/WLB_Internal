import { StyleSheet } from 'react-native';

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
      paddingHorizontal: spacing[6],
      paddingBottom: 100, // room for absolute footer
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
    primaryBtnTop: {
      borderRadius: borderRadius.lg,
      marginTop: spacing[2],
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
      marginTop: spacing[2],
      marginBottom: spacing[12],
    },
    heading: {
      marginBottom: spacing[3],
    },
    subheading: {
      lineHeight: 18,
    },
    subheadingCenter: {
      lineHeight: 18,
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
      marginTop: spacing[2],
      marginBottom: spacing[6],
    },
    verifySubheadingText: {
      textAlign: 'center',
      lineHeight: 22,
      fontWeight: '400',
    },
    continueBtn: {
      borderRadius: borderRadius.lg,
      marginBottom: spacing[4],
    },
    otpContainer: {
      marginBottom: spacing[6],
      width: '100%',
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
      fontWeight: '700'
    },
    successMessage: {
      textAlign: 'center',
      marginBottom: spacing[8],
      lineHeight: 22,
    },
    successBtn: {
      borderRadius: borderRadius.lg,
      width: '100%',
    },
    // Email label
    emailLabel: {
      marginBottom: spacing[2],
      fontWeight: '600',
    },
  });

export default createStyles;
