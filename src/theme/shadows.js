/**
 * Shadow helpers for Android (elevation) and iOS (shadow props)
 */
import {Platform} from 'react-native';

const createShadow = (
  elevation = 4,
  color = '#000',
  opacity = 0.1,
  radius = 8,
  offsetX = 0,
  offsetY = 2,
) => {
  if (Platform.OS === 'android') {
    return {elevation};
  }
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: {width: offsetX, height: offsetY},
  };
};

const shadows = {
  none: {},
  xs: createShadow(1, '#000', 0.05, 2, 0, 1),
  sm: createShadow(2, '#000', 0.08, 4, 0, 2),
  md: createShadow(4, '#000', 0.1, 8, 0, 4),
  lg: createShadow(8, '#000', 0.12, 12, 0, 6),
  xl: createShadow(12, '#000', 0.15, 16, 0, 8),
  '2xl': createShadow(16, '#000', 0.2, 24, 0, 12),
  card: createShadow(3, '#000', 0.08, 6, 0, 2),
  modal: createShadow(24, '#000', 0.25, 32, 0, 16),
  button: createShadow(4, '#2563EB', 0.3, 8, 0, 4),
};

export {shadows, createShadow};
