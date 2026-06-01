/**
 * Card — themed elevated card container
 */
import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';

const Card = ({
  children,
  onPress,
  style,
  padding,
  borderRadius: customRadius,
  elevation = true,
  ...rest
}) => {
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const containerStyle = [
    styles.card,
    {
      backgroundColor: colors.cardBackground,
      borderRadius: customRadius ?? borderRadius.lg,
      padding: padding ?? spacing[4],
      borderColor: colors.cardBorder,
    },
    elevation && shadows.card,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={containerStyle}
        {...rest}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default memo(Card);
