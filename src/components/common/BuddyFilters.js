import React, { memo, useMemo, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppText, AppModal } from '.';
import RulerPicker from './RulerPicker';
import { COUNTRIES, countryCodeToFlag } from '../../constants/countries';

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

export const GenderButtons = memo(({ gender, onGenderChange, colors, borderRadius, t, styles }) => (
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
      padding: 2,
    },
    btn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    btnActive: { backgroundColor: colors.primary },
    text: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
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
  onInteractionStart, onInteractionEnd, fixedScaleLabels
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
        />
      </View>
    </View>
  );
});

export const CountrySelector = memo(({
  country, colors, spacing, borderRadius, t,
  modalVisible, onOpenModal, onCloseModal, onSelectCountry, styles
}) => {
  const [countrySearch, setCountrySearch] = useState('');

  const selectedCountry = useMemo(
    () => COUNTRIES.find(c => c.value === country) || null,
    [country],
  );

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c => c.label.toLowerCase().includes(q));
  }, [countrySearch]);

  const handleOpen = useCallback(() => {
    setCountrySearch('');
    onOpenModal();
  }, [onOpenModal]);

  const renderItem = useCallback(({ item }) => {
    const isSelected = item.value === country;
    return (
      <TouchableOpacity
        style={[
          styles?.countryItemRow,
          isSelected && styles?.countryItemRowSelected
        ]}
        onPress={() => onSelectCountry(item.value)}
        activeOpacity={0.7}
      >
        <View style={styles?.countryItemContent}>
          <AppText style={styles?.countryItemFlag}>
            {countryCodeToFlag(item.value)}
          </AppText>
          <AppText
            variant="body"
            color={isSelected ? colors.primary : colors.textPrimary}
            style={isSelected ? styles?.countryItemTextSelected : undefined}
          >
            {item.label}
          </AppText>
        </View>
        {isSelected ? <IonIcon name="checkmark-circle" size={20} color={colors.primary} /> : null}
      </TouchableOpacity>
    );
  }, [country, colors, onSelectCountry, styles]);

  const keyExtractor = useCallback(item => item.value, []);

  return (
    <>
      <AppText style={styles?.formLabel}>
        {t('basicInfo.countryLabel')}
      </AppText>
      <TouchableOpacity
        style={styles?.countryDropdown}
        onPress={handleOpen}
        activeOpacity={0.8}
      >
        {selectedCountry ? (
          <View style={styles?.countryDropdownContent}>
            <AppText style={styles?.countryDropdownFlag}>
              {countryCodeToFlag(selectedCountry.value)}
            </AppText>
            <AppText variant="body" style={styles?.countryDropdownText}>
              {selectedCountry.label}
            </AppText>
          </View>
        ) : (
          <AppText variant="body" style={styles?.countryDropdownPlaceholder}>All Countries</AppText>
        )}
        <IonIcon name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <AppModal
        visible={modalVisible}
        onClose={onCloseModal}
        title={t('modals.selectCountry.title')}
      >
        <View style={styles?.countrySearchContainerModal}>
          <TextInput
            style={styles?.countrySearchInputModal}
            placeholder="Search country..."
            placeholderTextColor={colors.textSecondary}
            value={countrySearch}
            onChangeText={setCountrySearch}
            autoCorrect={false}
            autoCapitalize="words"
            clearButtonMode="while-editing"
          />
          <IonIcon name="search-outline" size={16} color={colors.textSecondary} />
        </View>
        <FlatList
          data={filteredCountries}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={styles?.countryListContainer}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <AppText variant="body" color={colors.textSecondary} style={styles?.countryEmptyText}>
              No countries found
            </AppText>
          }
        />
      </AppModal>
    </>
  );
});
