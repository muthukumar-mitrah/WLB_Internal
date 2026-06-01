/**
 * Responsive sizing utilities
 * Provides scale/font scaling relative to the design base screen (375pt wide)
 */
import {Dimensions, PixelRatio} from 'react-native';
import {BASE_WIDTH, BASE_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT} from '../constants';

/**
 * Horizontal scale — use for widths, margins, paddings
 * @param {number} size
 * @returns {number}
 */
const scale = size => Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

/**
 * Vertical scale — use for heights, vertical margins/paddings
 * @param {number} size
 * @returns {number}
 */
const verticalScale = size => Math.round((SCREEN_HEIGHT / BASE_HEIGHT) * size);

/**
 * Moderate scale — balanced scaling, avoids extreme sizes on large devices
 * @param {number} size
 * @param {number} [factor=0.5]
 * @returns {number}
 */
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

/**
 * Font scale — scales font size relative to device and accessibility settings
 * @param {number} size
 * @returns {number}
 */
const fontScale = size => {
  const scaled = moderateScale(size, 0.3);
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

/**
 * Width percent — percentage of screen width
 * @param {number} percent 0-100
 * @returns {number}
 */
const wp = percent => Math.round((percent / 100) * SCREEN_WIDTH);

/**
 * Height percent — percentage of screen height
 * @param {number} percent 0-100
 * @returns {number}
 */
const hp = percent => Math.round((percent / 100) * SCREEN_HEIGHT);

export {scale, verticalScale, moderateScale, fontScale, wp, hp};
