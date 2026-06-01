/**
 * Toast/Snackbar — lightweight in-app notification
 * Usage: ToastService.show({ type, message, duration })
 */
import React, {memo, useEffect, useRef, useState, useCallback} from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../theme';
import AppText from './AppText';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Singleton event emitter for imperative usage
let _showFn = null;

export const ToastService = {
  show: opts => {
    if (_showFn) _showFn(opts);
  },
};

const Toast = () => {
  const {colors, borderRadius, spacing, shadows} = useTheme();
  const [config, setConfig] = useState(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {toValue: -120, duration: 250, useNativeDriver: true}),
      Animated.timing(opacity, {toValue: 0, duration: 250, useNativeDriver: true}),
    ]).start(() => setConfig(null));
  }, [translateY, opacity]);

  const show = useCallback(
    ({type = 'info', message = '', duration = 3000}) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setConfig({type, message});

      Animated.parallel([
        Animated.spring(translateY, {toValue: 0, useNativeDriver: true, tension: 80, friction: 10}),
        Animated.timing(opacity, {toValue: 1, duration: 200, useNativeDriver: true}),
      ]).start();

      timerRef.current = setTimeout(hide, duration);
    },
    [translateY, opacity, hide],
  );

  useEffect(() => {
    _showFn = show;
    return () => {
      _showFn = null;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show]);

  if (!config) return null;

  const typeColors = {
    success: {bg: colors.successSurface, border: colors.success, text: colors.successDark},
    error: {bg: colors.errorSurface, border: colors.error, text: colors.errorDark},
    warning: {bg: colors.warningSurface, border: colors.warning, text: colors.accentDark},
    info: {bg: colors.infoSurface, border: colors.info, text: colors.primaryDark},
  };

  const tc = typeColors[config.type] || typeColors.info;
  const icon = {success: '✓', error: '✕', warning: '⚠', info: 'ℹ'}[config.type] || 'ℹ';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY}],
          opacity,
          backgroundColor: tc.bg,
          borderColor: tc.border,
          borderRadius: borderRadius.lg,
          marginHorizontal: spacing[4],
        },
        shadows.lg,
      ]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hide}
        style={styles.inner}>
        <View style={[styles.iconBadge, {backgroundColor: tc.border}]}>
          <AppText variant="caption" color={colors.white} style={styles.iconText}>
            {icon}
          </AppText>
        </View>
        <AppText
          variant="bodyMedium"
          color={tc.text}
          style={styles.message}
          numberOfLines={3}>
          {config.message}
        </AppText>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    zIndex: 9999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
  },
});

export default memo(Toast);
