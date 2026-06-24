import React, { memo, useMemo } from 'react';
import { View, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { AppText } from '.';
import RulerPicker from './RulerPicker';

export const generateScaleValues = (min, max, count = 6) => {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, index) => {
    const value = Math.round(min + step * index);
    return {
      value,
      label: index === count - 1 ? `${value}+` : `${value}`,
    };
  });
};

export const GENDER_OPTIONS = [
  { value: 'All',    labelKey: 'basicInfo.genderAll' },
  { value: 'Male',   labelKey: 'basicInfo.genderMale' },
  { value: 'Female', labelKey: 'basicInfo.genderFemale' },
  { value: 'Other',  labelKey: 'basicInfo.genderOther' },
];

export const SwitchRow = memo(({ label, subLabel, value, onValueChange, colors, styles }) => {
  return (
    <View style={styles?.switchRow}>
      <View style={styles?.switchTextContainer}>
        <AppText style={styles?.switchLabel}>{label}</AppText>
        {subLabel ? (
          <AppText style={styles?.switchSubLabel}>{subLabel}</AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.background}
      />
    </View>
  );
});

export const GenderButtons = memo(({ gender, onGenderChange, t, styles }) => (
  <View style={styles?.genderRow}>
    {GENDER_OPTIONS.map(g => {
      const isActive = gender === g.value;
      return (
        <TouchableOpacity
          key={g.value}
          style={[styles?.genderBtn, isActive && styles?.genderBtnActive]}
          onPress={() => onGenderChange(g.value)}
          activeOpacity={0.75}
        >
          <AppText
            variant="bodyMedium"
            style={[styles?.genderBtnText, isActive && styles?.genderBtnTextActive]}
          >
            {t(g.labelKey)}
          </AppText>
        </TouchableOpacity>
      );
    })}
  </View>
));

export const UnitToggle = memo(({ unit, onUnitChange, colors }) => {
  const s = useMemo(() => StyleSheet.create({
    row: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundSecondary || colors.card,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 1,
    },
    btn: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
    btnActive: { backgroundColor: colors.primary },
    text: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
    textActive: { color: '#FFFFFF' },
  }), [colors]);

  return (
    <View style={s.row}>
      <TouchableOpacity
        style={[s.btn, unit === 'kg' && s.btnActive]}
        onPress={() => onUnitChange('kg')}
        activeOpacity={0.8}
      >
        <AppText style={[s.text, unit === 'kg' && s.textActive]}>Kg</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.btn, unit === 'lbs' && s.btnActive]}
        onPress={() => onUnitChange('lbs')}
        activeOpacity={0.8}
      >
        <AppText style={[s.text, unit === 'lbs' && s.textActive]}>Lbs</AppText>
      </TouchableOpacity>
    </View>
  );
});

export const RangeSliderSection = memo(({
  label, min, max, minValue, maxValue, onValuesChange,
  value, onValueChange, isRange = true,
  unit, showUnitToggle = false, onUnitChange, colors, styles, bgColor,
  onInteractionStart, onInteractionEnd, fixedScaleLabels, valueFormatter
}) => {
  return (
    <View style={styles?.sliderRow} >
      <View style={styles?.sliderLabelRow}>
        <AppText style={styles?.formLabel}>{label}</AppText>
        {showUnitToggle && onUnitChange
          ? <UnitToggle unit={unit} onUnitChange={onUnitChange} colors={colors} />
          : null}
      </View>

      <View>
        <RulerPicker
          key={`ruler-${unit}`}
          mode="range"
          isRange={isRange}
          interaction="thumb"
          min={min}
          max={max}
          minValue={minValue}
          maxValue={maxValue}
          value={value}
          onValueChange={onValueChange}
          onValuesChange={onValuesChange}
          showTicks={false}
          unit={unit}
          fixedScaleLabels={fixedScaleLabels}
          showValueLabel={!isRange}
          valueUnit={!isRange ? unit : undefined}
          onValuesChangeStart={onInteractionStart}
          onValuesChangeFinish={onInteractionEnd}
          valueFormatter={valueFormatter}
        />
      </View>
    </View>
  );
});
