import { StyleSheet } from 'react-native';

const createStyles = () =>
  StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    fullWidth: {
      width: '100%',
    },
    disabled: {
      opacity: 0.5,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginLeft: 8,
    },
  });

export default createStyles;
