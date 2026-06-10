import React, { memo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '../../../theme';
import { AppText } from '../../../components/common';
import { SCREEN_WIDTH } from './styles';

const RADIUS = SCREEN_WIDTH * 0.42;

const TRACK_WIDTH = 10;
const TOTAL_TICKS = 72;

const THUMB_SIZE = 26;
const GLOW_SIZE = 28;

const SurveySemiCircleSlider = ({
  options,
  selectedIndex,
  onSelect,
}) => {
  const { colors } = useTheme();

  const getAngleForIndex = (index) => {
    if (index === 0) return -42;
    if (index === 1) return 0;
    if (index === 2) return 42;

    return 0;
  };

  const animatedAngle = useRef(
    new Animated.Value(getAngleForIndex(selectedIndex)),
  ).current;

  useEffect(() => {
    Animated.spring(animatedAngle, {
      toValue: getAngleForIndex(selectedIndex),
      useNativeDriver: true,
      friction: 7,
      tension: 70,
    }).start();
  }, [selectedIndex]);

  const ticks = Array.from({ length: TOTAL_TICKS }).map((_, i) => {
    const angle = -90 + (180 / (TOTAL_TICKS - 1)) * i;

    const isMajor = i % 5 === 0;

    return (
      <View
        key={i}
        style={[
          styles.tick,
          {
            height: isMajor ? 10 : 6,
            backgroundColor: '#D7D7D7',

            transform: [
              { rotate: `${angle}deg` },
              { translateY: -(RADIUS - 18) },
            ],
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.semiCircle,
          {
            width: RADIUS * 2 + 60,
            height: 100,
          },
        ]}
      >
        <View
          style={[
            styles.circleCenter,
            {
              top: RADIUS + 25,
              left: RADIUS + 30,
            },
          ]}
        >
          <View
            style={[
              styles.arcTrack,
              {
                width: RADIUS * 2,
                height: RADIUS * 2,
                borderRadius: RADIUS,
                borderWidth: TRACK_WIDTH,
                borderColor: '#ECECEC',
                top: -RADIUS,
                left: -RADIUS,
              },
            ]}
          />
          {ticks}
          <Animated.View
            style={[
              styles.thumbWrapper,
              {
                transform: [
                  {
                    rotate: animatedAngle.interpolate({
                      inputRange: [-90, 90],
                      outputRange: ['-90deg', '90deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.thumbContainer,
                {
                  transform: [{ translateY: -RADIUS }],
                },
              ]}
            >
              <View
                style={[
                  styles.pointer,
                  {
                    borderBottomColor: colors.primary,
                  },
                ]}
              />

              <View
                style={[
                  styles.glow,
                  {
                    backgroundColor: `${colors.primary}25`,
                  },
                ]}
              />

              <View
                style={[
                  styles.thumb,
                  {
                    backgroundColor: colors.primary,
                    borderColor: '#DCE8FF',
                  },
                ]}
              />
            </View>
          </Animated.View>

          {options.map((opt, index) => {
            const isSelected = selectedIndex === index;

            const angleDeg = getAngleForIndex(index);

            const angleRad = angleDeg * (Math.PI / 180);

            const labelRadius = RADIUS + 55;

            const x = labelRadius * Math.sin(angleRad);

            const y = -labelRadius * Math.cos(angleRad);
            const rotateAngle = `${angleDeg}deg`;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.labelBtn,
                  {
                    left: x - 60,
                    top: y - 6,
                  },
                ]}
                onPress={() => onSelect(index)}
                hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
              >
                <AppText
                  variant="titleMedium"
                  color={
                    isSelected
                      ? colors.primary
                      : colors.textSecondary
                  }
                  style={[
                    {
                      transform: [
                        {
                          rotate: rotateAngle,
                        },
                      ],
                    },
                  ]}
                >
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    // marginTop: 5,
  },

  semiCircle: {
    overflow: 'visible',
    position: 'relative',
  },

  circleCenter: {
    position: 'absolute',
    width: 0,
    height: 0,
  },

  arcTrack: {
    position: 'absolute',
  },

  tick: {
    position: 'absolute',
    width: 2,
    borderRadius: 10,
    left: -1,
    bottom: 0,
  },

  thumbWrapper: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 100,
  },

  thumbContainer: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: THUMB_SIZE + 14,
    left: -(GLOW_SIZE / 2),
    top: -(THUMB_SIZE + 2),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 3,
    zIndex: 20,
  },

  glow: {
    position: 'absolute',
    bottom: 0,
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
  },

  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 30,
  },

  labelBtn: {
    position: 'absolute',
    minWidth: 120,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default memo(SurveySemiCircleSlider);