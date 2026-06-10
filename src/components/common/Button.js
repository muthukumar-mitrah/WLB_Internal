/**
 * Button — themed, accessible button with loading state
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: sm, md, lg
 */
import React, {memo} from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from '../../theme';
import AppText from './AppText';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
  textStyle,
  testID,
  ...rest
}) => {
  const {colors, borderRadius, buttonHeight, spacing, shadows} = useTheme();

  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant, colors);
  const sizeStyles = getSizeStyles(size, buttonHeight, spacing);

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          borderRadius: borderRadius.lg,
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        variantStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && shadows.button,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator
          color={variantStyles.loaderColor}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <AppText
            variant={sizeStyles.textVariant}
            color={variantStyles.textColor}
            style={textStyle}>
            {title}
          </AppText>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const getVariantStyles = (variant, colors) => {
  switch (variant) {
    case 'primary':
      return {
        container: {backgroundColor: colors.primary},
        textColor: colors.white,
        loaderColor: colors.white,
      };
    case 'secondary':
      return {
        container: {backgroundColor: colors.secondary},
        textColor: colors.white,
        loaderColor: colors.white,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: colors.transparent,
          borderWidth: 1.5,
          borderColor: colors.primary,
        },
        textColor: colors.primary,
        loaderColor: colors.primary,
      };
    case 'ghost':
      return {
        container: {backgroundColor: colors.transparent},
        textColor: colors.primary,
        loaderColor: colors.primary,
      };
    case 'gray':
      return {
        container: { backgroundColor: colors.backgroundTertiary },
        textColor: colors.textPrimary,
        loaderColor: colors.textPrimary,
      };
    case 'danger':
      return {
        container: {backgroundColor: colors.error},
        textColor: colors.white,
        loaderColor: colors.white,
      };
    default:
      return {
        container: {backgroundColor: colors.primary},
        textColor: colors.white,
        loaderColor: colors.white,
      };
  }
};

const getSizeStyles = (size, buttonHeight, spacing) => {
  switch (size) {
    case 'sm':
      return {
        height: buttonHeight.sm,
        paddingHorizontal: spacing[4],
        textVariant: 'buttonSmall',
      };
    case 'lg':
      return {
        height: buttonHeight.lg,
        paddingHorizontal: spacing[8],
        textVariant: 'buttonLarge',
      };
    default:
      return {
        height: buttonHeight.md,
        paddingHorizontal: spacing[6],
        textVariant: 'button',
      };
  }
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default memo(Button);
