import { StyleSheet } from 'react-native';

export const AVATAR_SIZE = 46;
export const ICON_SIZE = 20;
export const ICON_WRAPPER = 28; 
export const ITEM_HEIGHT = 40;
export const SUB_ITEM_HEIGHT = 40;
export const THEME_BTN = 28;

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    // ── Scroll container ────────────────────────────────────────────────────
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing[6],
    },

    // ── Header row  (greeting + theme toggle) ───────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[2],
      paddingTop: spacing[5],
      paddingBottom: spacing[3],
    },
    greeting: {
      flex: 1,
      marginRight: spacing[3],
    },

    // ── Theme toggle ────────────────────────────────────────────────────────
    themeToggle: {
      flexDirection: 'row',
      backgroundColor: colors.warmSurface,
      borderRadius: borderRadius.full,
      padding: spacing[0.5],
    },
    themeBtn: {
      width: THEME_BTN,
      height: THEME_BTN,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeBtnActive: {
      backgroundColor: colors.primary,
    },

    // ── Profile row ─────────────────────────────────────────────────────────
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[3],
      marginBottom: spacing[1],
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      backgroundColor: colors.backgroundTertiary,
    },
    userInfo: {
      flex: 1,
      marginLeft: spacing[3],
    },
    userName: {
      // variant applied in component; override only layout here
    },
    userEmail: {
      marginTop: 2,
    },
    profileChevron: {
      marginLeft: spacing[2],
      opacity: 0.5,
    },

    // ── Divider ─────────────────────────────────────────────────────────────
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginHorizontal: spacing[5],
      marginVertical: spacing[1],
    },

    // ── Menu items ──────────────────────────────────────────────────────────
    menuSection: {
      paddingVertical: spacing[1],
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      height: ITEM_HEIGHT,
      paddingHorizontal: spacing[2],
    },
    iconWrapper: {
      width: ICON_WRAPPER,
      height: ICON_WRAPPER,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[3],
    },
    menuIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    },

    // ── Expandable section header (Setting / Support & Legal) ────────────────
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      height: ITEM_HEIGHT,
      paddingHorizontal: spacing[2],
    },
    sectionChevron: {
      marginLeft: 'auto',
    },

    // ── Sub-menu container (expanded items) ──────────────────────────────────
    subMenuContainer: {
      marginHorizontal: spacing[4],
      marginTop: spacing[1],
      marginBottom: spacing[2],
      backgroundColor: colors.primarySurface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      paddingVertical: spacing[1],
    },
    subMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      height: SUB_ITEM_HEIGHT,
      paddingHorizontal: spacing[2],
    },
    subIconWrapper: {
      width: ICON_WRAPPER,
      height: ICON_WRAPPER,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[3],
    },
    subMenuIcon: {
      width: ICON_SIZE - 2,
      height: ICON_SIZE - 2,
    },

    // ── Bottom spacer + logout ───────────────────────────────────────────────
    spacer: {
      flex: 1,
      minHeight: spacing[8],
    },
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: ITEM_HEIGHT,
      paddingHorizontal: spacing[2],
      marginTop: spacing[2],
    },
    logoutIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    },
  });

export default createStyles;
