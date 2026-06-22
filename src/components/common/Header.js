/**
 * Header — themed app header with back button, title, right actions.
 *
 * Layout rule: the back button is always in a fixed-width left slot.
 * Title alignment (left or center) never shifts the back button position.
 */
import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../theme';
import AppText from './AppText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BACK_SLOT_WIDTH = 48; // fixed width — back icon never moves

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

      {/* Fixed-width back button slot — NEVER moves regardless of titleAlign */}
      <View style={styles.backSlot}>
        {leftComponent ? (
          leftComponent
        ) : showBack ? (
          <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="arrow-back-ios-new" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Title area — fills remaining space, alignment controlled by prop */}
      <View style={[
        styles.titleArea,
        titleAlign === 'left' ? styles.titleAreaLeft : styles.titleAreaCenter,
      ]}>
        {title ? (
          <AppText
            variant="title"
            color={colors.textPrimary}
            numberOfLines={1}
            style={titleAlign === 'left' ? styles.titleLeft : undefined}>
            {title}
          </AppText>
        ) : null}
        {subtitle ? (
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {/* Right slot — mirrors back slot width for balance */}
      <View style={styles.rightSlot}>
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
  // Fixed-width slot so the back icon never shifts
  backSlot: {
    width: BACK_SLOT_WIDTH,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  // Title fills the space between back slot and right slot
  titleArea: {
    flex: 1,
    justifyContent: 'center',
  },
  titleAreaCenter: {
    alignItems: 'center',
  },
  titleAreaLeft: {
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
  titleLeft: {
    // No extra margin needed — back slot already provides spacing
  },
  // Right slot matches back slot width for visual balance
  rightSlot: {
    width: BACK_SLOT_WIDTH,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default memo(Header);
