import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

const CommonToggle = ({
  value = false,
  onValueChange,
  disabled = false,
  activeColor,
  inactiveColor,
  thumbColor,
  style,
}) => {
  const { colors, isDark } = useTheme();

  // Colors
  const defaultActiveColor = activeColor || colors.primary;
  const defaultInactiveColor = inactiveColor || colors.border;

  const activeTrackColor = isDark
    ? colors.primary + '40' // 25% opacity primary color for dark mode
    : (colors.primaryLightSoft || colors.primary + '26');

  // Animation values
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const toggle = () => {
    if (disabled) return;
    if (onValueChange) {
      onValueChange(!value);
    }
  };

  // Interpolate track background color
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultInactiveColor, activeTrackColor],
  });

  // Interpolate thumb position (from left padding 2px to right padding 2px)
  // Track width 51, thumb width 27, padding 2 => max translateX = 51 - 27 - 2 = 22.
  // With paddingHorizontal: 2 on track, default start is at offset 2.
  // To stay within padding bounds, translateX should animate from 0 to 20.
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  // Interpolate thumb color
  const interpolatedThumbColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbColor || colors.white, defaultActiveColor],
  });

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      style={[
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: backgroundColor },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
              backgroundColor: interpolatedThumbColor,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 51,
    height: 31,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CommonToggle;
