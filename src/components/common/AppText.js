/**
 * AppText — themed, accessible Text component
 * Supports all textVariants from the theme
 */
import React, {memo} from 'react';
import {Text} from 'react-native';
import {useTheme} from '../../theme';

const AppText = ({
  variant = 'body',
  color,
  style,
  children,
  numberOfLines,
  ellipsizeMode,
  onPress,
  testID,
  ...rest
}) => {
  const {textVariants, colors} = useTheme();

  const variantStyle = textVariants[variant] || textVariants.body;

  return (
    <Text
      testID={testID}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      style={[
        variantStyle,
        {color: color || colors.textPrimary},
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

export default memo(AppText);
