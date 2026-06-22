import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    // ── Root ──────────────────────────────────────────────────────────────────
    flex1: { flex: 1 },

    // ── Tabs ──────────────────────────────────────────────────────────────────
    tabsContainer: {
      flexDirection: 'row',
      marginHorizontal: spacing[4] || 16,
      marginBottom: 8,
      backgroundColor: colors.backgroundSecondary || colors.card,
      borderRadius: borderRadius.md || 8,
      padding: 3,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 9,
            alignItems: 'center',
      borderRadius: (borderRadius.md || 8) - 2,
    },
    tabButtonActive: {
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },

    formLabel:{
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    sectionContainer: {
      marginTop: 8
    },

    // ── People Tab — compact non-scrolling layout ─────────────────────────────
    peopleContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[4] || 16,
      justifyContent: 'space-between',
    },
    // ── Switch row ────────────────────────────────────────────────────────────
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 9,
    },
    switchTextContainer: {
      flex: 1,
      paddingRight: 12,
    },
    switchLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    switchSubLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 1,
    },
    // ── Section label ─────────────────────────────────────────────────────────
    sectionLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 6,
      marginTop: 8,
    },
    // ── Gender buttons ────────────────────────────────────────────────────────
    genderRow: {
      flexDirection: 'row',
      gap: 6,
    },
    genderBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: borderRadius.md || 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card || colors.backgroundSecondary,
    },
    genderBtnActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    genderBtnText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    genderBtnTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    sliderRow: {
      paddingVertical: 9,
    },
    sliderLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sliderRangeText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    // ── Country dropdown ──────────────────────────────────────────────────────
    countryDropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card || colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md || 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    countryDropdownText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
      paddingTop: 12,
    },

    // ── Hashtag Tab ───────────────────────────────────────────────────────────
    hashtagContent: {
      flex: 1,
      paddingHorizontal: spacing[4] || 16,
      paddingBottom: 8,
    },
    input: {
      height: 48,
      backgroundColor: colors.backgroundSecondary || colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md || 8,
      paddingHorizontal: spacing[3] || 12,
      marginTop: 6,
      marginBottom: 12,
      fontSize: 15,
      color: colors.textPrimary,
    },
    suggestionsList: {
      flexGrow: 0,
      maxHeight: 160,
    },
    suggestionItem: {
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    suggestionText: {
      fontSize: 15,
      color: colors.textPrimary,
    },
    selectedHashtagsTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: 12,
      marginBottom: 6,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
      gap: 4,
    },
    chipText: {
      color: '#ffffff',
      fontSize: 13,
    },
    emptyHashtagText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 16,
    },
    hashtagFooter: {
      paddingTop: 8,
      paddingBottom: 4,
    },
  });

export default createStyles;
