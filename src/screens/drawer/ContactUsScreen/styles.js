/**
 * ContactUsScreen — styles
 */
import {StyleSheet} from 'react-native';

const ICON_CIRCLE_SIZE = 40;

const createStyles = ({colors, spacing, borderRadius, shadows}) =>
  StyleSheet.create({
    flex: {flex: 1},

    // ── Header ───────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3.5],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      marginRight: spacing[3],
      padding: spacing[1],
    },

    // ── Scroll ───────────────────────────────────────────────────────────────
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[5],
      paddingBottom: spacing[10],
    },

    // ── Intro ─────────────────────────────────────────────────────────────────
    introHeading: {
      textAlign: 'center',
      marginBottom: spacing[2],
    },
    introSubheading: {
      textAlign: 'center',
      marginBottom: spacing[6],
      lineHeight: 22,
      paddingHorizontal: spacing[4],
    },

    // ── Card ──────────────────────────────────────────────────────────────────
    card: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.xl,
      padding: spacing[5],
      marginBottom: spacing[4],
      ...shadows.sm,
    },
    wrapper:{
      flexDirection:'row',
      gap:spacing[2]
    },

    // ── Field label ───────────────────────────────────────────────────────────
    fieldLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    // ── InputBox override ─────────────────────────────────────────────────────
    inputContainer: {
      marginBottom: spacing[4],
    },

    // ── SelectField ───────────────────────────────────────────────────────────
    selectContainer: {
      marginBottom: spacing[4],
    },
    selectWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[3],
      backgroundColor: colors.inputBackground,
      height: 48,
    },
    selectText: {
      flex: 1,
    },
    selectError: {
      marginTop: spacing[1],
      marginLeft: spacing[0.5],
    },

    // ── Dropdown bottom sheet ─────────────────────────────────────────────────

    optionRow: {
      paddingVertical: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    optionRowLast: {
      borderBottomWidth: 0,
    },

    // ── Message input ─────────────────────────────────────────────────────────
    messageInputContainer: {
      marginBottom: spacing[4],
    },
    messageInput: {
      height: 120,
    },

    // ── Submit button ─────────────────────────────────────────────────────────
    submitBtn: {
      marginTop: spacing[2],
    },

    // ── Contact info card ─────────────────────────────────────────────────────
    contactInfoTitle: {
      marginBottom: spacing[4],
      fontSize:16
    },
    contactItemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: spacing[3],
    },
    contactItemDivider: {
      height: 1,
      backgroundColor: colors.divider,
    },
    iconCircle: {
      width: ICON_CIRCLE_SIZE,
      height: ICON_CIRCLE_SIZE,
      borderRadius: 10,
      backgroundColor: colors.primarySurface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[3],
      marginTop: spacing[0.5],
    },
    contactItemContent: {
      flex: 1,
    },
    contactItemTitle: {
      marginBottom: spacing[0.5],
    },
    contactItemChevron: {
      alignSelf: 'center',
      marginLeft: spacing[2],
    },
  });

export {ICON_CIRCLE_SIZE};
export default createStyles;
