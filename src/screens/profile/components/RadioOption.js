/**
 * RadioOption — shared circular radio button indicator.
 * Used by GenderSelectionScreen, PrivacySelectionScreen, CountrySelectionScreen.
 */
import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../theme';

const OUTER_SIZE = 22;
const INNER_SIZE = 10;

const RadioOption = ({selected}) => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.outer,
        {
          borderColor: selected ? colors.primary : colors.gray300,
        },
      ]}>
      {selected && (
        <View
          style={[styles.inner, {backgroundColor: colors.primary}]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    borderWidth: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
  },
});

export default memo(RadioOption);
