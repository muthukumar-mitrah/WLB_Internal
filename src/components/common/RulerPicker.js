import { useRef, useCallback, useEffect, useState, useMemo, useImperativeHandle, forwardRef, memo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, Animated, PanResponder } from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily } from '../../theme/fonts';
import { AppText } from '../common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HALF_WIDTH = SCREEN_WIDTH / 2;

const THUMB_SIZE = 28;
const THUMB_BORDER = 4;
const TRIANGLE_W = 10;
const TRIANGLE_H = 12;
const TRIANGLE_GAP = 2;
const TRACK_HEIGHT = 3;

const TRIANGLE_TOP = 0;
const CIRCLE_TOP = TRIANGLE_TOP + TRIANGLE_H + TRIANGLE_GAP;
const TRACK_CENTER = CIRCLE_TOP + THUMB_SIZE / 2;
const RULER_TOP = CIRCLE_TOP + THUMB_SIZE + 8;
const CONTAINER_H = RULER_TOP + 65;

const THUMB_LABEL_TOP = 0;
const THUMB_TRIANGLE_TOP = 25;
const THUMB_CIRCLE_TOP = THUMB_TRIANGLE_TOP + TRIANGLE_H + TRIANGLE_GAP;
const THUMB_TRACK_CENTER = THUMB_CIRCLE_TOP + THUMB_SIZE / 2;
const THUMB_RULER_TOP = THUMB_CIRCLE_TOP + THUMB_SIZE + 16;
const THUMB_CONTAINER_H = THUMB_RULER_TOP + 58;

const ThumbValueLabel = memo(forwardRef(({ value, valueUnit, color }, ref) => {
  const [labelValue, setLabelValue] = useState(value);

  useImperativeHandle(ref, () => ({
    setValue: setLabelValue,
  }), []);

  useEffect(() => {
    setLabelValue(value);
  }, [value]);

  return (
    <View style={singleStyles.thumbValueLabel}>
      <Text
        style={[
          singleStyles.thumbValueNumber,
          {
            color,
            fontFamily: fontFamily.bold,
          },
        ]}
      >
        {labelValue}
      </Text>
      {!!valueUnit && (
        <Text
          style={[
            singleStyles.thumbValueUnit,
            {
              color,
              fontFamily: fontFamily.medium,
            },
          ]}
        >
          {valueUnit}
        </Text>
      )}
    </View>
  );
}));

