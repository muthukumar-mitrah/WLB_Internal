/**
 * InputBox — themed, accessible text input
 * Supports: label, placeholder, error, left/right icons, secure entry, multiline
 */
import React, { memo, useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme';
import AppText from './AppText';

const InputBox = ({
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,
  error,
  hint,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  maxLength,
  editable = true,
  containerStyle,
  inputStyle,
  testID,
  ...rest
}) => {
  const { colors, borderRadius, spacing, fonts, shadows } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = e => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = e => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? colors.error : colors.inputBorder,
      error ? colors.error : colors.borderFocused,
    ],
  });

  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText variant="label" color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      )}

      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderRadius: borderRadius.md,
            borderColor,
            backgroundColor: editable ? colors.inputBackground : colors.backgroundSecondary,
            paddingHorizontal: spacing[3],
          },
          isFocused && shadows.xs,
        ]}>
        {leftIcon && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}

        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          secureTextEntry={isSecure}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          editable={editable}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: fonts.fontFamily.regular,
              fontSize: fonts.fontSize.base,
              height: multiline ? undefined : 48,
              textAlignVertical: multiline ? 'top' : 'center',
              paddingVertical: multiline ? spacing[3] : 0,
            },
            inputStyle,
          ]}
          {...rest}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(p => !p)}
            style={styles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <AppText variant="caption" color={colors.textTertiary}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </AppText>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </Animated.View>

      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.message}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textTertiary} style={styles.message}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    width: '100%',
    alignSelf: 'stretch',
  },
  input: {
    flex: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  message: {
    marginTop: 4,
    marginLeft: 2,
  },
});

export default memo(InputBox);
