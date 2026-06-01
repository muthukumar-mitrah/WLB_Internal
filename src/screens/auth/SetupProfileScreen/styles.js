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
      width: 100,
      height: 100,
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
      fontSize: 28,
    },
    subheading: {
      textAlign: 'center',
      paddingHorizontal: 16,
      marginBottom: spacing[6],
    },
    inputSection: {
      marginTop: spacing[2],
    },
    inputWrapper: {
      marginBottom: spacing[4],
    },
    label: {
      marginBottom: 6,
      fontWeight: '600',
    },
    input: {
      fontSize: 15,
    },
    continueBtn: {
      marginTop: spacing[2],
      borderRadius: borderRadius.md,
      paddingVertical: 14,
    },
    authError: {
      marginTop: 8,
      textAlign: 'center',
    },
    loginRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing[8],
      marginBottom: spacing[10],
    },
    // Modal Styles
    modalContainer: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[6],
      paddingTop: spacing[6],
    },
    modalContent: {
      alignItems: 'center',
    },
    modalMascot: {
      width: 80,
      height: 80,
      marginBottom: spacing[4],
    },
    modalTitle: {
      textAlign: 'center',
      marginBottom: spacing[2],
      fontSize: 20,
    },
    modalSubtitle: {
      textAlign: 'center',
      marginBottom: spacing[6],
      fontSize: 14,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: spacing[3],
    },
    modalBtnLater: {
      flex: 1,
      borderRadius: borderRadius.md,
      borderWidth: 0,
      paddingVertical: 12,
    },
    modalBtnLaterText: {
      fontSize: 15,
      fontWeight: '600',
    },
    modalBtnContinue: {
      flex: 1,
      borderRadius: borderRadius.md,
      paddingVertical: 12,
    },
  });

export default createStyles;
