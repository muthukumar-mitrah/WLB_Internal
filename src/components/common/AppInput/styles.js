import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius, fonts, shadows }) => {
  return StyleSheet.create({
    container: {
      marginBottom: 16,
      width: '100%',
      alignSelf: 'stretch',
    },
    labelWrapper: {
      flexDirection: 'row',
      gap: 2,
    },
    label: {
      marginBottom: 6,
    },
    requiredLabel: {
      color: colors.error,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      width: '100%',
      alignSelf: 'stretch',
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[3],
      backgroundColor: colors.inputBackground,
    },
    inputWrapperDisabled: {
      backgroundColor: colors.backgroundSecondary,
    },
    inputWrapperUnderline: {
      borderWidth: 0,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 1,
      borderRadius: 0,
      borderColor: 'transparent',
      borderBottomColor: colors.border,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
    },
    inputWrapperFocused: {
      ...shadows.xs,
    },
    input: {
      flex: 1,
      color: colors.textPrimary,
      fontFamily: fonts.fontFamily.regular,
      fontSize: fonts.fontSize.base,
      height: 48,
      textAlignVertical: 'center',
      paddingVertical: 0,
    },
    inputMultiline: {
      height: undefined,
      textAlignVertical: 'top',
      paddingVertical: spacing[3],
    },
    inputUnderline: {
      paddingVertical: spacing[2],
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginLeft: 8,
    },
    messageError: {
      marginTop: 4,
      marginLeft: 2,
      color: colors.error,
    },
    messageHint: {
      marginTop: 4,
      marginLeft: 2,
      color: colors.textTertiary,
    },
  });
};

export default createStyles;
