/**
 * Header — themed app header with back button, title, right actions
 */
import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../theme';
import AppText from './AppText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Header = ({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightComponent,
  leftComponent,
  transparent = false,
  titleAlign = 'center',
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
          zIndex: 10,
        },
        !transparent && shadows.xs,
        style,
      ]}>
      {/* Left */}
      <View style={[styles.leftSide, titleAlign === 'left' && { flex: 4, flexDirection: 'row', alignItems: 'center' }]}>
        {leftComponent ? (
          leftComponent
        ) : showBack ? (
          <TouchableOpacity onPress={handleBack} >
            <MaterialIcons name="arrow-back-ios-new" size={25} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
        {titleAlign === 'left' && title && (
          <AppText variant="title" color={colors.textPrimary} numberOfLines={1} style={{ marginLeft: spacing[3] }}>
            {title}
          </AppText>
        )}
      </View>

      {/* Center */}
      <View style={styles.center}>
        {titleAlign === 'center' && title && (
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
      <View style={styles.rightSide}>
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
  leftSide: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 1,
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1,
  },
  center: {
    flex: 3,
    alignItems: 'center',
  }
});

export default memo(Header);
