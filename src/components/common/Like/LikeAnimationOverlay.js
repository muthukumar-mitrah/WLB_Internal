import React, { useRef, useEffect, useState, memo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const LikeAnimationOverlay = ({ trigger, onAnimationFinish }) => {
  const lottieRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const [shouldRender, setShouldRender] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (trigger > 0) {
      // Clear any existing fade-out timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setShouldRender(true);
      fadeAnim.setValue(0.8);
      scaleAnim.setValue(0.3);

      // 1. Fade-in and scale-in spring bounce animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 30,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4, // Spring pop/bounce effect
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start(() => {
        lottieRef.current?.reset();
        lottieRef.current?.play(40, 116);

        // 2. Hold for 1.5 seconds, then trigger smooth 500ms fade-out
        timerRef.current = setTimeout(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 100, // Smooth fade-out over 0.5s
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.5,
              duration: 500, // Shrink slightly during fade-out
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShouldRender(false);
            if (onAnimationFinish) {
              onAnimationFinish();
            }
          });
        }, 1500); // 1.5 seconds hold time
      });
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [trigger, fadeAnim, scaleAnim, onAnimationFinish]);

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.absoluteContainer, { opacity: fadeAnim }]} pointerEvents="none">
      <View style={styles.dimOverlay} />
      <Animated.View style={[styles.overlayContainer, { transform: [{ scale: scaleAnim }] }]}>
        <LottieView
          ref={lottieRef}
          source={require('../Like/like.json')}
          autoPlay={false}
          loop={false}
          style={styles.lottieOverlay}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dimOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  overlayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieOverlay: {
    width: 280,
    height: 280,
  },
});

export default memo(LikeAnimationOverlay);
