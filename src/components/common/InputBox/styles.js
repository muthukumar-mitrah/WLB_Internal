import { StyleSheet } from 'react-native';

const createStyles = () =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
      width: '100%',
      alignSelf: 'stretch',
    },
    label: {
      marginBottom: 6,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      width: '100%',
      alignSelf: 'stretch',
    },
    input: {
      flex: 1,
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginLeft: 8,
    },
    message: {
      marginTop: 4,
      marginLeft: 2,
    },
  });

export default createStyles;
