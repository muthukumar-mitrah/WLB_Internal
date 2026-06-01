import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      alignItems: 'stretch',
    },
    illustrationWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    mascotContainer: {
      width: 120,
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mascotImage: {
      width: '100%',
      height: '100%',
    },
    heading: {
      textAlign: 'center',
      marginBottom: 8,
      fontSize: 28, // Matches the bold look in the image
    },
    subheading: {
      textAlign: 'center',
      paddingHorizontal: 24,
      lineHeight: 22,
    },
    emailInput: {
      fontSize: 16,
    },
    passwordInput: {
      fontSize: 16,
    },
    passwordLabel: {
      marginBottom: 6,
      fontWeight: '600',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    continueBtn: {
      marginTop: spacing[4],
      borderRadius: borderRadius.md,
      paddingVertical: 14,
    },
    anotherEmailBtn: {
      marginTop: spacing[3],
      borderRadius: borderRadius.md,
      paddingVertical: 14,
    },
    authError: {
      marginTop: 8,
      textAlign: 'center',
    },
    dividerWrapper: {
      marginVertical: spacing[5],
      paddingHorizontal: spacing[4],
    },
    divider: {
      marginVertical: 0,
    },
    socialBtn: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      paddingVertical: 14,
      marginBottom: spacing[3],
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    socialIcon: {
      width: 22,
      height: 22,
    },
    socialText: {
      textAlign: 'center',
      marginLeft: 5,
    },
    loginRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    privacy: {
      textAlign: 'center',
    },
    // Step 2 Screen Styles
    optionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing[2],
      marginBottom: spacing[6],
      width: '100%',
    },
    rememberMeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rememberMeText: {
      marginLeft: spacing[2],
    },
    forgotPasswordText: {
      fontWeight: '500',
    },
  });

export default createStyles;
