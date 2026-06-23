import { StyleSheet } from 'react-native';
import { fontFamily } from '../../../theme/fonts';

const createStyles = ({ colors, spacing, borderRadius, shadows }) =>
  StyleSheet.create({
    containerStyle: {
      paddingTop: spacing[1],
    },
    iconSquare: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: spacing[5],
      marginTop: spacing[2],
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    cardOutline: {
      width: 32,
      height: 24,
      borderWidth: 2.5,
      borderColor: colors.white,
      borderRadius: 6,
      justifyContent: 'space-between',
      padding: 3,
      alignItems: 'center',
    },
    cardInnerTop: {
      width: 14,
      height: 4,
      borderRadius: 2,
      borderWidth: 1.5,
      borderColor: colors.white,
    },
    cardInnerBar: {
      width: 16,
      height: 2,
      backgroundColor: colors.white,
      borderRadius: 1,
    },
    disclaimerIcon: {
      width: 56,
      height: 56,
      alignSelf: 'center'
    },
    title: {
      textAlign: 'center',
      fontSize: 18,
      lineHeight: 26,
      fontFamily: fontFamily.bold,
      paddingHorizontal: spacing[2],
    },
    description: {
      textAlign: 'center',
      marginTop: spacing[3],
      marginBottom: spacing[5],
      paddingHorizontal: spacing[3],
      fontSize: 14,
      lineHeight: 20,
    },
    dontShowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      marginBottom: spacing[6],
      alignSelf: 'flex-start',
      paddingHorizontal: spacing[2],
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    dontShowText: {
      fontSize: 14,
      fontFamily: fontFamily.bold,
      color: '#0A2540',
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      width: '100%',
    },
    button: {
      flex: 1,
    },
  });

export default createStyles;
