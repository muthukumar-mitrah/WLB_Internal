import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing, borderRadius}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[2],
    },
    stepContainer: {
      flex: 1,
    },
    heading: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: spacing[7], // Proper spacing between title and list items
      marginTop: spacing[2],
    },
    subHeadingText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing[2],
      marginTop: -spacing[4.5], // Offset spacing so it sits close to the heading
    },
    rowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[4.5],
    },
    rowText: {
      fontSize: 15,
      fontWeight: '500',
      flex: 1,
      marginRight: spacing[2],
    },
    inputArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      paddingTop: spacing[3],
      backgroundColor: colors.background,
    },
    closeButton: {
      padding: spacing[2],
      marginRight: -spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    /* ── Profile List styles ── */
    profileListContainer: {
      marginTop: spacing[1],
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[3.5],
    },
    profileAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: spacing[3],
    },
    avatarImageInternal: {
      width: '100%',
      height: '100%',
    },
    profileInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    profileName: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 1,
    },

    /* ── Submit Screen styles (centered) ── */
    submitTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing[3],
      marginTop: spacing[4], // Proper spacing below header
      paddingHorizontal: spacing[4],
      lineHeight: 28,
    },
    
    submitSub: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center', 
      marginBottom: spacing[3], 
      lineHeight: 22,
    },
    standardsLink: {
      fontSize: 12,
      fontWeight: '600',
    },

    /* ── Details Section styles (no card styling) ── */
    detailsSection: {
      marginTop: spacing[1],
      marginBottom: spacing[2],
      paddingHorizontal: spacing[4],
    },
    detailsCardTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: spacing[3],
    },
    detailItem: {
      marginBottom: spacing[3],
    },
    detailLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing[1], // Spacing between label and value
    },
    detailValue: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.textSecondary,
    },

    /* ── Thank You styles ── */
    thankYouContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: spacing[10], // Moved closer to the top instead of centered
      paddingHorizontal: spacing[4],
    },
    successCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[2],
    },
    successTitle: {
      fontSize: 16,
      width:262,
      fontWeight: '500',
      textAlign: 'center',
    },
    successSub: {
      fontSize: 12,
      width:262,
      height:34,
      fontWeight:'400',
      textAlign: 'center',
      paddingHorizontal: spacing[4],
    },
  });

export default createStyles;
