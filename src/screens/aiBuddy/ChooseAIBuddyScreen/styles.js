import { StyleSheet } from 'react-native';
import { fontSize, fontWeight } from '../../../theme/fonts';

export const createStyles = ({ colors, spacing }) => StyleSheet.create({
  listContainer: {
    padding: spacing[5],
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing[3],
    marginBottom: spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: colors.isDark ? 1 : 0,
    borderColor: colors.border,
    gap:12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 34,
    marginRight: spacing[2],
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  nameText: {
    fontWeight: fontWeight.semiBold,
    fontSize: fontSize.md,
    lineHeight: 18,
    marginBottom: 2,
    letterSpacing: -0.32,
  },
  exploreBtn: {
    paddingHorizontal: spacing[2],
    height: 35,
    borderRadius: 8,
  },

  exploreBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    lineHeight: 13,
    letterSpacing: -0.24,
  },
  cardBody: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing[2],
    borderRadius: 16,
  },
  descriptionText: {
    lineHeight: 17.5,
    letterSpacing: -0.28,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
});
