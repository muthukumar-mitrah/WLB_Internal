import React, { useRef, useCallback, useEffect, useState, useMemo, useImperativeHandle, forwardRef, memo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, Animated, PanResponder } from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily } from '../../theme/fonts';
import { AppText } from '../common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HALF_WIDTH = SCREEN_WIDTH / 2;

// ─── Layout constants ─────────────────────────────────────────────────────────
const THUMB_SIZE = 28;   // diameter of the big circle
const THUMB_BORDER = 4;    // white border ring width
const TRIANGLE_W = 10;    // half-base of the triangle
const TRIANGLE_H = 12;   // height of the triangle
const TRIANGLE_GAP = 2;    // gap between triangle and circle
const TRACK_HEIGHT = 3;

// vertical positions (from top of component):
const TRIANGLE_TOP = 0;
const CIRCLE_TOP = TRIANGLE_TOP + TRIANGLE_H + TRIANGLE_GAP;
const TRACK_CENTER = CIRCLE_TOP + THUMB_SIZE / 2;   // center of circle = center of track
const RULER_TOP = CIRCLE_TOP + THUMB_SIZE + 8;   // ticks start below circle
const CONTAINER_H = RULER_TOP + 65;                // ticks (20) + labels (20) + padding

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

// ==========================================
// SINGLE RULER PICKER (Scrollable)
// ==========================================
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
}) => {
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const isUserScrolling = useRef(false);
  const isDraggingThumb = useRef(false);
  const currentValue = useRef(value);
  const dragStartX = useRef(0);
  const valueLabelRef = useRef(null);
  const trackWidthRef = useRef(0);
  const thumbX = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  const steps = Math.round((max - min) / step);
  const data = Array.from({ length: steps + 1 }, (_, i) => {
    const val = min + i * step;
    return Math.round(val * 1000) / 1000;
  });

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

  useEffect(() => {
    const index = Math.round((value - min) / step);
    const clampedIndex = clampIndex(index);
    if (interaction === 'thumb') {
      if (isDraggingThumb.current) {
        return;
      }
      currentValue.current = data[clampedIndex];
      setThumbValue(data[clampedIndex]);
    } else if (scrollRef.current) {
      currentValue.current = data[clampedIndex];
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: clampedIndex * itemWidth, animated: false });
      }, 150);
    }
  }, [clampIndex, data, interaction, itemWidth, min, setThumbValue, step, value]);

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

  const thumbPanResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => interaction === 'thumb',
      onMoveShouldSetPanResponder: () => interaction === 'thumb',
      onPanResponderGrant: () => {
        isDraggingThumb.current = true;
        dragStartX.current = getXFromValue(currentValue.current);
      },
      onPanResponderMove: (_, gestureState) => {
        const width = trackWidthRef.current || trackWidth || RANGE_TRACK_WIDTH;
        const nextX = Math.max(0, Math.min(dragStartX.current + gestureState.dx, width));
        const newValue = getValueFromX(nextX);

        thumbX.setValue(nextX);
        if (newValue !== currentValue.current) {
          currentValue.current = newValue;
          updateValueLabel(newValue);
        }
      },
      onPanResponderRelease: () => {
        isDraggingThumb.current = false;
        setThumbValue(currentValue.current, true);
        onValueChange(currentValue.current);
      },
      onPanResponderTerminate: () => {
        isDraggingThumb.current = false;
        setThumbValue(currentValue.current, true);
        onValueChange(currentValue.current);
      },
    }),
    [getValueFromX, getXFromValue, interaction, onValueChange, setThumbValue, thumbX, trackWidth, updateValueLabel],
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
                <View
                  style={[
                    singleStyles.tick,
                    isLargeTick ? singleStyles.thumbModeTickLarge : singleStyles.thumbModeTickMinor,
                    isLargeTick ? singleStyles.thumbModeTickMajorColor : singleStyles.thumbModeTickMinorColor,
                  ]}
                />
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
          {showValueLabel && (
            <ThumbValueLabel
              ref={valueLabelRef}
              value={currentValue.current}
              valueUnit={valueUnit}
              color={colors.primary}
            />
          )}
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
              <View
                style={[
                  singleStyles.tick,
                  isMajor ? singleStyles.tickMajor : singleStyles.tickMinor,
                  { backgroundColor: colors.gray300 },
                ]}
              />
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

