import { StyleSheet } from 'react-native';
import { fontSize, fontWeight } from '../../../theme/fonts';

const createStyles = ({ colors, spacing, borderRadius, shadows, isDark }) =>
    StyleSheet.create({
        // Bottom Sheet Content Styles
        bottomSheetContent: {
            paddingHorizontal: spacing[4],
            paddingTop: spacing[2],
            backgroundColor: colors.surface,
        },
        bottomSheetTitle: {
            fontWeight: fontWeight.semiBold,
            marginBottom: spacing[5],
        },
        bottomSheetDesc: {
            marginBottom: spacing[4],
        },
        // Weight Input Card with nested Switch selector
        inputCard: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colors.borderFocused,
            borderRadius: borderRadius.lg,
            paddingHorizontal: spacing[3],
            height: 56,
            marginBottom: spacing[5],
            backgroundColor: colors.surface,
        },
        weightInput: {
            flex: 1,
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.textPrimary,
            paddingVertical: 0,
        },
        unitSwitchContainer: {
            flexDirection: 'row',
            backgroundColor: isDark ? colors.backgroundTertiary : colors.backgroundSecondary,
            borderRadius: borderRadius.md,
            padding: 2,
        },
        unitSwitchBtn: {
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1],
            borderRadius: borderRadius.sm,
            alignItems: 'center',
            justifyContent: 'center',
        },
        unitSwitchBtnActive: {
            backgroundColor: colors.primary,
        },
        unitSwitchTextActive: {
            color: colors.white,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.sm,
        },
        unitSwitchTextInactive: {
            color: colors.textSecondary,
            fontSize: fontSize.sm,
        },
        saveButton: {
            backgroundColor: colors.primary,
            borderRadius: borderRadius.lg,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.xs,
        },
        saveButtonText: {
            color: colors.white,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.base,
        },
    });

export default createStyles;
