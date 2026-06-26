import { StyleSheet } from 'react-native';
import { fontFamily } from '../../../theme/fonts';
import { palette } from '../../../theme/colors';

const createStyles = ({ colors, spacing, borderRadius, shadows }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: spacing[6],
    },
    headerWrapper: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
    },
    // Banner / Cover image styles
    coverContainer: {
      position: 'relative',
      height: 180,
      width: '100%',
      borderRadius: borderRadius.lg,
      marginBottom: 36, // margin to accommodate overlapping profile avatar
      overflow: 'visible',
    },
    coverBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#2b6cee', // main figma theme blue
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    coverCircleLarge: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      top: -20,
      right: -20,
    },
    coverCircleSmall: {
      position: 'absolute',
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      bottom: -10,
      left: -20,
    },
    profileImageWrapper: {
      position: 'absolute',
      bottom: -28,
      left: spacing[4],
      width: 68,
      height: 68,
      borderRadius: 16,
      borderWidth: 3,
      borderColor: colors.background,
      backgroundColor: colors.backgroundSecondary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: 13,
    },
    coverImage: {
      width: '100%',
      height: '100%',
      borderRadius: borderRadius.lg,
    },

    // Info section styles
    infoContainer: {
      paddingHorizontal: spacing[4],
      marginBottom: spacing[4],
    },
    groupName: {
      fontFamily: fontFamily.bold,
      fontSize: 20,
      color: colors.textPrimary,
      lineHeight: 26,
    },
    groupDescription: {
      fontFamily: fontFamily.regular,
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: spacing[1],
      lineHeight: 18,
    },
    metadataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: spacing[3],
      gap: spacing[4],
    },
    metadataItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    metadataIcon: {
      tintColor: colors.iconSecondary,
    },
    metadataText: {
      fontFamily: fontFamily.medium,
      fontSize: 13,
      color: colors.textSecondary,
    },

    // Buttons section styles
    buttonContainer: {
      paddingHorizontal: spacing[4],
      marginBottom: spacing[4],
    },
    createPostBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      height: 48,
    },

    // About Tab Layout
    aboutContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      gap: spacing[4],
    },
    cardTitle: {
      fontFamily: fontFamily.bold,
      fontSize: 15,
      color: colors.textPrimary,
      marginBottom: spacing[3],
    },

    // Admin Card Styles
    adminCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    adminProfile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      flex: 1,
    },
    adminAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    adminInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    adminName: {
      fontFamily: fontFamily.bold,
      fontSize: 15,
      color: colors.textPrimary,
    },
    adminRole: {
      fontFamily: fontFamily.medium,
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    adminBadge: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1] + 1,
      borderRadius: borderRadius.full,
      backgroundColor: palette.primarySurface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    adminBadgeText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12,
      color: colors.primary,
    },

    // Activity Card Styles
    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[3],
    },
    activityLabel: {
      fontFamily: fontFamily.regular,
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    activityValue: {
      fontFamily: fontFamily.medium,
      fontSize: 14,
      color: colors.textPrimary,
      textAlign: 'right',
    },
    // Helper/utility styles to resolve lint warnings
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    postsLoadingContainer: {
      paddingVertical: spacing[8],
      justifyContent: 'center',
      alignItems: 'center',
    },
    postSeparator: {
      height: 3,
    },
    emptyStateWrapper: {
      paddingVertical: spacing[8],
    },
    privacyIconStyle: {
      width: 14,
      height: 14,
    },
    calendarIconStyle: {
      width: 14,
      height: 14,
    },
    groupIconStyle: {
      width: 16,
      height: 16,
    },
    memberRow: {
      flexDirection : 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: spacing[4],
      borderBottomWidth: 1,
    },
    memberAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    memberInfo: {
      flex: 1,
      marginLeft: 14,
    },
    memberName: {
      fontFamily: fontFamily.bold,
      fontSize: 15,
    },
    memberSinceText: {
      fontFamily: fontFamily.regular,
      fontSize: 12,
      marginTop: 2,
    },
    memberMenuBtn: {
      padding: 8,
    },
    memberPopupMenu: {
      position: 'absolute',
      right: 40,
      width: 180,
      alignSelf: undefined,
      elevation: 8,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      paddingVertical: 10,
      paddingHorizontal: 0,
      paddingBottom: 10,
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      paddingHorizontal: 16,
    },
    menuRowText: {
      fontFamily: fontFamily.medium,
      fontSize: 14,
    },
    menuDivider: {
      height: 1,
      marginHorizontal: 16,
      marginVertical: 4,
    },
    makeHostModalStyle: {
      alignSelf: 'center',
      width: '90%',
      maxWidth: 343,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    makeHostContent: {
      paddingTop: 16,
      alignItems: 'center',
    },
    makeHostAvatar: {
      width: 68,
      height: 68,
      borderRadius: 34,
      marginBottom: 16,
    },
    makeHostTitle: {
      fontFamily: fontFamily.bold,
      fontSize: 20,
      lineHeight: 26,
      textAlign: 'center',
      marginBottom: 12,
    },
    makeHostDescription: {
      fontFamily: fontFamily.regular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: 24,
    },
    makeHostButtonsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    makeHostCancelBtn: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    makeHostCancelText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 14,
    },
    makeHostConfirmBtn: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    makeHostConfirmText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 14,
    },
    viewAllBtn: {
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      marginTop: spacing[2],
    },
    viewAllText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 14,
      color: colors.primary,
    },
    approvalContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
    },
    approvalSectionTitle: {
      fontFamily: fontFamily.bold,
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing[4],
    },
  });

export default createStyles;
