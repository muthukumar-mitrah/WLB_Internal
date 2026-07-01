import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, typography }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    comingSoonText: {
      ...typography?.title,
      color: colors.textPrimary,
    },
  });

export default createStyles;
