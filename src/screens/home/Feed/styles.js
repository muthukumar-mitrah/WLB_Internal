import { StyleSheet } from 'react-native';
import { fontFamily } from '../../../theme/fonts';

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
    imagePressable: {
      width: '100%',
    },
    postImage: {
      width: '100%',
      borderRadius: borderRadius.lg,
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
  });

export default createStyles;