import { StyleSheet } from 'react-native';

export const createStyles = ({ colors, spacing }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing[4],
  },
  icon: {
    width: 24,
    height: 24,
  },
  smallIcon: {
    width: 20,
    height: 20,
  },
  sectionTitle: {
    marginTop: spacing[5],
    marginBottom: spacing[3],
    fontWeight: '600',
  },
  subtitle: {
    marginBottom: spacing[4],
    lineHeight: 20,
  },
  // Memory Option Selected
  memoryOptionSelected: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '1A', // 10% opacity primary
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[3],
    alignItems: 'center',
  },
  memoryIconContainer: {
    marginRight: spacing[3],
    alignSelf: 'flex-start',
  },
  memoryTextContainer: {
    flex: 1,
    marginRight: spacing[3],
  },
  memoryTitleSelected: {
    fontWeight: '700',
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
    padding: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  memoryTitleDefault: {
    fontWeight: '700',
    marginBottom: 2,
  },
  memoryDescDefault: {
    lineHeight: 18,
  },
  // Action Card
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing[6],
    borderWidth: colors.isDark ? 1 : 0,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    padding: spacing[4],
    alignItems: 'center',
  },
  actionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  actionTextContainer: {
    flex: 1,
    marginRight: spacing[3],
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDesc: {
    lineHeight: 18,
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
  disclaimerBtn: {
    marginTop: spacing[4],
  },
  disclaimerText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
