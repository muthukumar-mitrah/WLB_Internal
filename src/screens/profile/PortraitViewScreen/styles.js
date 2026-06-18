import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      paddingBottom: spacing[6],
    },
    // Top Portrait Card
    portraitCard: {
      marginHorizontal: spacing[4],
      marginTop: spacing[3],
      padding: spacing[5],
      borderRadius: borderRadius.xl || 16,
      backgroundColor: colors.primaryNav,
    },
    portraitCardTitle: {
      marginBottom: spacing[1],
    },
    portraitCardSubtitle: {
      color: 'rgba(255, 255, 255, 0.85)',
      marginBottom: spacing[4],
      lineHeight: 18,
    },
    editBtn: {
      backgroundColor: colors.gray100,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: borderRadius.md || 8,
      alignSelf: 'flex-start',
    },
    editBtnText: {
      color: colors.black,
      fontWeight: '600',
    },
    // Tab Bar
    tabBar: {
      flexDirection: 'row',
      marginHorizontal: spacing[4],
      marginTop: spacing[4],
      marginBottom: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tabBtn: {
      paddingVertical: spacing[2],
      marginRight: spacing[5],
      borderBottomWidth: 1.5,
      borderBottomColor: 'transparent',
    },
    tabBtnActive: {
      borderBottomColor: colors.primaryDeep,
    },
    tabText: {
      fontWeight: '700',
    },
    // List content
    listContainer: {
      paddingHorizontal: spacing[4],
    },
    cardItem: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg || 12,
      padding: spacing[4],
      marginBottom: spacing[3],
      borderWidth: 1,
      borderColor: colors.border,
    },
    questionText: {
      marginBottom: spacing[2],
    },
  });

export default createStyles;
