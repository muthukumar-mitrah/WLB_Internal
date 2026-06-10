/**
 * SliderPicker — horizontal scrollable ruler with a fixed center indicator.
 *
 * Design (matches Figma):
 *  - Fixed center indicator: small filled blue circle (dot) + vertical blue line.
 *  - User drags the ruler/scale to change the value (standard scroll behavior).
 *  - Container width is measured via onLayout so the center padding is always
 *    half the ACTUAL container width — this fixes value/position mismatch when
 *    the modal has horizontal padding.
 *  - onValueChange is only ever called from user-initiated gesture handlers, never
 *    from programmatic scrollTo calls (fixes the spurious auto-update bug).
 */
import React, {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily } from '../../theme/fonts';

// ─── Visual constants ──────────────────────────────────────────────────────────
const DOT_SIZE        = 10;
const LINE_WIDTH      = 2;
const MAJOR_TICK_H    = 28;
const MINOR_TICK_H    = 16;
const TICK_STROKE     = 1.5;
const LABEL_FONT_SIZE = 11;
const LABEL_TOP_GAP   = 6;

// Vertical rhythm
const DOT_TOP      = 6;                          // small guard: dot never touches the edge
const LINE_HEIGHT  = MAJOR_TICK_H + 8;
const TICKS_TOP    = DOT_TOP + DOT_SIZE + 6;
const COMPONENT_H  = TICKS_TOP + MAJOR_TICK_H + LABEL_TOP_GAP + LABEL_FONT_SIZE + 14;

