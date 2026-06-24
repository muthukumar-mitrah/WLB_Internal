import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    formLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing[2],
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
    countryDropdownText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    countryDropdownPlaceholder: {
      color: colors.textSecondary,
    },
    modalStyle: {
      height: '60%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.surface || colors.cardBackground,
    },
    countrySearchContainerModal: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius?.md || 8,
      paddingHorizontal: spacing?.[3] || 12,
      marginBottom: spacing?.[4] || 16,
    },
    searchIcon: {
      marginRight: 8,
    },
    countrySearchInputModal: {
      flex: 1,
      height: 44,
      color: colors.textPrimary,
      fontSize: 16,
      paddingVertical: 0,
    },
    countryListContainer: {
      flexGrow: 0,
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
    countryEmptyText: {
      textAlign: 'center',
      marginTop: 20,
    },
  });

export default createStyles;
