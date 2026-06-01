/**
 * Header — themed app header with back button, title, right actions
 */
import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../theme';
import AppText from './AppText';

const Header = ({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightComponent,
  leftComponent,
  transparent = false,
  style,
  testID,
}) => {
  const navigation = useNavigation();
  const {colors, spacing, shadows} = useTheme();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : colors.background,
          paddingHorizontal: spacing[4],
          paddingTop: Platform.OS === 'ios' ? spacing[2] : spacing[2],
          paddingBottom: spacing[3],
        },
        !transparent && shadows.xs,
        style,
      ]}>
      {/* Left */}
      <View style={styles.side}>
        {leftComponent ? (
          leftComponent
        ) : showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, {backgroundColor: colors.backgroundSecondary}]}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <AppText variant="title" color={colors.textPrimary}>
              ←
            </AppText>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center */}
      <View style={styles.center}>
        {title && (
          <AppText variant="title" color={colors.textPrimary} numberOfLines={1}>
            {title}
          </AppText>
        )}
        {subtitle && (
          <AppText
            variant="caption"
            color={colors.textSecondary}
            numberOfLines={1}>
            {subtitle}
          </AppText>
        )}
      </View>

      {/* Right */}
      <View style={styles.side}>
        {rightComponent || null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  side: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 3,
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Header);