// ==========================================
// RANGE RULER PICKER (Fixed Track, 2 Thumbs)
// ==========================================

const RANGE_PADDING = 24;
const RANGE_TRACK_WIDTH = SCREEN_WIDTH - RANGE_PADDING * 2;
const MIN_DISTANCE = 2; // minimum difference between left and right

const RangeRulerPicker = ({
  min = 10,
  max = 60,
  minValue = 30,
  maxValue = 50,
  onValuesChange,
}) => {
  const { colors } = useTheme();

  const RANGE = max - min;
  const PIXELS_PER_UNIT = RANGE_TRACK_WIDTH / RANGE;
  const R_THUMB_SIZE = 22;
  const R_GLOW_SIZE = 36;

  const initialLeft = Math.max(min, Math.min(minValue, maxValue - MIN_DISTANCE));
  const initialRight = Math.min(max, Math.max(maxValue, minValue + MIN_DISTANCE));

  const [leftVal, setLeftVal] = useState(initialLeft);
  const [rightVal, setRightVal] = useState(initialRight);

  const leftX = useRef(new Animated.Value((initialLeft - min) * PIXELS_PER_UNIT)).current;
  const rightX = useRef(new Animated.Value((initialRight - min) * PIXELS_PER_UNIT)).current;

  const currentLeft = useRef(initialLeft);
  const currentRight = useRef(initialRight);

  const updateValues = (l, r) => {
    currentLeft.current = l;
    currentRight.current = r;
    setLeftVal(l);
    setRightVal(r);
    if (onValuesChange) {
      onValuesChange(l, r);
    }
  };

  const leftPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = ((currentLeft.current - min) * PIXELS_PER_UNIT) + gestureState.dx;
        const maxLeftX = (currentRight.current - min - MIN_DISTANCE) * PIXELS_PER_UNIT;
        if (newX < 0) newX = 0;
        if (newX > maxLeftX) newX = maxLeftX;
        leftX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        let newX = ((currentLeft.current - min) * PIXELS_PER_UNIT) + gestureState.dx;
        const maxLeftX = (currentRight.current - min - MIN_DISTANCE) * PIXELS_PER_UNIT;
        if (newX < 0) newX = 0;
        if (newX > maxLeftX) newX = maxLeftX;
        const newVal = Math.round((newX / PIXELS_PER_UNIT) + min);
        updateValues(newVal, currentRight.current);
        Animated.spring(leftX, {
          toValue: (newVal - min) * PIXELS_PER_UNIT,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const rightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = ((currentRight.current - min) * PIXELS_PER_UNIT) + gestureState.dx;
        const minRightX = (currentLeft.current - min + MIN_DISTANCE) * PIXELS_PER_UNIT;
        if (newX < minRightX) newX = minRightX;
        if (newX > RANGE_TRACK_WIDTH) newX = RANGE_TRACK_WIDTH;
        rightX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        let newX = ((currentRight.current - min) * PIXELS_PER_UNIT) + gestureState.dx;
        const minRightX = (currentLeft.current - min + MIN_DISTANCE) * PIXELS_PER_UNIT;
        if (newX < minRightX) newX = minRightX;
        if (newX > RANGE_TRACK_WIDTH) newX = RANGE_TRACK_WIDTH;
        const newVal = Math.round((newX / PIXELS_PER_UNIT) + min);
        updateValues(currentLeft.current, newVal);
        Animated.spring(rightX, {
          toValue: (newVal - min) * PIXELS_PER_UNIT,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const ticks = Array.from({ length: RANGE + 1 }).map((_, i) => {
    const val = min + i;
    const isMajor = val % 10 === 0;
    const isMid = val % 5 === 0 && !isMajor;
    return (
      <View key={i} style={[rangeStyles.tickContainer, { left: i * PIXELS_PER_UNIT }]}>
        <View
          style={[
            rangeStyles.tick,
            {
              top: 18,
              height: isMajor ? 16 : isMid ? 14 : 10,
              backgroundColor: isMajor ? '#D1D5DB' : '#E5E7EB',
            },
          ]}
        />
        {isMajor && (
          <AppText variant="bodySmall" color={colors.textSecondary} style={rangeStyles.tickLabel}>
            {val}
          </AppText>
        )}
      </View>
    );
  });

  return (
    <View style={rangeStyles.container}>
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
        <View style={rangeStyles.ticksWrapper}>{ticks}</View>

        <Animated.View
          style={[rangeStyles.thumbWrapper, { transform: [{ translateX: leftX }] }]}
          {...leftPanResponder.panHandlers}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <View style={rangeStyles.thumbLabelContainer}>
            <AppText variant="bodySmall" style={[rangeStyles.thumbLabel, { color: colors.primary }]}>
              {leftVal} <AppText style={[rangeStyles.thumbLabelUnit, { color: colors.primary }]}>y</AppText>
            </AppText>
          </View>
          <View style={rangeStyles.indicatorCore}>
            <View style={[rangeStyles.pointer, { borderBottomColor: colors.primary, bottom: 11 }]} />
            <View style={[rangeStyles.thumbCenter, { bottom: 10 }]}>
              <View style={[rangeStyles.glow, { backgroundColor: `${colors.primary}40` }]} />
              <View style={[rangeStyles.thumb, { backgroundColor: colors.primary, borderColor: colors.white }]} />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[rangeStyles.thumbWrapper, { transform: [{ translateX: rightX }] }]}
          {...rightPanResponder.panHandlers}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <View style={rangeStyles.thumbLabelContainer}>
            <AppText variant="bodySmall" style={[rangeStyles.thumbLabel, { color: colors.primary }]}>
              {rightVal} <AppText style={[rangeStyles.thumbLabelUnit, { color: colors.primary }]}>y</AppText>
            </AppText>
          </View>
          <View style={rangeStyles.indicatorCore}>
            <View style={[rangeStyles.pointer, { borderBottomColor: colors.primary, bottom: 11 }]} />
            <View style={[rangeStyles.thumbCenter, { bottom: 10 }]}>
              <View style={[rangeStyles.glow, { backgroundColor: `${colors.primary}40` }]} />
              <View style={[rangeStyles.thumb, { backgroundColor: colors.primary, borderColor: colors.white }]} />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

// ==========================================
// EXPORTED COMPONENT
// ==========================================
const RulerPicker = ({ mode = 'single', ...props }) => {
  if (mode === 'range') {
    return <RangeRulerPicker {...props} />;
  }
  return <SingleRulerPicker {...props} />;
};

export default memo(RulerPicker);

// ==========================================
// STYLES
// ==========================================

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
  thumbValueLabel: { position: 'absolute', top: -THUMB_TRIANGLE_TOP + THUMB_LABEL_TOP, width: 74, marginLeft: -(74 - THUMB_SIZE) / 2, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
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
  thumbModeTickMajorColor: { backgroundColor: '#DADADA' },
  thumbModeTickMinorColor: { backgroundColor: '#ECECEC' },
  thumbModeLabel: { color: '#A6A6A6' },
  labelContainer: { position: 'absolute', bottom: 4, width: 50, alignItems: 'center' },
  labelContainerStart: { left: 0, width: 24, alignItems: 'flex-start' },
  label: { fontSize: 13, fontWeight: '700' },
});

const rangeStyles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', paddingVertical: 40 },
  trackContainer: { height: 40, justifyContent: 'center', position: 'relative' },
  trackBackground: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: '#E5E7EB', borderRadius: 1.5 },
  trackActive: { position: 'absolute', height: 4, borderRadius: 2, zIndex: 1 },
  ticksWrapper: { position: 'absolute', top: 20, left: 0, right: 0, height: 30 },
  tickContainer: { position: 'absolute', alignItems: 'center', width: 20, marginLeft: -10 },
  tick: { width: 1.5, borderRadius: 1 },
  tickLabel: { marginTop: 15, fontSize: 10 },
  thumbWrapper: { position: 'absolute', left: -20, width: 40, height: 60, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  thumbLabelContainer: { position: 'absolute', top: -14, alignItems: 'center', width: 60 },
  thumbLabel: { fontWeight: '700', fontSize: 14 },
  thumbLabelUnit: { fontWeight: '500', fontSize: 12 },
  indicatorCore: { alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  pointer: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', zIndex: 20, marginBottom: -2 },
  thumbCenter: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 32, height: 32, borderRadius: 16 },
  thumb: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4, zIndex: 30 },
});
