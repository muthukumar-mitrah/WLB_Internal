/**
 * WeightColumn — displays a single weight data-point (Start / Current / Goal)
 * inside the Weight Progress card.
 * Shared between MyProfileScreen (and any future screen showing weight progress).
 */
import React, {memo} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppText} from '../../../components/common';
import {useTheme} from '../../../theme';
import {APP_IMAGES} from '../../../constants';

/** Map icon names to their centralized asset entries. */
const ICON_ASSET_MAP = {
  fire: APP_IMAGES.weeklyPoints,
};

const WeightColumn = ({dotColor, label, value, iconName}) => {
  const {colors} = useTheme();

  const pngSource = iconName ? ICON_ASSET_MAP[iconName] : null;

  return (
    <View style={styles.container}>
      {/* Dot + label row */}
      <View style={styles.dotRow}>
        <View style={[styles.dot, {backgroundColor: dotColor}]} />
        <AppText
          variant="captionMedium"
          color={colors.textSecondary}
          style={styles.label}>
          {label}
        </AppText>
      </View>

      {/* Value + optional icon */}
      <View style={styles.valueRow}>
        <AppText variant="h2" color={colors.textPrimary}>
          {value}
        </AppText>
        {pngSource ? (
          <Image
            source={pngSource}
            style={[styles.icon, {tintColor: colors.iconSecondary}]}
            resizeMode="contain"
          />
        ) : iconName ? (
          <Icon
            name={iconName}
            size={20}
            color={colors.iconSecondary}
            style={styles.icon}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 12,
    opacity: 0.5,
  },
});

export default memo(WeightColumn);