const SingleRulerPicker = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  renderLabel,
  itemWidth = 12,
  majorTickInterval = 10,
  interaction = 'scroll',
  showValueLabel = false,
  valueUnit,
  labelInterval,
  isScrollableScale = false,
  minValue: minValueProp,
  maxValue: maxValueProp,
  allowManualScroll = false,
  showScale = true,
  showTicks = true,
}) => {
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const rulerScrollRef = useRef(null);
  const isUserScrolling = useRef(false);
  const isRulerUserScrolling = useRef(false);
  const isDraggingThumb = useRef(false);
  const currentValue = useRef(value);
  const dragStartX = useRef(0);
  const valueLabelRef = useRef(null);
  const trackWidthRef = useRef(0);
  const lastRulerScrollOffset = useRef(0);
  const momentumScrollEndTimer = useRef(null);
  const pendingRulerScroll = useRef(null);
  const thumbX = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);
  const [rulerScrollEnabled, setRulerScrollEnabled] = useState(allowManualScroll);

  const steps = useMemo(() => Math.round((max - min) / step), [max, min, step]);
  const data = useMemo(() => Array.from({ length: steps + 1 }, (_, i) => {
    const val = min + i * step;
    return Math.round(val * 1000) / 1000;
  }), [steps, min, step]);

  // ── Scrollable ruler range (only relevant when isScrollableScale = true) ──
  const rulerMin = useMemo(
    () => (isScrollableScale && minValueProp !== undefined ? minValueProp : min),
    [isScrollableScale, minValueProp, min],
  );
  const rulerMax = useMemo(
    () => (isScrollableScale && maxValueProp !== undefined ? maxValueProp : max),
    [isScrollableScale, maxValueProp, max],
  );
  const rulerSteps = useMemo(
    () => Math.round((rulerMax - rulerMin) / step),
    [rulerMax, rulerMin, step],
  );
  const rulerData = useMemo(() => {
    if (!isScrollableScale) return [];
    return Array.from({ length: rulerSteps + 1 }, (_, i) => {
      const val = rulerMin + i * step;
      return Math.round(val * 1000) / 1000;
    });
  }, [isScrollableScale, rulerMin, rulerSteps, step]);

  const clampIndex = useCallback((index) => (
    Math.max(0, Math.min(index, data.length - 1))
  ), [data.length]);

  const getValueFromX = useCallback((x) => {
    const width = trackWidthRef.current || trackWidth || RANGE_TRACK_WIDTH;
    const clampedX = Math.max(0, Math.min(x, width));
    const index = clampIndex(Math.round((clampedX / width) * steps));
    return data[index];
  }, [clampIndex, data, steps, trackWidth]);

  const getXFromValue = useCallback((nextValue) => {
    const width = trackWidthRef.current || trackWidth || RANGE_TRACK_WIDTH;
    const index = clampIndex(Math.round((nextValue - min) / step));
    return (index / steps) * width;
  }, [clampIndex, min, step, steps, trackWidth]);

  const updateValueLabel = useCallback((nextValue) => {
    valueLabelRef.current?.setValue(nextValue);
  }, []);

  const setThumbValue = useCallback((nextValue, animated = false) => {
    const nextX = getXFromValue(nextValue);
    currentValue.current = nextValue;
    updateValueLabel(nextValue);

    if (animated) {
      Animated.spring(thumbX, {
        toValue: nextX,
        useNativeDriver: false,
      }).start();
      return;
    }

    thumbX.setValue(nextX);
  }, [getXFromValue, thumbX, updateValueLabel]);

  const getRulerOffsetFromValue = useCallback((val) => {
    const tw = trackWidth || trackWidthRef.current || 0;
    if (!tw || !rulerSteps) return 0;
    const clampedVal = Math.max(rulerMin, Math.min(val, rulerMax));
    const i = Math.round((clampedVal - rulerMin) / step);
    const pixelsPerStep = itemWidth - tw / rulerSteps;
    return Math.max(0, Math.round(i * pixelsPerStep + itemWidth / 2));
  }, [rulerMin, rulerMax, step, itemWidth, trackWidth, rulerSteps]);

  const getValueFromRulerOffset = useCallback((offsetX) => {
    const tw = trackWidth || trackWidthRef.current || 0;
    if (!tw || !rulerSteps) return min;
    const pixelsPerStep = itemWidth - tw / rulerSteps;
    if (pixelsPerStep <= 0) return min;
    const i = Math.round((offsetX - itemWidth / 2) / pixelsPerStep);
    const clampedI = Math.max(0, Math.min(i, rulerSteps));
    return Math.max(min, Math.min(rulerMin + clampedI * step, max));
  }, [rulerMin, rulerSteps, step, itemWidth, trackWidth, min, max]);

  useEffect(() => {
    const index = Math.round((value - min) / step);
    const clampedIndex = clampIndex(index);
    if (interaction === 'thumb') {
      if (isDraggingThumb.current) {
        return;
      }
      currentValue.current = data[clampedIndex];
      setThumbValue(data[clampedIndex]);
      if (isScrollableScale && !isRulerUserScrolling.current) {
        setTimeout(() => {
          const offset = getRulerOffsetFromValue(data[clampedIndex]);
          rulerScrollRef.current?.scrollTo({ x: offset, animated: false });
        }, 150);
      }
    } else if (scrollRef.current) {
      currentValue.current = data[clampedIndex];
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: clampedIndex * itemWidth, animated: false });
      }, 150);
    }
  }, [clampIndex, data, getRulerOffsetFromValue, interaction, isScrollableScale, itemWidth, min, setThumbValue, step, value]);

  const handleScrollBegin = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  const handleMomentumEnd = useCallback((e) => {
    isUserScrolling.current = false;
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / itemWidth);
    const clampedIndex = clampIndex(index);
    const newValue = data[clampedIndex];

    scrollRef.current?.scrollTo({ x: clampedIndex * itemWidth, animated: true });

    if (newValue !== currentValue.current) {
      currentValue.current = newValue;
      onValueChange(newValue);
    }
  }, [clampIndex, data, itemWidth, onValueChange]);

  const handleScroll = useCallback((e) => {
    if (!isUserScrolling.current) return;
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / itemWidth);
    const clampedIndex = clampIndex(index);
    const newValue = data[clampedIndex];

    if (newValue !== currentValue.current) {
      currentValue.current = newValue;
      onValueChange(newValue);
    }
  }, [clampIndex, data, itemWidth, onValueChange]);

  // ── Scrollable ruler scroll handlers (isScrollableScale + interaction='thumb') ─
  const handleRulerScrollBegin = useCallback(() => {
    isRulerUserScrolling.current = true;
  }, []);

  const handleRulerScroll = useCallback((e) => {
    if (!isRulerUserScrolling.current) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    lastRulerScrollOffset.current = offsetX;
    const newValue = getValueFromRulerOffset(offsetX);

    if (newValue !== currentValue.current) {
      currentValue.current = newValue;
      updateValueLabel(newValue);
      if (!isDraggingThumb.current) {
        thumbX.setValue(getXFromValue(newValue));
      }
    }
  }, [getValueFromRulerOffset, getXFromValue, thumbX, updateValueLabel]);

  // Uses a timer so that if momentum fires it cancels the fallback handler.
  const handleRulerScrollEndDrag = useCallback((e) => {
    lastRulerScrollOffset.current = e.nativeEvent.contentOffset.x;
    if (momentumScrollEndTimer.current) clearTimeout(momentumScrollEndTimer.current);
    momentumScrollEndTimer.current = setTimeout(() => {
      momentumScrollEndTimer.current = null;
      isRulerUserScrolling.current = false;
      const offsetX = lastRulerScrollOffset.current;
      const newValue = getValueFromRulerOffset(offsetX);
      const snappedOffset = getRulerOffsetFromValue(newValue);
      rulerScrollRef.current?.scrollTo({ x: snappedOffset, animated: true });
      currentValue.current = newValue;
      setThumbValue(newValue);
      onValueChange(newValue);
    }, 300);
  }, [getValueFromRulerOffset, getRulerOffsetFromValue, setThumbValue, onValueChange]);

  const handleRulerMomentumEnd = useCallback((e) => {
    if (momentumScrollEndTimer.current) {
      clearTimeout(momentumScrollEndTimer.current);
      momentumScrollEndTimer.current = null;
    }
    isRulerUserScrolling.current = false;
    const offsetX = e.nativeEvent.contentOffset.x;
    const newValue = getValueFromRulerOffset(offsetX);
    const snappedOffset = getRulerOffsetFromValue(newValue);
    rulerScrollRef.current?.scrollTo({ x: snappedOffset, animated: true });
    currentValue.current = newValue;
    setThumbValue(newValue);
    onValueChange(newValue);
  }, [getValueFromRulerOffset, getRulerOffsetFromValue, setThumbValue, onValueChange]);

  // Cleanup ruler scroll timer and pending animation frame on unmount
  useEffect(() => {
    return () => {
      if (momentumScrollEndTimer.current) clearTimeout(momentumScrollEndTimer.current);
      if (pendingRulerScroll.current) cancelAnimationFrame(pendingRulerScroll.current);
    };
  }, []);

  const thumbPanResponder = useMemo(
    () => PanResponder.create({
      // Capture phase: claim the gesture BEFORE any child ScrollView on iOS
      onStartShouldSetPanResponderCapture: () => interaction === 'thumb',
      onMoveShouldSetPanResponderCapture: () => interaction === 'thumb',
      onStartShouldSetPanResponder: () => interaction === 'thumb',
      onMoveShouldSetPanResponder: () => interaction === 'thumb',
      // Prevent iOS from terminating our gesture in favour of a ScrollView
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        isDraggingThumb.current = true;
        dragStartX.current = getXFromValue(currentValue.current);
        // Disable ruler ScrollView touches while dragging to prevent iOS gesture conflict
        if (isScrollableScale) {
          setRulerScrollEnabled(false);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const width = trackWidthRef.current || trackWidth || RANGE_TRACK_WIDTH;
        const nextX = Math.max(0, Math.min(dragStartX.current + gestureState.dx, width));
        const newValue = getValueFromX(nextX);

        thumbX.setValue(nextX);
        if (newValue !== currentValue.current) {
          currentValue.current = newValue;
          updateValueLabel(newValue);
          // Defer ruler scroll to avoid iOS gesture termination from synchronous scrollTo
          if (isScrollableScale && !isRulerUserScrolling.current) {
            if (pendingRulerScroll.current) {
              cancelAnimationFrame(pendingRulerScroll.current);
            }
            const offset = getRulerOffsetFromValue(newValue);
            pendingRulerScroll.current = requestAnimationFrame(() => {
              pendingRulerScroll.current = null;
              rulerScrollRef.current?.scrollTo({ x: offset, animated: false });
            });
          }
        }
      },
      onPanResponderRelease: () => {
        isDraggingThumb.current = false;
        if (pendingRulerScroll.current) {
          cancelAnimationFrame(pendingRulerScroll.current);
          pendingRulerScroll.current = null;
        }
        setThumbValue(currentValue.current, true);
        onValueChange(currentValue.current);
        if (isScrollableScale) {
          const rulerOffset = getRulerOffsetFromValue(currentValue.current);
          rulerScrollRef.current?.scrollTo({ x: rulerOffset, animated: true });
          // Re-enable ruler scrolling after a short delay to let the scroll settle
          setTimeout(() => setRulerScrollEnabled(allowManualScroll), 100);
        }
      },
      onPanResponderTerminate: () => {
        isDraggingThumb.current = false;
        if (pendingRulerScroll.current) {
          cancelAnimationFrame(pendingRulerScroll.current);
          pendingRulerScroll.current = null;
        }
        setThumbValue(currentValue.current, true);
        onValueChange(currentValue.current);
        if (isScrollableScale) {
          const rulerOffset = getRulerOffsetFromValue(currentValue.current);
          rulerScrollRef.current?.scrollTo({ x: rulerOffset, animated: true });
          setTimeout(() => setRulerScrollEnabled(allowManualScroll), 100);
        }
      },
    }),
    [allowManualScroll, getValueFromX, getXFromValue, getRulerOffsetFromValue, interaction, isScrollableScale, onValueChange, setThumbValue, thumbX, trackWidth, updateValueLabel],
  );

  if (interaction === 'thumb') {
    const activeWidth = thumbX.interpolate({
      inputRange: [0, trackWidth || RANGE_TRACK_WIDTH],
      outputRange: [0, trackWidth || RANGE_TRACK_WIDTH],
      extrapolate: 'clamp',
    });
    const inactiveLeft = thumbX.interpolate({
      inputRange: [0, trackWidth || RANGE_TRACK_WIDTH],
      outputRange: [0, trackWidth || RANGE_TRACK_WIDTH],
      extrapolate: 'clamp',
    });
    const inactiveWidth = thumbX.interpolate({
      inputRange: [0, trackWidth || RANGE_TRACK_WIDTH],
      outputRange: [trackWidth || RANGE_TRACK_WIDTH, 0],
      extrapolate: 'clamp',
    });

    const resolvedLabelInterval = labelInterval || majorTickInterval;

    return (
      <View
        style={[singleStyles.container, singleStyles.thumbModeContainer]}
        onLayout={(e) => {
          const nextWidth = e.nativeEvent.layout.width;
          trackWidthRef.current = nextWidth;
          setTrackWidth(currentWidth => (currentWidth === nextWidth ? currentWidth : nextWidth));
        }}
      >
        <View
          style={[singleStyles.trackRow, { top: THUMB_TRACK_CENTER - TRACK_HEIGHT / 2 }]}
          pointerEvents="none"
        >
          <Animated.View
            style={[
              singleStyles.thumbModeTrackFill,
              {
                backgroundColor: colors.primary,
                width: activeWidth,
              },
            ]}
          />
          <Animated.View
            style={[
              singleStyles.thumbModeTrackInactive,
              {
                left: inactiveLeft,
                width: inactiveWidth,
              },
            ]}
          />
        </View>
        {showScale && isScrollableScale ? (
          // ── Scrollable ruler (opt-in) ────────────────────────────────────
          <View style={[singleStyles.scrollableRulerContainer, { top: THUMB_RULER_TOP }]}>
            <ScrollView
              ref={rulerScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              scrollEnabled={rulerScrollEnabled}
              snapToInterval={itemWidth}
              decelerationRate="fast"
              onScrollBeginDrag={handleRulerScrollBegin}
              onMomentumScrollEnd={handleRulerMomentumEnd}
              onScrollEndDrag={handleRulerScrollEndDrag}
              onScroll={handleRulerScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
            >
              {rulerData.map((val, index) => {
                const isMajor = index % majorTickInterval === 0;
                const isHalfMajor = (val - rulerMin) % majorTickInterval === majorTickInterval / 2;
                const isLargeTick = isMajor || isHalfMajor;
                const shouldRenderLabel = index % Math.max(1, resolvedLabelInterval) === 0;
                return (
                  <View key={index} style={[singleStyles.tickContainer, { width: itemWidth }]}>
                    {showTicks && (
                      <View
                        style={[
                          singleStyles.tick,
                          isLargeTick ? singleStyles.thumbModeTickLarge : singleStyles.thumbModeTickMinor,
                          isLargeTick ? singleStyles.thumbModeTickMajorColor : singleStyles.thumbModeTickMinorColor,
                        ]}
                      />
                    )}
                    {shouldRenderLabel && renderLabel && (
                      <View style={[
                        singleStyles.labelContainer,
                        index === 0 && singleStyles.labelContainerFirst,
                        index === rulerSteps && singleStyles.labelContainerLast,
                      ]}>
                        <Text
                          style={[
                            singleStyles.label,
                            { fontFamily: fontFamily.regular },
                            singleStyles.thumbModeLabel,
                          ]}
                        >
                          {renderLabel(val)}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : showScale ? (
          <View style={[singleStyles.fixedRuler, { top: THUMB_RULER_TOP }]} pointerEvents="none">
            {data.map((val, index) => {
              const isMajor = index % majorTickInterval === 0;
              const isHalfMajor = (val - min) % majorTickInterval === majorTickInterval / 2;
              const isLargeTick = isMajor || isHalfMajor;
              const isEndpoint = index === 0 || index === data.length - 1;
              const shouldRenderLabel = val !== max && index % Math.max(1, resolvedLabelInterval) === 0;
              const left = steps === 0 ? 0 : (index / steps) * (trackWidth || RANGE_TRACK_WIDTH);

              if (!isEndpoint && !isMajor && index % step !== 0) {
                return null;
              }

              return (
                <View key={index} style={[singleStyles.fixedTickContainer, { left }]}>
                  {showTicks && (
                    <View
                      style={[
                        singleStyles.tick,
                        isLargeTick ? singleStyles.thumbModeTickLarge : singleStyles.thumbModeTickMinor,
                        isLargeTick ? singleStyles.thumbModeTickMajorColor : singleStyles.thumbModeTickMinorColor,
                      ]}
                    />
                  )}
                  {shouldRenderLabel && renderLabel && (
                    <View style={[singleStyles.labelContainer, val === min && singleStyles.labelContainerStart]}>
                      <Text
                        style={[
                          singleStyles.label,
                          {
                            fontFamily: fontFamily.regular,
                          },
                          singleStyles.thumbModeLabel,
                        ]}
                      >
                        {renderLabel(val)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : null}

        {showValueLabel && (() => {
          const LABEL_W = 100;
          const tw = trackWidth || trackWidthRef.current || SCREEN_WIDTH;
          // Label left edge clamped so label stays fully within [0, trackWidth].
          // Unclamped left = thumbX - LABEL_W/2. Clamped to [0, tw - LABEL_W].
          const labelLeft = thumbX.interpolate({
            inputRange: [0, LABEL_W / 2, tw - LABEL_W / 2, tw],
            outputRange: [0, 0, tw - LABEL_W, tw - LABEL_W],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={[singleStyles.floatingLabelWrapper, { top: THUMB_LABEL_TOP, left: 0, transform: [{ translateX: labelLeft }] }]}
              pointerEvents="none"
            >
              <ThumbValueLabel
                ref={valueLabelRef}
                value={currentValue.current}
                valueUnit={valueUnit}
                color={colors.primary}
              />
            </Animated.View>
          );
        })()}

        <Animated.View
          style={[
            singleStyles.indicatorWrapper,
            {
              top: THUMB_TRIANGLE_TOP,
              left: -(THUMB_SIZE / 2),
              transform: [{ translateX: thumbX }],
            },
          ]}
          hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
          {...thumbPanResponder.panHandlers}
        >
          <View
            style={[
              singleStyles.triangle,
              { borderBottomColor: colors.primary, marginBottom: TRIANGLE_GAP },
            ]}
          />
          <View
            style={[
              singleStyles.thumbGlow,
              { backgroundColor: `${colors.primary}50` },
            ]}
          />
          <View
            style={[
              singleStyles.thumbCircle,
              {
                backgroundColor: colors.primary,
                borderColor: colors.white,
              },
            ]}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[singleStyles.container, { height: CONTAINER_H }]}>
      <View
        style={[singleStyles.trackRow, { top: TRACK_CENTER - TRACK_HEIGHT / 2 }]}
        pointerEvents="none"
      >
        <View style={[singleStyles.trackSegment, { backgroundColor: colors.primary }]} />
        <View style={[singleStyles.trackSegment, { backgroundColor: colors.gray200 }]} />
      </View>

      <View
        style={[
          singleStyles.indicatorWrapper,
          { top: TRIANGLE_TOP, left: '50%', marginLeft: -(THUMB_SIZE / 2) },
        ]}
        pointerEvents="none"
      >
        <View
          style={[
            singleStyles.triangle,
            { borderBottomColor: colors.primary, marginBottom: TRIANGLE_GAP },
          ]}
        />
        <View
          style={[
            singleStyles.thumbGlow,
            { backgroundColor: `${colors.primary}50` },
          ]}
        />
        <View
          style={[
            singleStyles.thumbCircle,
            {
              backgroundColor: colors.primary,
              borderColor: colors.white,
            },
          ]}
        />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEnabled={allowManualScroll}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleMomentumEnd}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        contentContainerStyle={{ paddingHorizontal: HALF_WIDTH }}
        style={[singleStyles.scrollView, { top: RULER_TOP }]}
      >
        {data.map((val, index) => {
          const isMajor = index % majorTickInterval === 0;
          return (
            <View key={index} style={[singleStyles.tickContainer, { width: itemWidth }]}>
              {showTicks && (
                <View
                  style={[
                    singleStyles.tick,
                    isMajor ? singleStyles.tickMajor : singleStyles.tickMinor,
                    { backgroundColor: colors.gray300 },
                  ]}
                />
              )}
              {isMajor && renderLabel && (
                <View style={singleStyles.labelContainer}>
                  <Text
                    style={[
                      singleStyles.label,
                      {
                        fontFamily: fontFamily.regular,
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {renderLabel(val)}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const RANGE_PADDING = 24;
const RANGE_TRACK_WIDTH = SCREEN_WIDTH - RANGE_PADDING * 2;
const MIN_DISTANCE = 2;

const RangeRulerPicker = ({
  min = 10,
  max = 60,
  minValue = 30,
  maxValue = 50,
  onValuesChange,
  showTicks = true,
  showScale = true,
  unit = '',
  fixedScaleLabels,
  isRange = true,
  value,
  onValueChange,
  onValuesChangeStart,
  onValuesChangeFinish,
}) => {
  const { colors } = useTheme();

  const RANGE = max - min;
  const PIXELS_PER_UNIT = RANGE_TRACK_WIDTH / RANGE;

  const initialLeft = isRange ? Math.max(min, Math.min(minValue, maxValue - MIN_DISTANCE)) : min;
  const initialRight = isRange ? Math.min(max, Math.max(maxValue, minValue + MIN_DISTANCE)) : Math.max(min, Math.min(max, value !== undefined ? value : maxValue));

  const [leftVal, setLeftVal] = useState(initialLeft);
  const [rightVal, setRightVal] = useState(initialRight);

  const leftX = useRef(new Animated.Value((initialLeft - min) * PIXELS_PER_UNIT)).current;
  const rightX = useRef(new Animated.Value((initialRight - min) * PIXELS_PER_UNIT)).current;

  const currentLeft = useRef(initialLeft);
  const currentRight = useRef(initialRight);

  const dragStartLeftX = useRef(0);
  const dragStartRightX = useRef(0);

  // Sync from props when they change externally
  useEffect(() => {
    if (isRange) {
      if (currentLeft.current !== minValue || currentRight.current !== maxValue) {
        const l = Math.max(min, Math.min(minValue, maxValue - MIN_DISTANCE));
        const r = Math.min(max, Math.max(maxValue, minValue + MIN_DISTANCE));
        currentLeft.current = l;
        currentRight.current = r;
        setLeftVal(l);
        setRightVal(r);
        leftX.setValue((l - min) * PIXELS_PER_UNIT);
        rightX.setValue((r - min) * PIXELS_PER_UNIT);
      }
    } else {
      if (value !== undefined && currentRight.current !== value) {
        const r = Math.max(min, Math.min(max, value));
        currentRight.current = r;
        setRightVal(r);
        rightX.setValue((r - min) * PIXELS_PER_UNIT);
      }
    }
  }, [minValue, maxValue, value, min, max, PIXELS_PER_UNIT, leftX, rightX, isRange]);

  // ── Scrollable ruler setup (must be before PanResponders) ──
  const ITEM_WIDTH = 12;
  const MAJOR_TICK_INTERVAL = 10;
  const LABEL_INTERVAL = 10;
  const rulerSteps = RANGE;
  const rulerData = useMemo(() =>
    Array.from({ length: rulerSteps + 1 }, (_, i) => min + i),
    [rulerSteps, min],
  );

  const rulerScrollRef = useRef(null);
  const pendingRulerScroll = useRef(null);

  // Compute the ruler scroll offset so that the ruler label for value v
  // appears directly under the thumb sitting at (v - min) * PIXELS_PER_UNIT.
  // Ruler label position in content = (v - min) * ITEM_WIDTH.
  // Thumb screen position in track  = (v - min) * PIXELS_PER_UNIT.
  // scrollOffset = rulerContentPos - thumbScreenPos
  //             = (v - min) * (ITEM_WIDTH - PIXELS_PER_UNIT)
  const getRulerOffsetForValue = useCallback((v) => {
    const offset = (v - min) * (ITEM_WIDTH - PIXELS_PER_UNIT);
    const maxOffset = (RANGE * ITEM_WIDTH) - RANGE_TRACK_WIDTH;
    return Math.max(0, Math.min(offset, maxOffset));
  }, [min, PIXELS_PER_UNIT, RANGE]);

  // Center ruler between two values (used on mount and idle)
  const getRulerCenterOffset = useCallback((lVal, rVal) => {
    const centerVal = (lVal + rVal) / 2;
    return getRulerOffsetForValue(centerVal);
  }, [getRulerOffsetForValue]);

  // Sync ruler scroll to a specific thumb value during drag (deferred via rAF)
  const syncRulerToValue = useCallback((activeVal) => {
    if (pendingRulerScroll.current) {
      cancelAnimationFrame(pendingRulerScroll.current);
    }
    const offset = getRulerOffsetForValue(activeVal);
    pendingRulerScroll.current = requestAnimationFrame(() => {
      pendingRulerScroll.current = null;
      rulerScrollRef.current?.scrollTo({ x: offset, animated: false });
    });
  }, [getRulerOffsetForValue]);

  // Scroll ruler to center of range on mount
  useEffect(() => {
    const offset = getRulerCenterOffset(currentLeft.current, currentRight.current);
    setTimeout(() => {
      rulerScrollRef.current?.scrollTo({ x: offset, animated: false });
    }, 150);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup pending animation frame on unmount
  useEffect(() => {
    return () => {
      if (pendingRulerScroll.current) cancelAnimationFrame(pendingRulerScroll.current);
    };
  }, []);

  const leftPanResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        dragStartLeftX.current = (currentLeft.current - min) * PIXELS_PER_UNIT;
        if (onValuesChangeStart) onValuesChangeStart();
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = dragStartLeftX.current + gestureState.dx;
        const maxLeftX = (currentRight.current - min - MIN_DISTANCE) * PIXELS_PER_UNIT;
        if (newX < 0) newX = 0;
        if (newX > maxLeftX) newX = maxLeftX;
        leftX.setValue(newX);

        const newVal = Math.round((newX / PIXELS_PER_UNIT) + min);
        if (newVal !== currentLeft.current) {
          currentLeft.current = newVal;
          setLeftVal(newVal);
          syncRulerToValue(newVal);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        let newX = dragStartLeftX.current + gestureState.dx;
        const maxLeftX = (currentRight.current - min - MIN_DISTANCE) * PIXELS_PER_UNIT;
        if (newX < 0) newX = 0;
        if (newX > maxLeftX) newX = maxLeftX;
        const newVal = Math.round((newX / PIXELS_PER_UNIT) + min);
        currentLeft.current = newVal;
        setLeftVal(newVal);
        Animated.spring(leftX, {
          toValue: (newVal - min) * PIXELS_PER_UNIT,
          useNativeDriver: false,
          friction: 7,
        }).start();
        if (onValuesChange) {
          onValuesChange(newVal, currentRight.current);
        }
        const offset = getRulerOffsetForValue(newVal);
        rulerScrollRef.current?.scrollTo({ x: offset, animated: true });
      },
      onPanResponderTerminate: () => {
        const val = currentLeft.current;
        Animated.spring(leftX, {
          toValue: (val - min) * PIXELS_PER_UNIT,
          useNativeDriver: false,
          friction: 7,
        }).start();
        if (onValuesChange) {
          onValuesChange(val, currentRight.current);
        }
        if (onValuesChangeFinish) onValuesChangeFinish();
      },
    }),
    [min, PIXELS_PER_UNIT, leftX, onValuesChange, syncRulerToValue, getRulerOffsetForValue],
  );

  const rightPanResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        dragStartRightX.current = (currentRight.current - min) * PIXELS_PER_UNIT;
        if (onValuesChangeStart) onValuesChangeStart();
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = dragStartRightX.current + gestureState.dx;
        const minRightX = isRange ? (currentLeft.current - min + MIN_DISTANCE) * PIXELS_PER_UNIT : 0;
        const maxRightX = RANGE * PIXELS_PER_UNIT;
        if (newX < minRightX) newX = minRightX;
        if (newX > maxRightX) newX = maxRightX;
        rightX.setValue(newX);

        const newVal = Math.round((newX / PIXELS_PER_UNIT) + min);
        if (newVal !== currentRight.current) {
          currentRight.current = newVal;
          setRightVal(newVal);
          syncRulerToValue(newVal);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        let newX = dragStartRightX.current + gestureState.dx;
        const minRightX = isRange ? (currentLeft.current - min + MIN_DISTANCE) * PIXELS_PER_UNIT : 0;
        const maxRightX = RANGE * PIXELS_PER_UNIT;
        if (newX < minRightX) newX = minRightX;
        if (newX > maxRightX) newX = maxRightX;
        const newVal = Math.round((newX / PIXELS_PER_UNIT) + min);
        currentRight.current = newVal;
        setRightVal(newVal);
        Animated.spring(rightX, {
          toValue: (newVal - min) * PIXELS_PER_UNIT,
          useNativeDriver: false,
          friction: 7,
        }).start();
        if (!isRange && onValueChange) {
          onValueChange(newVal);
        } else if (isRange && onValuesChange) {
          onValuesChange(currentLeft.current, newVal);
        }
        const offset = getRulerOffsetForValue(newVal);
        rulerScrollRef.current?.scrollTo({ x: offset, animated: true });
      },
      onPanResponderTerminate: () => {
        const val = currentRight.current;
        Animated.spring(rightX, {
          toValue: (val - min) * PIXELS_PER_UNIT,
          useNativeDriver: false,
          friction: 7,
        }).start();
        if (!isRange && onValueChange) {
          onValueChange(val);
        } else if (isRange && onValuesChange) {
          onValuesChange(currentLeft.current, val);
        }
        if (onValuesChangeFinish) onValuesChangeFinish();
      },
    }),
    [min, RANGE, PIXELS_PER_UNIT, rightX, onValuesChange, onValueChange, syncRulerToValue, getRulerOffsetForValue, isRange, onValuesChangeStart, onValuesChangeFinish],
  );

  return (
    <View style={rangeStyles.container}>
      <View style={[rangeStyles.trackOuter, { width: RANGE_TRACK_WIDTH }]}>
        <View style={[rangeStyles.trackContainer, { width: RANGE_TRACK_WIDTH }]}>
          <View style={rangeStyles.trackBackground} />
          <Animated.View
            style={[
              rangeStyles.trackActive,
              {
                backgroundColor: colors.primary,
                left: leftX,
                width: Animated.subtract(rightX, leftX),
              },
            ]}
          />

          {/* Left thumb */}
          {isRange && (
            <Animated.View
              style={[rangeStyles.thumbWrapper, { transform: [{ translateX: leftX }] }]}
              {...leftPanResponder.panHandlers}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              {/* Label row: "30 y" */}
              <View style={rangeStyles.thumbLabelContainer}>
                <AppText variant="bodySmall" style={[rangeStyles.thumbLabel, { color: colors.primary }]}>
                  {leftVal}{unit ? ' ' : ''}<AppText style={[rangeStyles.thumbLabelUnit, { color: colors.primary }]}>{unit}</AppText>
                </AppText>
              </View>
              {/* Triangle pointer */}
              <View style={[rangeStyles.pointer, { borderBottomColor: colors.primary }]} />
              {/* Circle (glow + filled circle) */}
              <View style={rangeStyles.thumbCenter}>
                <View style={[rangeStyles.glow, { backgroundColor: `${colors.primary}40` }]} />
                <View style={[rangeStyles.thumb, { backgroundColor: colors.primary, borderColor: colors.white }]} />
              </View>
            </Animated.View>
          )}

          {/* Right thumb */}
          <Animated.View
            style={[rangeStyles.thumbWrapper, { transform: [{ translateX: rightX }] }]}
            {...rightPanResponder.panHandlers}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            {/* Label row: "50 y" */}
            <View style={rangeStyles.thumbLabelContainer}>
              <AppText variant="bodySmall" style={[rangeStyles.thumbLabel, { color: colors.primary }]}>
                {rightVal}{unit ? ' ' : ''}<AppText style={[rangeStyles.thumbLabelUnit, { color: colors.primary }]}>{unit}</AppText>
              </AppText>
            </View>
            {/* Triangle pointer */}
            <View style={[rangeStyles.pointer, { borderBottomColor: colors.primary }]} />
            {/* Circle (glow + filled circle) */}
            <View style={rangeStyles.thumbCenter}>
              <View style={[rangeStyles.glow, { backgroundColor: `${colors.primary}40` }]} />
              <View style={[rangeStyles.thumb, { backgroundColor: colors.primary, borderColor: colors.white }]} />
            </View>
          </Animated.View>
        </View>

        {/* Scrollable ruler — full range from min to max */}
        {showScale && fixedScaleLabels ? (
          <View style={[rangeStyles.scaleContainer, { width: RANGE_TRACK_WIDTH }]} pointerEvents="none">
            {fixedScaleLabels.map((item, index) => (
              <Text key={index} style={[rangeStyles.scaleLabel, { fontFamily: fontFamily.regular, color: colors.textSecondary }]}>
                {item.label}
              </Text>
            ))}
          </View>
        ) : showScale && (
          <View style={[rangeStyles.rulerContainer, !showTicks && { marginTop: -15 }]} pointerEvents="none">
            <ScrollView
              ref={rulerScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              scrollEnabled={false}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
            >
              {rulerData.map((val, index) => {
                const isMajor = index % MAJOR_TICK_INTERVAL === 0;
                const isHalfMajor = (val - min) % MAJOR_TICK_INTERVAL === MAJOR_TICK_INTERVAL / 2;
                const isLargeTick = isMajor || isHalfMajor;
                const shouldRenderLabel = index % Math.max(1, LABEL_INTERVAL) === 0;
                return (
                  <View key={index} style={[singleStyles.tickContainer, { width: ITEM_WIDTH }, !showTicks && { height: 25 }]}>
                    {showTicks && (
                      <View
                        style={[
                          singleStyles.tick,
                          isLargeTick ? singleStyles.thumbModeTickLarge : singleStyles.thumbModeTickMinor,
                          isLargeTick ? singleStyles.thumbModeTickMajorColor : singleStyles.thumbModeTickMinorColor,
                        ]}
                      />
                    )}
                    {shouldRenderLabel && (
                      <View style={[
                        singleStyles.labelContainer,
                        !showTicks && { bottom: 0 },
                        index === 0 && singleStyles.labelContainerFirst,
                        index === rulerSteps && singleStyles.labelContainerLast,
                      ]}>
                        <Text
                          style={[
                            singleStyles.label,
                            { fontFamily: fontFamily.regular },
                            singleStyles.thumbModeLabel,
                          ]}
                        >
                          {String(val)}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const RulerPicker = ({ mode = 'single', isRange = true, ...props }) => {
  if (mode === 'range') {
    return <RangeRulerPicker isRange={isRange} {...props} />;
  }
  return <SingleRulerPicker {...props} />;
};

export default memo(RulerPicker);

const singleStyles = StyleSheet.create({
  container: { width: '100%', position: 'relative', marginTop: 10 },
  thumbModeContainer: { height: THUMB_CONTAINER_H, marginTop: 18 },
  trackRow: { position: 'absolute', left: 0, right: 0, height: TRACK_HEIGHT, flexDirection: 'row', zIndex: 1 },
  trackBase: { ...StyleSheet.absoluteFillObject, height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2 },
  trackFill: { position: 'absolute', left: 0, top: 0, height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2 },
  thumbModeTrackFill: { position: 'absolute', left: 0, top: 0, height: 4, borderRadius: 2, zIndex: 1 },
  thumbModeTrackInactive: { position: 'absolute', top: 0, height: 4, borderRadius: 2, backgroundColor: '#D9D9D9', zIndex: 0 },
  trackSegment: { flex: 1, height: TRACK_HEIGHT },
  indicatorWrapper: { position: 'absolute', alignItems: 'center', zIndex: 10 },
  triangle: { width: 0, height: 0, borderStyle: 'solid', borderLeftWidth: TRIANGLE_W, borderRightWidth: TRIANGLE_W, borderBottomWidth: TRIANGLE_H, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  thumbGlow: { position: 'absolute', top: TRIANGLE_H + TRIANGLE_GAP - 3, width: THUMB_SIZE + 6, height: THUMB_SIZE + 6, borderRadius: (THUMB_SIZE + 6) / 2 },
  thumbCircle: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE / 2, borderWidth: THUMB_BORDER, elevation: 6, shadowColor: '#0B2EF3', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 6 },
  thumbValueLabel: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  floatingLabelWrapper: { position: 'absolute', width: 100, zIndex: 20, alignItems: 'center' },
  thumbValueNumber: { fontSize: 20, lineHeight: 24 },
  thumbValueUnit: { fontSize: 11, lineHeight: 17, marginLeft: 2, marginBottom: 1 },
  scrollView: { position: 'absolute', left: 0, right: 0 },
  fixedRuler: { position: 'absolute', left: 0, right: 0, height: 55 },
  fixedTickContainer: { position: 'absolute', width: 1, height: 55, alignItems: 'center' },
  tickContainer: { height: 55, alignItems: 'center' },
  tick: { width: 1.5, borderRadius: 1 },
  tickMajor: { height: 18, marginTop: 0 },
  tickMinor: { height: 10, marginTop: 4 },
  thumbModeTickLarge: { height: 13, marginTop: 0 },
  thumbModeTickMinor: { height: 8, marginTop: 3 },
  thumbModeTickMajorColor: { backgroundColor: '#e0dbdbff' },
  thumbModeTickMinorColor: { backgroundColor: '#dfdbdbff' },
  thumbModeLabel: { color: '#A6A6A6' },
  labelContainer: { position: 'absolute', bottom: 4, width: 50, alignItems: 'center' },
  labelContainerStart: { left: 0, width: 24, alignItems: 'flex-start' },
  labelContainerFirst: { left: 10, alignItems: 'flex-start' },
  labelContainerLast: { right: 15, alignItems: 'flex-end' },
  label: { fontSize: 13, fontWeight: '700' },
  scrollableRulerContainer: { position: 'absolute', left: 5, right: 5, height: 58 },
});

const rangeStyles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  trackOuter: { overflow: 'visible' },
  trackContainer: { height: 50, justifyContent: 'center', position: 'relative' },
  trackBackground: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: '#E5E7EB', borderRadius: 1.5 },
  trackActive: { position: 'absolute', height: 4, borderRadius: 2, zIndex: 1 },
  ticksWrapper: { position: 'relative', height: 46, marginTop: 12 },
  tickContainer: { position: 'absolute', alignItems: 'center', width: 20, marginLeft: -10 },
  tick: { width: 1.5, borderRadius: 1 },
  tickLabel: { marginTop: 4, fontSize: 10 },
  thumbWrapper: { position: 'absolute', left: -20, width: 40, height: 60, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  thumbLabelContainer: { position: 'absolute', top: -14, alignItems: 'center', width: 60 },
  thumbLabel: { fontWeight: '700', fontSize: 14 },
  thumbLabelUnit: { fontWeight: '500', fontSize: 12 },
  indicatorCore: { alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  pointer: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', zIndex: 20, marginBottom: -2 },
  thumbCenter: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 32, height: 32, borderRadius: 16 },
  thumb: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4, zIndex: 30 },
  scaleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  scaleLabel: { fontSize: 11 },
});