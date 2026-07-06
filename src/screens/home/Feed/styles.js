import { StyleSheet, Dimensions } from 'react-native';
import { fontFamily } from '../../../theme/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    card: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3] + 2,
      paddingBottom: spacing[2] + 2,
      backgroundColor: colors.background,
    },

    // ── Header ─────────────────────────────────────────────────────────────────
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[2] + 2,
    },
    headerUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: spacing[2] + 2,
    },
    avatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: -1,
      right: -1,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.background,
    },
    avatarPlaceholder: {
      marginRight: 0,
    },
    avatarText: {
      color: colors.white,
      fontFamily: fontFamily.bold,
    },
    cardHeaderInfo: {
      flex: 1,
    },
    cardUsername: {
      fontFamily: fontFamily.semiBold,
      fontSize: 14,
      lineHeight: 18,
    },
    cardFeelingText: {
      fontFamily: fontFamily.regular,
      fontSize: 13,
    },
    cardMeta: {
      fontFamily: fontFamily.regular,
      fontSize: 12,
      marginTop: 1,
    },
    cardHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    chatBtn: {
      paddingHorizontal: spacing[3] + 2,
      paddingVertical: spacing[1] + 1,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary,
    },
    chatBtnLabel: {
      color: colors.white,
      fontFamily: fontFamily.semiBold,
      fontSize: 13,
    },
    menuBtn: {
      padding: 2,
    },
    menuIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    pinIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: colors.iconSecondary,
    },

    // ── Post content ───────────────────────────────────────────────────────────
    postContentContainer: {
      position: 'relative',
      width: '100%',
    },
    textPressable: {
      width: '100%',
    },
    cardTitle: {
      fontFamily: fontFamily.semiBold,
      fontSize: 16,
      lineHeight: 22,
      marginBottom: spacing[1],
    },
    cardText: {
      fontFamily: fontFamily.regular,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing[2] + 2,
    },
    hashtag: {
      color: colors.primary,
      fontFamily: fontFamily.regular,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      marginBottom: spacing[2] + 2,
    },
    // Full-bleed container for video thumbnails — escapes the card's horizontal padding
    videoImageContainer: {
      width: SCREEN_WIDTH,
      marginLeft: -spacing[4],
      borderRadius: 0,
    },
    imagePressable: {
      width: '100%',
    },
    postImage: {
      width: '100%',
      borderRadius: borderRadius.lg,
    },
    // Image style override when video thumbnail — no rounding, cover fill
    videoPostImage: {
      width: '100%',
      borderRadius: 0,
    },

    // ── Reactions row ──────────────────────────────────────────────────────────
    reactionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing[1],
    },
    reactionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing[4],
      gap: spacing[1],
    },
    reactionInnerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    reactionIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    reactionCount: {
      fontFamily: fontFamily.medium,
      fontSize: 13,
    },
    robiContainer: {
      marginRight: 0,
    },
    robiImage: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      borderRadius: 10,
    },
    spacer: {
      flex: 1,
    },
    approvalButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingTop: spacing[2],
      paddingBottom: spacing[1],
    },
    approvalDeclineBtn: {
      flex: 1,
      marginRight: spacing[1] + 2,
    },
    approvalApproveBtn: {
      flex: 1,
      marginLeft: spacing[1] + 2,
    },
    // ── Video thumbnail overlays ────────────────────────────────────────────
    videoPlayOverlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -32 }, { translateY: -32 }],
      zIndex: 1,
    },
    playIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255,255,255,0.95)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 6,
    },
    videoDurationBadge: {
      position: 'absolute',
      bottom: spacing[2],
      right: spacing[2],
      backgroundColor: 'rgba(0,0,0,0.65)',
      borderRadius: borderRadius.sm || 4,
      paddingHorizontal: spacing[2],
      paddingVertical: 2,
      zIndex: 2,
    },
    videoDurationText: {
      color: colors.white,
      fontSize: 12,
      fontFamily: fontFamily.medium,
    },
  });

export default createStyles;