import { StyleSheet } from 'react-native';
import { fontSize, fontWeight } from '../../../theme/fonts';
import { borderRadius } from '../../../theme/spacing';

export const createStyles = ({ colors, spacing }) => StyleSheet.create({
  listContainer: {
    padding: spacing[5],
  },
  cardContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing[3],
    marginBottom: spacing[2],
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    borderRadius: borderRadius.md,
  },
  descriptionText: {
    lineHeight: 17.5,
    letterSpacing: -0.28,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
});
