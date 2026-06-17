import { StyleSheet } from 'react-native';

export const createStyles = ({ colors, spacing }) => StyleSheet.create({
  container: {
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
  },
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: spacing[2],
    marginBottom: spacing[3],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  icon: {
    width: 24,
    height: 24,
  },
  smallIcon: {
    width: 20,
    height: 20,
  },
  featureText: {
    flex: 1,
  },
  desc: {
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing[5],
    gap: spacing[3],
  },
  cancelBtn: {
    flex: 1,
    borderColor: colors.border,
  },
  nextBtn: {
    flex: 1,
  },
});
