import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    modalContent: {
      paddingHorizontal: spacing[1],
    },
    disclaimerIcon: {
      width: 70,
      height: 70,
      alignSelf:'center'
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing[1],
    },
    description: {
      textAlign: 'center',
      marginBottom: spacing[6],
      marginTop:spacing[3],
      width:'80%',
      alignSelf:'center'
    },
    sectionList: {
      gap: spacing[3],
      marginBottom: spacing[4],
    },
    sectionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[3],
      backgroundColor:colors.backgroundTertiary,
      padding:spacing[4],
      borderRadius:15
    },
    sectionIcon: {
      width: 50,
      height: 50,
    },
    sectionText: {
      flex: 1,
      gap: spacing[0.5],
    },
    dontShowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
      paddingBottom: spacing[6],
      marginTop: spacing[6],
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    aiSettingsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1.5],
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[1],
    },
    aiSettingsIcon: {
      width: 24,
      height: 24,
    },
    closeBtn: {
      flex: 1,
    },
    continueBtn: {
      flex: 2,
    },
  });

export default createStyles;
