import React, { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import AppText from '../AppText';
import {
  createStyles,
  STAR_COUNT,
  STAR_SIZE,
  GLOW_SIZE,
  THUMB_SIZE,
  THUMB_TRAVEL,
  starCentreX,
  valueToX,
  xToValue,
} from './styles';

const Star = memo(({ filled, onPress, centreX, size = STAR_SIZE, readOnly, styles, colors }) => {
  const selectedColor = colors.accent;
  const unselectedColor = colors.textDisabled;

  if (readOnly) {
    return (
      <View
        style={[
          styles.starBtn,
          styles.absolute,
          {
            left: centreX - size / 2,
            width: size,
            height: size,
          },
        ]}
      >
        <Icon
          name="star"
          size={size}
          color={filled ? selectedColor : unselectedColor}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
      style={[
        styles.starBtn,
        styles.absolute,
        {
          left: centreX - size / 2,
          width: size,
          height: size,
        },
      ]}
    >
      <Icon
        name="star"
        size={size}
        color={filled ? selectedColor : unselectedColor}
      />
    </TouchableOpacity>
  );
});

const RatingCard = memo(({
  questionNumber,
  question,
  rating = 3,
  leftLabel,
  rightLabel,
  showSlider = true,
  readOnly = false,
  onRatingChange,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius]
  );

  const thumbX = useRef(new Animated.Value(valueToX(rating))).current;
  const currentValue = useRef(rating);
  const dragStartX = useRef(0);
  const grantLocalX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current && currentValue.current !== rating) {
      currentValue.current = rating;
      thumbX.setValue(valueToX(rating));
    }
  }, [rating, thumbX]);

  const onRatingChangeRef = useRef(onRatingChange);
  useEffect(() => {
    onRatingChangeRef.current = onRatingChange;
  }, [onRatingChange]);

  const snapToValue = useCallback((newValue) => {
    if (readOnly) return;
    const clamped = Math.max(0, Math.min(newValue, STAR_COUNT));
    currentValue.current = clamped;
    if (onRatingChangeRef.current) {
      onRatingChangeRef.current(clamped);
    }
    Animated.spring(thumbX, {
      toValue: valueToX(clamped),
      useNativeDriver: false,
      friction: 8,
      tension: 120,
    }).start();
  }, [thumbX, readOnly]);

  const panResponder = useMemo(() => {
    if (readOnly) {
      return { panHandlers: {} };
    }
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onShouldBlockNativeResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },

      onPanResponderGrant: (evt) => {
        isDragging.current = true;
        const localX = Math.max(0, Math.min(evt.nativeEvent.locationX, THUMB_TRAVEL));
        grantLocalX.current = localX;
        dragStartX.current = localX;
      },

      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          const nextX = Math.max(0, Math.min(dragStartX.current + gestureState.dx, THUMB_TRAVEL));
          thumbX.setValue(nextX);
          const val = xToValue(nextX);
          currentValue.current = val;
          if (onRatingChangeRef.current) {
            onRatingChangeRef.current(val);
          }
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        isDragging.current = false;
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          snapToValue(xToValue(grantLocalX.current));
        } else {
          const rawX = Math.max(0, Math.min(dragStartX.current + gestureState.dx, THUMB_TRAVEL));
          snapToValue(xToValue(rawX));
        }
      },

      onPanResponderTerminate: () => {
        isDragging.current = false;
        snapToValue(currentValue.current);
      },
    });
  }, [snapToValue, thumbX, readOnly]);

  const handleStarPress = useCallback((starIdx) => {
    snapToValue(starIdx + 1);
  }, [snapToValue]);

  const filledWidth = thumbX.interpolate({
    inputRange: [0, THUMB_TRAVEL],
    outputRange: [THUMB_SIZE / 2, THUMB_TRAVEL + THUMB_SIZE / 2],
    extrapolate: 'clamp',
  });

  const starCentres = useMemo(
    () => Array.from({ length: STAR_COUNT }, (_, i) => starCentreX(i)),
    []
  );

  return (
    <View style={styles.card}>
      <AppText variant="bodyMedium" color={colors.textPrimary} >
        {questionNumber}. {question}
      </AppText>

      <View style={styles.ratingWrapper}>
        {showSlider ? (
          <View style={styles.starsRow}>
            {starCentres.map((cx, i) => (
              <Star
                key={i}
                filled={i < rating}
                onPress={() => handleStarPress(i)}
                centreX={cx}
                size={STAR_SIZE}
                readOnly={readOnly}
                styles={styles}
                colors={colors}
              />
            ))}
          </View>
        ) : (
          <View style={styles.starsRowReadOnly}>
            {Array.from({ length: STAR_COUNT }).map((_, i) => (
              <View key={i} style={styles.starContainerReadOnly}>
                <Icon
                  name="star"
                  size={STAR_SIZE}
                  color={i < rating ? colors.accent : colors.textDisabled}
                />
              </View>
            ))}
          </View>
        )}
        {showSlider && (
          <View style={styles.sliderOuter} {...panResponder.panHandlers}>
            <View style={styles.track} pointerEvents="none" />
            {rating > 0 && (
              <Animated.View style={[styles.filledTrack, { width: filledWidth }]} pointerEvents="none" />
            )}
            <Animated.View
              style={[
                styles.indicatorWrapper,
                { left: -(GLOW_SIZE / 2 - THUMB_SIZE / 2), transform: [{ translateX: thumbX }] },
              ]}
              pointerEvents="none"
            >
              <View style={[styles.triangle, rating === 0 && { borderBottomColor: colors.textDisabled }]} />
              <View style={[styles.glow, rating === 0 && styles.transparentBackground]} />
              <View style={[styles.thumb, rating === 0 && { backgroundColor: colors.textDisabled }]} />
            </Animated.View>
          </View>
        )}
      </View>
      <View style={styles.labelsRow}>
        <AppText variant="caption" color={colors.textTertiary} style={styles.labelText}>
          {leftLabel}
        </AppText>
        <AppText variant="caption" color={colors.textTertiary} style={[styles.labelText, styles.rightLabelText]}>
          {rightLabel}
        </AppText>
      </View>
    </View>
  );
});

export default RatingCard;
