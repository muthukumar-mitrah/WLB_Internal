import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing}) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
    },

    sectionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing[3],
    },

    listContainer: {
      backgroundColor: 'transparent',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[4],
    },

    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[3],
    },

    optionLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      marginRight: spacing[3],
    },

    divider: {marginVertical: 0},

    buttonContainer: {
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      paddingTop: spacing[3],
      backgroundColor: colors.profileBackground,
    },
  });

export default createStyles;