// ─── Component ────────────────────────────────────────────────────────────────
const SliderPicker = ({
  min               = 0,
  max               = 100,
  step              = 1,
  value,
  onValueChange,
  renderLabel,
  itemWidth         = 10,
  majorTickInterval = 10,
}) => {
  const { colors } = useTheme();

  // Measure actual container width → use containerWidth/2 as the scroll padding.
  // This is the core fix for value/position mismatch: the modal's horizontal
  // padding makes the picker narrower than SCREEN_WIDTH, so hardcoding
  // SCREEN_WIDTH/2 as padding shifts every tick by the wrong amount.
  const [containerWidth, setContainerWidth] = useState(0);
  const halfWidth = containerWidth > 0 ? containerWidth / 2 : 0;

  // Stable, memoized data array
  const data = useMemo(() => {
    const totalSteps = Math.round((max - min) / step);
    return Array.from({ length: totalSteps + 1 }, (_, i) =>
      Math.round((min + i * step) * 1000) / 1000,
    );
  }, [min, max, step]);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const scrollRef        = useRef(null);
  const currentValue     = useRef(value);
  const lastIndex        = useRef(null);
  const isUserScrolling  = useRef(false);  // true only during a user-initiated drag
  const momentumStarted  = useRef(false);  // true if a momentum phase is in flight
  const isReady          = useRef(false);  // prevents the mount effect re-running

  // ── Helpers ────────────────────────────────────────────────────────────────
  const valueToScrollX = useCallback(
    (val) => {
      const index = Math.round((val - min) / step);
      return Math.max(0, Math.min(index, data.length - 1)) * itemWidth;
    },
    [min, step, data.length, itemWidth],
  );

  const snapToIndex = useCallback(
    (x, animated = true) => {
      const index       = Math.round(x / itemWidth);
      const clamped     = Math.max(0, Math.min(index, data.length - 1));
      const snappedX    = clamped * itemWidth;
      scrollRef.current?.scrollTo({ x: snappedX, animated });
      return { index: clamped, value: data[clamped], x: snappedX };
    },
    [data, itemWidth],
  );

  // ── Initialise scroll position ─────────────────────────────────────────────
  const handleContainerLayout = useCallback((e) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  // Fire once after the container has been measured and the ScrollView has
  // laid out its full content (hence the small delay).
  useEffect(() => {
    if (containerWidth === 0 || isReady.current) return;
    isReady.current = true;
    const targetX = valueToScrollX(value);
    const t = setTimeout(() => {
      // scrollTo with animated:false never triggers scroll events, so this
      // programmatic call cannot accidentally fire onValueChange.
      scrollRef.current?.scrollTo({ x: targetX, animated: false });
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  // ── Scroll event handlers ──────────────────────────────────────────────────

  /** Called when the user first puts their finger on the ruler. */
  const handleScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
    momentumStarted.current = false;
  }, []);

  /**
   * Called continuously while the user drags.
   * Guard: we only call onValueChange when isUserScrolling is true, so
   * programmatic scrollTo calls never reach this branch.
   */
  const handleScroll = useCallback(
    (e) => {
      if (!isUserScrolling.current) return;

      const x       = e.nativeEvent.contentOffset.x;
      const index   = Math.round(x / itemWidth);
      const clamped = Math.max(0, Math.min(index, data.length - 1));

      if (clamped !== lastIndex.current) {
        lastIndex.current = clamped;
        const newValue = data[clamped];
        if (newValue !== currentValue.current) {
          currentValue.current = newValue;
          onValueChange(newValue);
        }
      }
    },
    [data, itemWidth, onValueChange],
  );

  /**
   * Called when the user lifts their finger.
   * If a momentum phase follows (fast swipe), onMomentumScrollBegin will fire
   * right after and we defer final snapping to onMomentumScrollEnd.
   * If there is NO momentum (slow drag), we snap here and reset the flag.
   */
  const handleScrollEndDrag = useCallback(
    (e) => {
      if (momentumStarted.current) {
        // Fast swipe — let onMomentumScrollEnd handle the final snap.
        return;
      }

      // Slow drag — snap now and reset.
      isUserScrolling.current = false;
      const x = e.nativeEvent.contentOffset.x;
      const { value: snappedValue } = snapToIndex(x, true);

      if (snappedValue !== currentValue.current) {
        currentValue.current = snappedValue;
        onValueChange(snappedValue);
      }
    },
    [snapToIndex, onValueChange],
  );

  const handleMomentumScrollBegin = useCallback(() => {
    momentumStarted.current = true;
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (e) => {
      if (!isUserScrolling.current) {
        momentumStarted.current = false;
        return;
      }

      isUserScrolling.current = false;
      momentumStarted.current = false;

      const x = e.nativeEvent.contentOffset.x;
      const { value: snappedValue } = snapToIndex(x, true);

      if (snappedValue !== currentValue.current) {
        currentValue.current = snappedValue;
        onValueChange(snappedValue);
      }
    },
    [snapToIndex, onValueChange],
  );

  return (
    <View
      style={[styles.container, { height: COMPONENT_H }]}
      onLayout={handleContainerLayout}
    >
      <View
        style={[
          styles.indicatorWrapper,
          { top: DOT_TOP, left: '50%', marginLeft: -(DOT_SIZE / 2) },
        ]}
        pointerEvents="none"
      >
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <View
          style={[
            styles.line,
            { backgroundColor: colors.primary, height: LINE_HEIGHT },
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
        onScrollBeginDrag={handleScrollBeginDrag}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={
          halfWidth > 0
            ? { paddingHorizontal: halfWidth - itemWidth / 2 }
            : undefined
        }
        style={[styles.scrollView, { top: TICKS_TOP }]}
      >
        {data.map((val, index) => {
          const isMajor = index % majorTickInterval === 0;
          return (
            <View
              key={index}
              style={[styles.tickWrapper, { width: itemWidth }]}
            >
              <View
                style={[
                  styles.tick,
                  {
                    height:          isMajor ? MAJOR_TICK_H : MINOR_TICK_H,
                    marginTop:       isMajor ? 0 : (MAJOR_TICK_H - MINOR_TICK_H) / 2,
                    backgroundColor: colors.gray300,
                  },
                ]}
              />
              {isMajor && renderLabel && (
                <View style={styles.labelWrapper}>
                  <Text
                    style={[
                      styles.label,
                      {
                        fontFamily: fontFamily.regular,
                        color:      colors.textSecondary,
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    width:    '100%',
    position: 'relative',
  },

  // ── Center indicator ───────────────────────────────────────────────────────
  indicatorWrapper: {
    position:   'absolute',
    alignItems: 'center',
    zIndex:     10,
  },
  dot: {
    width:        DOT_SIZE,
    height:       DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  line: {
    width:        LINE_WIDTH,
    borderRadius: LINE_WIDTH / 2,
  },

  // ── Ruler ──────────────────────────────────────────────────────────────────
  scrollView: {
    position: 'absolute',
    left:     0,
    right:    0,
  },
  tickWrapper: {
    alignItems: 'center',
  },
  tick: {
    width:        TICK_STROKE,
    borderRadius: TICK_STROKE / 2,
  },
  labelWrapper: {
    marginTop:  LABEL_TOP_GAP,
    width:      50,
    alignItems: 'center',
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
  },
});

export default SliderPicker;
 