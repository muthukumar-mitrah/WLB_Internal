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
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';

// ─── Layout constants ─────────────────────────────────────────────────────────
const CIRCLE = 22;   // thumb diameter
const C_BORDER = 3;    // white border ring width
const C_GLOW = 8;    // extra radius of the semi-transparent glow layer
const TRI_W = 7;    // half-height of the left-pointing triangle
const TRI_H = 9;    // horizontal depth of the left-pointing triangle
const TRI_GAP = 4;    // horizontal gap between triangle tip → circle left edge
const LINE_W = 2;    // vertical line stroke width
const TICK_COUNT = 30;     // total number of guide lines
const TICK_SMALL_W = 7;      // minor tick width (extends right of line)
const TICK_LARGE_W = 14;     // major tick width (every 5th tick)
const TICK_H = 1;      // thickness of each tick in px
// BAR_W = circle-center + line half-width + largest tick + padding
const BAR_W = CIRCLE / 2 + LINE_W / 2 + TICK_LARGE_W + 6;

const SurveyVerticalBar = memo(({ selectedIndex, itemCount, rowHeight, rowGap }) => {
  const { colors } = useTheme();

  /* vertical centre of each option row inside the wrapper */
  const centers = Array.from({ length: itemCount }, (_, i) =>
    i * (rowHeight + rowGap) + rowHeight / 2,
  );

  const firstCenter = centers[0];
  const lastCenter = centers[itemCount - 1];
  const selCenter = centers[Math.max(0, Math.min(selectedIndex, itemCount - 1))];

  const circleR = CIRCLE / 2;
  const totalH = itemCount * rowHeight + (itemCount - 1) * rowGap;
  const lineX = CIRCLE / 2; // line centre aligns with circle centre; ticks go right

  /* evenly spaced tick Y positions across the full bar height */
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) =>
    (i / (TICK_COUNT - 1)) * totalH,
  );

  return (
    <View style={[styles.wrapper, { height: totalH, width: BAR_W }]}>

      {/* ── Background ruler lines — right of vertical line, 4 small then 1 large ── */}
      {ticks.map((y, i) => {
        const isMajor = (i + 1) % 5 === 0;   // every 5th tick is the large one
        const tickW = isMajor ? TICK_LARGE_W : TICK_SMALL_W;
        return (
          <View
            key={`tick-${i}`}
            style={[
              styles.tick,
              {
                top: y - TICK_H / 2,
                left: lineX + LINE_W / 2,  // starts at right edge of vertical line
                width: tickW,
                marginLeft: 15
              },
            ]}
          />
        );
      })}

      {/* ── Vertical line: spans full height (top of first option → bottom of last) ── */}
      <View
        style={[
          styles.line,
          {
            left: lineX - LINE_W / 2,
            top: 0,
            height: totalH,
            backgroundColor: colors.primary,
          },
        ]}
      />

      {/* ── Thumb: ◄ triangle (left) + glow + circle ── */}
      {/*
       * thumbOuter is positioned so the circle centre aligns with selCenter.
       * flexDirection:'row' places the triangle to the LEFT of the circle.
       * It extends to the left of the wrapper boundary (overflow:visible).
       */}
      <View
        style={[
          styles.thumbOuter,
          {
            // Vertically: circle centre = selCenter
            top: selCenter - CIRCLE / 2,
            // Horizontally: circle left edge aligned to lineX
            left: lineX - CIRCLE / 2 - TRI_H - TRI_GAP,
          },
        ]}
      >
        {/* Left-pointing triangle ◄ */}
        <View
          style={[
            styles.triangle,
            { borderRightColor: colors.primary },
          ]}
        />

        {/* Glow halo behind circle (absolute, centred on circle) */}
        <View
          style={[
            styles.glow,
            { backgroundColor: `${colors.primary}45` },
          ]}
        />

        {/* Filled circle with white border ring */}
        <View
          style={[
            styles.circle,
            {
              backgroundColor: colors.primary,
              borderColor: colors.white,
              shadowColor: colors.primary,
            },
          ]}
        />
      </View>
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
    // width is set inline (TICK_SMALL_W or TICK_LARGE_W)
    height: TICK_H,
    borderRadius: TICK_H / 2,
    backgroundColor: '#BCC5D6',
    zIndex: 1,
  },

  // Thumb container — row layout: ◄ triangle on left, circle on right
  thumbOuter: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
    overflow: 'visible',
  },

  // Left-pointing triangle ◄  (borderRight = the visible face, pointing left)
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: TRI_W,
    borderBottomWidth: TRI_W,
    borderRightWidth: TRI_H,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    // borderRightColor set inline (colours from theme)
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
