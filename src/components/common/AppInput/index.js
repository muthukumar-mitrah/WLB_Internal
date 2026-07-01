import React, { memo, useState, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from '../../../theme';
import AppText from '../AppText';
import createStyles from './styles';

const AppInput = forwardRef(({
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
  wrapperStyle,
  labelStyle,
  testID,
  required = false,
  variant = 'outlined', // 'outlined' or 'underline'
  ...rest
}, ref) => {
  const { colors, borderRadius, spacing, fonts, shadows } = useTheme();
  
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, fonts, shadows }),
    [colors, spacing, borderRadius, fonts, shadows]
  );

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => inputRef.current?.clear(),
  }));

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

  const isUnderline = variant === 'underline';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelWrapper}>
          <AppText variant="label" color={colors.textSecondary} style={[styles.label, labelStyle]}>
            {label}
          </AppText>
          {required &&
            <AppText style={styles.requiredLabel}>*</AppText>
          }
        </View>
      )}

      <Animated.View
        style={[
          styles.inputWrapper,
          !editable && styles.inputWrapperDisabled,
          isUnderline && styles.inputWrapperUnderline,
          isFocused && !isUnderline && styles.inputWrapperFocused,
          !isUnderline && { borderColor },
          wrapperStyle,
        ]}>
        {leftIcon && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}

        <TextInput
          ref={inputRef}
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
            multiline && styles.inputMultiline,
            isUnderline && !multiline && styles.inputUnderline,
            inputStyle,
          ]}
          {...rest}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(p => !p)}
            style={styles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} color={colors.textTertiary} size={20} />
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </Animated.View>

      {error ? (
        <AppText variant="caption" style={styles.messageError}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" style={styles.messageHint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

export default memo(AppInput);
