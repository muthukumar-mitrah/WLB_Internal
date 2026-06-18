import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const STAR_COUNT = 5;
export const STAR_SIZE = 25;

const CARD_H_PAD = 12;
const WRAPPER_H_PAD = 16;
const SCROLL_H_PAD = 20;

export const CONTENT_W = SCREEN_WIDTH - SCROLL_H_PAD * 2 - CARD_H_PAD * 2 - WRAPPER_H_PAD * 2;

export const TRACK_HEIGHT = 4;
export const THUMB_SIZE = 20;
export const THUMB_BORDER = 3;
export const GLOW_SIZE = THUMB_SIZE + 10;
export const THUMB_TRAVEL = CONTENT_W - THUMB_SIZE;

export const TRIANGLE_W = 6;
export const TRIANGLE_H = 8;
export const TRIANGLE_GAP = 2;

export const starX = (starIdx) =>
  (starIdx / (STAR_COUNT - 1)) * THUMB_TRAVEL;

export const starCentreX = (starIdx) => starX(starIdx) + THUMB_SIZE / 2;

export const xToValue = (x) => {
  const clampedX = Math.max(0, Math.min(x, THUMB_TRAVEL));
  if (clampedX < 20) {
    return 0;
  }
  const step = THUMB_TRAVEL / (STAR_COUNT - 1);
  return Math.round(clampedX / step) + 1;
};

export const valueToX = (value) => {
  if (value <= 0) return 0;
  return starX(value - 1);
};

export const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    card: {
      borderWidth: 0.5,
      borderRadius: borderRadius.xl || 16,
      paddingHorizontal: CARD_H_PAD,
      paddingVertical: spacing[5] || 20,
      marginVertical: spacing[2] || 8,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    questionText: {
      fontSize: 15,
      lineHeight: 20,
      marginBottom: spacing[2] || 8,
    },
    ratingWrapper: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingHorizontal: WRAPPER_H_PAD,
      borderRadius: 10,
      alignItems: 'flex-start',
      marginTop: 15,
      backgroundColor: colors.backgroundTertiary,
    },
    starsRowReadOnly: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing[2],
    },
    starContainerReadOnly: {
      marginHorizontal: 15,
    },
    starsRow: {
      width: CONTENT_W,
      height: STAR_SIZE,
      marginVertical: spacing[3],
      position: 'relative',
    },
    starBtn: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    sliderOuter: {
      width: CONTENT_W,
      height: TRIANGLE_H + TRIANGLE_GAP + THUMB_SIZE + 6,
      position: 'relative',
    },
    track: {
      position: 'absolute',
      top: TRIANGLE_H + TRIANGLE_GAP + (THUMB_SIZE - TRACK_HEIGHT) / 2,
      left: 0,
      width: CONTENT_W,
      height: TRACK_HEIGHT,
      borderRadius: TRACK_HEIGHT / 2,
      backgroundColor: colors.textDisabled,
    },
    filledTrack: {
      position: 'absolute',
      top: TRIANGLE_H + TRIANGLE_GAP + (THUMB_SIZE - TRACK_HEIGHT) / 2,
      left: 0,
      height: TRACK_HEIGHT,
      borderRadius: TRACK_HEIGHT / 2,
      backgroundColor: colors.primary,
    },
    indicatorWrapper: {
      position: 'absolute',
      top: 0,
      width: GLOW_SIZE,
      height: TRIANGLE_H + TRIANGLE_GAP + THUMB_SIZE + 6,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    triangle: {
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderLeftWidth: TRIANGLE_W,
      borderRightWidth: TRIANGLE_W,
      borderBottomWidth: TRIANGLE_H,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.primary,
      marginBottom: TRIANGLE_GAP,
      zIndex: 20,
      top: -2,
    },
    glow: {
      position: 'absolute',
      top: TRIANGLE_H + TRIANGLE_GAP + (THUMB_SIZE - GLOW_SIZE) / 2,
      left: 0,
      width: GLOW_SIZE,
      height: GLOW_SIZE,
      borderRadius: GLOW_SIZE / 2,
      backgroundColor: `${colors.primary}30`,
    },
    thumb: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      borderWidth: THUMB_BORDER,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 30,
      backgroundColor: colors.primary,
      borderColor: colors.white,
    },
    labelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 8,
    },
    labelText: {
      maxWidth: '45%',
      marginLeft: 5,
      // color: colors.textSecondary,
    },
    rightLabelText: {
      maxWidth: '45%',
      textAlign: 'right',
      marginRight: 5,
    },
    absolute: {
      position: 'absolute',
    },
    transparentBackground: {
      backgroundColor: 'transparent',
    },
  });
