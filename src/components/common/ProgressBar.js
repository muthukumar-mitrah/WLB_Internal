import React, {memo, useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {useTheme} from '../../theme';

const ProgressBar = ({
  progress = 0,
  height = 8,
  color,
  trackColor,
  style,
  animated = true,
}) => {
  const {colors} = useTheme();
  
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const fillWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Reset to 0 before starting the animation so it always grows from 0
      fillWidth.setValue(0);
      Animated.timing(fillWidth, {
        toValue: clampedProgress,
        duration: 1200,
        delay: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      fillWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, fillWidth]);

  // Fill is green when 100%, otherwise falls back to custom color or primary
  const activeColor = clampedProgress >= 100 ? colors.success : (color || colors.primary);
  const trackBgColor = trackColor || colors.backgroundSecondary;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackBgColor,
          borderRadius: height / 2,
        },
        style,
      ]}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: fillWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: activeColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default memo(ProgressBar);
