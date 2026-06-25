import { StyleSheet } from 'react-native';
import { fontSize, fontWeight, letterSpacing } from '../../../theme/fonts';

export const createStyles = ({ colors, spacing, borderRadius, isDark }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[1],
  },
  title: {
    marginBottom: spacing[2],
  },
  sectionTitle: {
    marginTop: spacing[2],
    marginBottom: spacing[3],
  },
  subtitle: {
    marginBottom: spacing[3],
  },
  // Memory Option Selected
  memoryOptionSelected: {
    flexDirection: 'row',
    backgroundColor: isDark ? colors.cardBackground : colors.primaryLightSoft,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[1],
    alignItems: 'flex-start',
  },
  memoryIconContainer: {
    marginRight: spacing[3],
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  memoryTextContainer: {
    flex: 1,
    marginRight: spacing[3],
  },
  memoryTitleSelected: {
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  memoryDescSelected: {
    color: colors.primary,
    lineHeight: 18,
  },
  // Memory Option Default
  memoryOptionDefault: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'flex-start',
    marginBottom: spacing[1],
  },
  memoryTitleDefault: {
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  memoryDescDefault: {
    lineHeight: 18,
  },
  checkmarkIcon: {
    alignSelf: 'center',
  },
  checkmarkVisible: {
    opacity: 1,
  },
  checkmarkHidden: {
    opacity: 0,
  },
  // Action Card
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[3],
  },
  actionItem: {
    flexDirection: 'row',
    padding: spacing[2.5],
    alignItems: 'center',
  },
  actionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: isDark ? colors.border : colors.primaryLightSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  actionTextContainer: {
    flex: 1,
    marginRight: spacing[3],
  },
  actionTitle: {
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  actionDesc: {
    lineHeight: 16,
    letterSpacing: -0.28,
    fontWeight:fontWeight.medium,
    fontSize:fontSize.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  // Bottom Buttons
  footer: {
    marginTop: 'auto',
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  buttonSpacer: {
    height: spacing[3],
  },
  buttonText: {
    fontSize: fontSize.base,
  },
  disclaimerBtn: {
    marginTop: spacing[3],
  },
  disclaimerText: {
    fontWeight: fontWeight.semiBold,
    fontSize:fontSize.base,
    lineHeight: 14,
    letterSpacing: -0.28,
    textAlign:"center"
  },
});
