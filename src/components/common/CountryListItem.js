import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from './AppText';
import { countryCodeToFlag } from '../../constants/countries';

const CountryListItem = ({ item, isSelected, onPress }) => {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.countryItem,
        { paddingVertical: spacing[3], paddingHorizontal: spacing[2] },
        isSelected && [
          styles.countryItemSelected,
          {
            backgroundColor: colors.primarySurface,
            borderRadius: borderRadius.md,
          },
        ],
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.countryItemLeft}>
        <AppText style={[styles.countryFlag, { marginRight: spacing[3] }]}>
          {countryCodeToFlag(item.value)}
        </AppText>
        <AppText
          variant="body"
          color={isSelected ? colors.primary : colors.textPrimary}
          style={isSelected ? { fontWeight: '600' } : undefined}
        >
          {item.label}
        </AppText>
      </View>
      {isSelected && (
        <Icon name="checkmark-circle" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryItemSelected: {
    borderBottomWidth: 0,
    marginBottom: 4,
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryFlag: {
    fontSize: 22,
    lineHeight: 28,
  },
});

export default memo(CountryListItem);
