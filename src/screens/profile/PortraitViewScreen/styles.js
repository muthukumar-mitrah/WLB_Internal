import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[6],
    },
    icon: {
      marginBottom: spacing[4],
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing[2],
    },
    subtitle: {
      textAlign: 'center',
      paddingHorizontal: spacing[4],
    },
  });

export default createStyles;
