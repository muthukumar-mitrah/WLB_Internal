import { StyleSheet } from 'react-native';

export const createStyles = ({ colors, spacing }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing[4],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing[5],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: spacing[4],
  },
  headerText: {
    flex: 1,
  },
  aboutText: {
    lineHeight: 22,
    marginBottom: spacing[5],
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: spacing[4],
    marginBottom: spacing[5],
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  chooseBtn: {
    flex: 2.5,
  },
  followBtn: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginRight: spacing[2],
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  inactiveTabText: {
    color: colors.textSecondary,
  },
  feedContainer: {
    paddingTop: spacing[4],
  },
  emptyStateContainer: {
    paddingVertical: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
