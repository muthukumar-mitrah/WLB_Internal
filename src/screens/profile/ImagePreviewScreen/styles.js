import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    imageContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });

export default createStyles;
