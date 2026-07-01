import { StyleSheet } from 'react-native';

const SIZES = {
  sm: {
    trackWidth: 40,
    trackHeight: 24,
    thumbSize: 20,
    padding: 2,
  },
  md: {
    trackWidth: 51,
    trackHeight: 31,
    thumbSize: 27,
    padding: 2,
  },
  lg: {
    trackWidth: 60,
    trackHeight: 36,
    thumbSize: 32,
    padding: 2,
  },
};

export const getSwitchMetrics = (size = 'md') => {
  return SIZES[size] || SIZES.md;
};

const createStyles = (size = 'md') => {
  const metrics = getSwitchMetrics(size);

  return StyleSheet.create({
    track: {
      width: metrics.trackWidth,
      height: metrics.trackHeight,
      borderRadius: metrics.trackHeight / 2,
      justifyContent: 'center',
      paddingHorizontal: metrics.padding,
    },
    thumb: {
      width: metrics.thumbSize,
      height: metrics.thumbSize,
      borderRadius: metrics.thumbSize / 2,
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
};

export default createStyles;
