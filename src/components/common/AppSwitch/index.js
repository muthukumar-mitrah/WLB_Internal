import React, { useRef, useEffect, useMemo } from 'react';
import { Pressable, Animated } from 'react-native';
import { useTheme } from '../../../theme';
import createStyles, { getSwitchMetrics } from './styles';

const AppSwitch = ({
  value = false,
  onValueChange,
  size = 'md',
  disabled = false,
  activeColor,
  inactiveColor,
  thumbColor,
  style,
  testID,
  accessibilityLabel,
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

  const styles = useMemo(() => createStyles(size), [size]);
  const metrics = getSwitchMetrics(size);

  // Interpolate track background color
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultInactiveColor, activeTrackColor],
  });

  // Calculate translation: trackWidth - thumbSize - (padding * 2)
  const maxTranslate = metrics.trackWidth - metrics.thumbSize - (metrics.padding * 2);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxTranslate],
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
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
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

export default React.memo(AppSwitch);
