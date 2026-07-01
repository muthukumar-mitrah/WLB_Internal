import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing, borderRadius, shadows}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[4],
      paddingTop: spacing[4],
    },

    /* ── Avatar Section ── */
    avatarSection: {
      alignItems: 'center',
      marginBottom: spacing[6],
    },
    avatarWrapper: {
      position: 'relative',
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50, // Circular in this design
    },
    avatarImageInternal: {
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    cameraIconWrapper: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
      ...shadows.xs,
    },

    /* ── InputBox fields (Name, Bio) ── */
    nameContainer: {
      marginBottom: spacing[4],
    },
    bioContainer: {
      marginBottom: spacing[4],
    },
    fieldLabel: {
      marginBottom: spacing[1],
    },
    fieldValue: {
      // Applied directly via inputStyle or natively
    },
    underlineInput: {
      fontWeight: '500',
      paddingLeft: 0,
      paddingHorizontal: 0,
    },
    underlineBorder: {
      // InputBox variant handles the bottom border, but we can add style here if needed
    },
    bioInput: {
      fontWeight: '500',
      minHeight: 60,
      paddingLeft: 0,
      paddingHorizontal: 0,
    },

    /* ── Edit Detail Cards (Gender, Country, Weight, DOB) ── */
    cardsSection: {
      marginTop: spacing[1],
    },
    editCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[1.5],
      marginBottom: spacing[1.5],
      backgroundColor: colors.background,
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primarySurface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[3],
    },
    cardIcon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
    cardTextContent: {
      flex: 1,
      justifyContent: 'center',
    },
    cardLabel: {
      marginBottom: 2,
    },
    cardValue: {
      fontSize: 16,
      color: colors.textPrimary,
    },

    /* ── Bottom Sheet Modals for Profile Photo ── */
    optionsContainer: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[3],
    },
    iconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 16,
      lineHeight: 20,
      marginLeft: spacing[3],
    },
    modalTitle: {
      marginVertical: spacing[2],
      fontSize: 18,
      fontWeight: '600',
    },
  });

export default createStyles;
