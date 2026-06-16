import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './AppText';
import SliderPicker from './SliderPicker';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';

const WeightPicker = ({ weight, unit, onWeightChange, onUnitChange }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
    },
    toggleContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: colors.backgroundTertiary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: 2,
      marginBottom: spacing[8],
    },
    toggleBtn: {
      paddingVertical: spacing[1.5],
      paddingHorizontal: spacing[4],
      borderRadius: borderRadius.md,
    },
    toggleBtnActive: {
      backgroundColor: colors.surface,
      borderColor: '#A3C7E5',
      borderWidth: 1,
    },
    toggleText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    toggleTextActive: {
      color: '#265E8D',
    },
    valueTextContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      marginBottom: spacing[3],
      overflow: 'visible',
    },
    valueText: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.textPrimary,
      lineHeight: 28,
    },
    unitText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginLeft: 4,
      includeFontPadding: false,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, unit === 'kg' && styles.toggleBtnActive]}
          onPress={() => onUnitChange('kg')}
          activeOpacity={0.8}
        >
          <AppText style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>
            {t('basicInfo.unitKg')}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, unit === 'lbs' && styles.toggleBtnActive]}
          onPress={() => onUnitChange('lbs')}
          activeOpacity={0.8}
        >
          <AppText style={[styles.toggleText, unit === 'lbs' && styles.toggleTextActive]}>
            {t('basicInfo.unitLbs')}
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.valueTextContainer}>
        <AppText style={styles.valueText}>{Math.round(weight)}</AppText>
        <AppText style={styles.unitText}>{unit}</AppText>
      </View>

      <SliderPicker
        key={`weight-${unit}`}
        min={unit === 'lbs' ? 50 : 30}
        max={unit === 'lbs' ? 400 : 200}
        step={1}
        value={Math.round(weight)}
        onValueChange={onWeightChange}
        itemWidth={12}
        majorTickInterval={10}
        renderLabel={(val) => val}
      />
    </View>
  );
};

export default memo(WeightPicker);
