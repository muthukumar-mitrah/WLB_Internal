import { StyleSheet } from 'react-native';

export const createStyles = ({ colors, spacing }) => StyleSheet.create({
  listContainer: {
    padding: spacing[4],
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing[2],
    marginBottom: spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: colors.isDark ? 1 : 0,
    borderColor: colors.border,
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
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  exploreBtn: {
    paddingHorizontal: spacing[2],
    height: 40,
    borderRadius: 8
  },
  cardBody: {
    marginTop: spacing[3],
    backgroundColor: colors.backgroundSecondary,
    padding: spacing[3],
    borderRadius: 16,
  },
  descriptionText: {
    lineHeight: 16,
    fontSize: 12,
  },
});
