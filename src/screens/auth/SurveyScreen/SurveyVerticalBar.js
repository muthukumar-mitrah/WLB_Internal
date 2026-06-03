/**
 * SurveyVerticalBar
 * A vertical indicator used on survey screens with tap-selectable option rows.
 *
 * Renders:
 *  - A thin vertical line connecting the first → last option center
 *  - Small tick marks at each option's centre (to the right of the line)
 *  - A thumb indicator (▲ triangle + filled circle with white ring & glow)
 *    that animates to the selected option's centre
 *
 * The component's height automatically equals the total height of all option rows
 * so it can be placed directly alongside the options list with `alignItems: 'flex-start'`.
 *
 * Props:
 *  selectedIndex  {number}  0-based index of currently selected option
 *  itemCount      {number}  total number of options
 *  rowHeight      {number}  height of a single option row in px
 *  rowGap         {number}  vertical gap between rows in px
 */
import React, { memo, useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { useTheme } from '../../../theme';

// ─── Layout constants ─────────────────────────────────────────────────────────
const CIRCLE = 24;
const C_BORDER = 3;
const C_GLOW = 8;
const TRI_W = 7;
const TRI_H = 9;
const TRI_GAP = 4;
const LINE_W = 3;
const TICK_COUNT = 30;
const TICK_SMALL_W = 7;
const TICK_LARGE_W = 14;
const TICK_H = 1;
const BAR_W = CIRCLE / 2 + LINE_W / 2 + TICK_LARGE_W + 6;

const COLOR_SELECTED   = '#D1D5DB';
const COLOR_UNSELECTED = '#3890F4';
const TICK_COLOR       = '#BCC5D6';

const SurveyVerticalBar = memo(({ selectedIndex, itemCount, rowHeight, rowGap, onSelect }) => {
  const { colors } = useTheme();

  /* vertical centre of each option row */
  const centers = useMemo(
    () => Array.from({ length: itemCount }, (_, i) => i * (rowHeight + rowGap) + rowHeight / 2),
    [itemCount, rowHeight, rowGap],
  );

  const firstCenter = centers[0];
  const lastCenter = centers[itemCount - 1];
  const totalH = itemCount * rowHeight + (itemCount - 1) * rowGap;
  const lineX = CIRCLE / 2;

  const thumbY = useRef(new Animated.Value(centers[selectedIndex] ?? firstCenter)).current;
  const currentY = useRef(centers[selectedIndex] ?? firstCenter);
  const dragStartY = useRef(0);

  useEffect(() => {
    const target = centers[Math.max(0, Math.min(selectedIndex, itemCount - 1))];
    currentY.current = target;
    Animated.spring(thumbY, {
      toValue: target,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  // ─── Find nearest option ───────────────────────────────────────────────────
  const snapToNearest = (y) => {
    let best = 0;
    let bestDist = Math.abs(centers[0] - y);
    for (let i = 1; i < centers.length; i++) {
      const d = Math.abs(centers[i] - y);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  };

  // ─── PanResponder ─────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,

      onPanResponderGrant: () => {
        // Stop any running spring and record where we currently are
        thumbY.stopAnimation(val => {
          currentY.current = val;
          dragStartY.current = val;
        });
      },

      onPanResponderMove: (_, gs) => {
        const nextY = Math.max(firstCenter, Math.min(lastCenter, dragStartY.current + gs.dy));
        currentY.current = nextY;
        thumbY.setValue(nextY);       // direct set — no re-render, perfectly smooth
      },

      onPanResponderRelease: (_, gs) => {
        const finalY = Math.max(firstCenter, Math.min(lastCenter, dragStartY.current + gs.dy));
        const snappedIndex = snapToNearest(finalY);
        const snappedY = centers[snappedIndex];

        // Spring-snap to nearest option
        Animated.spring(thumbY, {
          toValue: snappedY,
          useNativeDriver: false,
          tension: 140,
          friction: 9,
        }).start();

        currentY.current = snappedY;
        if (onSelect) onSelect(snappedIndex);
      },

      onPanResponderTerminate: () => {
        // Snap back to wherever we last were
        const snappedIndex = snapToNearest(currentY.current);
        Animated.spring(thumbY, {
          toValue: centers[snappedIndex],
          useNativeDriver: false,
          tension: 140,
          friction: 9,
        }).start();
        if (onSelect) onSelect(snappedIndex);
      },
    }),
  ).current;

  // ─── Derived animated values for the two line segments ────────────────────
  const topLineH    = thumbY;   // blue segment: 0 → thumbY
  const bottomLineH = thumbY.interpolate({
    inputRange:  [firstCenter, lastCenter],
    outputRange: [totalH - firstCenter, totalH - lastCenter],
    extrapolate: 'clamp',
  });
  const bottomLineTop = thumbY; // gray segment starts at thumbY

  /* evenly spaced tick positions */
  const ticks = useMemo(
    () => Array.from({ length: TICK_COUNT }, (_, i) => (i / (TICK_COUNT - 1)) * totalH),
    [totalH],
  );

  return (
    <View style={[styles.wrapper, { height: totalH, width: BAR_W }]}>

      {/* ── Tick marks (ruler) ── */}
      {ticks.map((y, i) => {
        const isMajor = (i + 1) % 5 === 0;
        return (
          <View
            key={`tick-${i}`}
            style={[
              styles.tick,
              {
                top: y - TICK_H / 2,
                left: lineX + LINE_W / 2 + 15,
                width: isMajor ? TICK_LARGE_W : TICK_SMALL_W,
              },
            ]}
          />
        );
      })}

      {/* ── Blue segment: 0 → thumb ── */}
      <Animated.View
        style={[
          styles.line,
          {
            left:            lineX - LINE_W / 2,
            top:             0,
            height:          topLineH,
            backgroundColor: COLOR_SELECTED,
          },
        ]}
      />

      {/* ── Gray segment: thumb → bottom ── */}
      <Animated.View
        style={[
          styles.line,
          {
            left:            lineX - LINE_W / 2,
            top:             bottomLineTop,
            height:          bottomLineH,
            backgroundColor: COLOR_UNSELECTED,
          },
        ]}
      />

      {/* ── Draggable thumb (Animated.View for smooth transform) ── */}
      <Animated.View
        style={[
          styles.thumbOuter,
          {
            transform: [{ translateY: Animated.add(thumbY, new Animated.Value(-CIRCLE / 2)) }],
            left: lineX - CIRCLE / 2 - TRI_H - TRI_GAP,
          },
        ]}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        {...panResponder.panHandlers}
      >
        {/* Left-pointing triangle ◄ */}
        <View style={[styles.triangle, { borderRightColor: '#21548E' }]} />

        {/* Glow halo */}
        <View style={[styles.glow, { backgroundColor: `${COLOR_SELECTED}40` }]} />

        {/* Filled circle */}
        <View
          style={[
            styles.circle,
            {
              backgroundColor: '#21548E',
              borderColor: colors.white,
              shadowColor: '#21548E',
            },
          ]}
        />
      </Animated.View>
    </View>
  );
});

// ─── Static styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  line: {
    position: 'absolute',
    width: LINE_W,
    borderRadius: LINE_W / 2,
    zIndex: 5,
  },
  tick: {
    position: 'absolute',
    height: TICK_H,
    borderRadius: TICK_H / 2,
    backgroundColor: TICK_COLOR,
    zIndex: 1,
  },
  thumbOuter: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
    overflow: 'visible',
  },
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: TRI_W,
    borderBottomWidth: TRI_W,
    borderRightWidth: TRI_H,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginRight: TRI_GAP,
  },
  
  glow: {
    position: 'absolute',
    // In the row, circle starts at (TRI_H + TRI_GAP); glow is centred on circle
    left: TRI_H + TRI_GAP - C_GLOW / 2,
    top: -(C_GLOW / 2),
    width: CIRCLE + C_GLOW,
    height: CIRCLE + C_GLOW,
    borderRadius: (CIRCLE + C_GLOW) / 2,
  },

  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: C_BORDER,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
});

export default SurveyVerticalBar;
