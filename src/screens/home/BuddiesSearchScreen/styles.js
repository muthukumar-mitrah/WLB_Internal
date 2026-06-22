import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius, shadows }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      marginHorizontal:4
    },
    scrollViewContent: {
      paddingBottom: spacing[6],
    },
    headerSearchContainer: {
      paddingHorizontal: 10,
      marginTop: spacing[4],
      marginBottom: spacing[4],
    },
    sectionContainer: {
      paddingHorizontal: 20,
      marginBottom: spacing[4],
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      paddingHorizontal: 16,
      height: 48,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
    },
    searchIcon: {
      padding: 4,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing[2],
    },
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
    countryItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[2],
    },
    countryItemRowSelected: {
      backgroundColor: colors.primarySurface,
      borderRadius: borderRadius.md,
    },
    countryItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    countryItemFlag: {
      fontSize: 22,
      marginRight: spacing[3],
      lineHeight: 28,
    },
    countryItemTextSelected: {
      fontWeight: '600',
    },
    countryDropdownContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    countryDropdownFlag: {
      fontSize: 22,
      marginRight: spacing[2],
      lineHeight: 28,
    },
    countryDropdownPlaceholder: {
      color: colors.textSecondary,
    },
    countrySearchContainerModal: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[3],
      marginBottom: spacing[3],
      height: 42,
    },
    countrySearchInputModal: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
      paddingVertical: 0,
      height: '100%',
    },
    countryListContainer: {
      height: 420,
      marginBottom: spacing[4],
    },
    countryEmptyText: {
      textAlign: 'center',
      paddingVertical: spacing[6],
    },
    chipGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    chip: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    chipTextActive: {
      color: '#FFFFFF',
    },
    accordionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
    },
    accordionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    accordionContent: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
    },
    footer: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      gap: spacing[3],
    },
    robiCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[3],
      backgroundColor: colors.backgroundTertiary,
      borderRadius: borderRadius.lg,
    },
    robiCardIcon: {
      width: 24,
      height: 24,
    },
    robiCardText: {
      marginLeft: spacing[2],
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    // Buddy Search Result Styles
    listContainer: {
      paddingHorizontal: 1,
      paddingBottom: spacing[2],
      marginTop: spacing[1],  
      marginLeft:8,
      marginRight:8,
    },
    cardContainer: {
      backgroundColor: colors.card,
      borderRadius: 0,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    avatarContainer: {
      marginRight: 12,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    userInfoContainer: {
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    buddyName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    descriptionText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    matchBadge: {
      backgroundColor: '#DDF8E5',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
    },
    matchBadgeDark: {
      backgroundColor: 'rgba(22, 163, 74, 0.2)',
    },
    matchBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#16A34A',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 6,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    infoText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    weightIcon: {
      width: 14,
      height: 14,
      tintColor: colors.textSecondary,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 16,
    },
    viewProfileButton: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      height: 44,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnViewProfileText: {
      color: '#111827',
      fontWeight: '600',
      fontSize: 14,
    },
    requestBuddyButton: {
      flex: 1,
      backgroundColor: colors.primary,
      height: 44,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnRequestBuddyText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
  });

export default createStyles;
