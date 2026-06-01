/**
 * Divider — horizontal or vertical line separator
 */
import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import AppText from './AppText';

const Divider = ({
  orientation = 'horizontal',
  label,
  color,
  thickness = 1,
  style,
  labelStyle,
}) => {
  const {colors, spacing} = useTheme();
  const lineColor = color || colors.divider;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          {width: thickness, backgroundColor: lineColor},
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.labelRow, style]}>
        <View style={[styles.line, {backgroundColor: lineColor, height: thickness}]} />
        <AppText
          variant="caption"
          color={colors.textTertiary}
          style={[{marginHorizontal: spacing[3]}, labelStyle]}>
          {label}
        </AppText>
        <View style={[styles.line, {backgroundColor: lineColor, height: thickness}]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {height: thickness, backgroundColor: lineColor},
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    marginVertical: 12,
  },
  vertical: {
    height: '100%',
    marginHorizontal: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  line: {
    flex: 1,
  },
});

export default memo(Divider);
