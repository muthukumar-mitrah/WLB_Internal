import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  SafeContainer,
  AppModal,
} from '../../../components/common';
import SliderPicker from '../../../components/common/SliderPicker';
import DateWheelPicker from '../../../components/common/DateWheelPicker';
import { COUNTRIES, countryCodeToFlag } from '../../../constants/countries';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';
import { ROUTES } from '../../../constants/index';

const GENDER_KEYS = [
  { value: 'Male', labelKey: 'basicInfo.genderMale' },
  { value: 'Female', labelKey: 'basicInfo.genderFemale' },
  { value: 'Other', labelKey: 'basicInfo.genderOther' },
];

const BasicInfoScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius]
  );

  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('');
  const [height, setHeight] = useState(1.45);
  const [heightUnit, setHeightUnit] = useState('m');
  const [weight, setWeight] = useState(135);
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [dob, setDob] = useState(new Date(2005, 0, 25));
  const [activeModal, setActiveModal] = useState(null);
  const [countrySearch, setCountrySearch] = useState('');

  const formattedDob = useMemo(() => {
    return dob.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [dob]);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find(c => c.value === country) || null;
  }, [country]);

  // Filter + sort: selected country always at top when no search query
  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    const list = q
      ? COUNTRIES.filter(c => c.label.toLowerCase().includes(q))
      : COUNTRIES;

    if(!country || q) return list;

    const selected = list.find(c => c.value === country);
    const rest = list.filter(c => c.value !== country);
    return selected ? [selected, ...rest] : list;
  }, [country, countrySearch]);

  const handleNext = useCallback(() => {
    navigation.navigate(ROUTES.BASIC_INFO2);
  }, [navigation]);

  const handleOpenCountry = useCallback(() => {
    setCountrySearch('');
    setActiveModal('country');
  }, []);

  const handleSelectCountry = useCallback((value) => {
    setCountry(value);
    setActiveModal(null);
    setCountrySearch('');
  }, []);

  const renderCountryItem = useCallback(({ item }) => {
    const isSelected = item.value === country;
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          isSelected && styles.countryItemSelected,
        ]}
        onPress={() => handleSelectCountry(item.value)}
        activeOpacity={0.7}
      >
        <View style={styles.countryItemLeft}>
          <AppText style={styles.countryFlag}>{countryCodeToFlag(item.value)}</AppText>
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
  }, [colors, country, styles, handleSelectCountry]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressDots}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={handleNext}>
          <AppText variant="bodyMedium" color={colors.primary}>{t('common.buttons.skip')}</AppText>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="h3" color={colors.textPrimary} style={styles.heading}>
          {t('basicInfo.heading')}
        </AppText>
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.genderLabel')}</AppText>
        <View style={styles.genderRow}>
          {GENDER_KEYS.map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[styles.genderBtn, gender === g.value && styles.genderBtnActive]}
              onPress={() => setGender(g.value)}
            >
              <AppText variant="bodyMedium" style={gender === g.value ? styles.genderTextActive : styles.genderText}>
                {t(g.labelKey)}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.countryLabel')}</AppText>
        <TouchableOpacity
          style={[styles.pickerInput, activeModal === 'country' && styles.pickerInputActive]}
          onPress={handleOpenCountry}
          activeOpacity={0.8}
        >
          {selectedCountry ? (
            <View style={styles.countryPickerValue}>
              <AppText style={styles.countryPickerFlag}>
                {countryCodeToFlag(selectedCountry.value)}
              </AppText>
              <AppText variant="body" style={styles.pickerText}>
                {selectedCountry.label}
              </AppText>
            </View>
          ) : (
            <AppText variant="body" style={styles.pickerPlaceholder}>
              {t('basicInfo.countryPlaceholder')}
            </AppText>
          )}
          <Icon
            name={activeModal === 'country' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.heightLabel')}</AppText>
        <TouchableOpacity
          style={[styles.pickerInput, activeModal === 'height' && styles.pickerInputActive]}
          onPress={() => setActiveModal('height')}
        >
          <AppText variant="body" style={styles.pickerText}>
            {height.toFixed(2)} {heightUnit}
          </AppText>
        </TouchableOpacity>
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.weightLabel')}</AppText>
        <TouchableOpacity
          style={[styles.pickerInput, activeModal === 'weight' && styles.pickerInputActive]}
          onPress={() => setActiveModal('weight')}
        >
          <AppText variant="body" style={styles.pickerText}>
            {weight} {weightUnit}
          </AppText>
        </TouchableOpacity>
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.dobLabel')}</AppText>
        <TouchableOpacity
          style={[styles.pickerInput, activeModal === 'dob' && styles.pickerInputActive]}
          onPress={() => setActiveModal('dob')}
        >
          <AppText variant="body" style={styles.pickerText}>
            {formattedDob}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomBtnContainer}>
        <Button
          title={t('common.buttons.next')}
          onPress={handleNext}
          variant="primary"
          style={styles.nextBtn}
        />
      </View>
      <AppModal
        visible={activeModal === 'country'}
        onClose={() => setActiveModal(null)}
        title={t('modals.selectCountry.title')}
      >
        <View style={styles.countrySearchWrapper}>
          <TextInput
            style={[styles.countrySearchInput, { color: colors.textPrimary }]}
            placeholder={'Search country...'}
            placeholderTextColor={colors.textSecondary}
            value={countrySearch}
            onChangeText={setCountrySearch}
            autoCorrect={false}
            autoCapitalize="words"
            clearButtonMode="while-editing"
          />
          <Icon name="search-outline" size={16} color={colors.textSecondary} style={styles.countrySearchIcon} />
        </View>
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.value}
          renderItem={renderCountryItem}
          showsVerticalScrollIndicator={false}
          style={{ height: 450, marginBottom: spacing[4] }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <AppText
              variant="body"
              color={colors.textSecondary}
              style={styles.countryEmptyText}
            >
              No countries found
            </AppText>
          }
        />
      </AppModal>
      <AppModal
        visible={activeModal === 'height'}
        onClose={() => setActiveModal(null)}
        showHandle={false}
        showCloseButton={false}
        style={styles.modalContainer}
        overlayColor="transparent"
      >
        <View style={styles.modalContent}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, heightUnit === 'ft' && styles.toggleBtnActive]}
              onPress={() => {
                setHeight((prev) => Math.max(3.0, Math.min(Number((prev * 3.28084).toFixed(1)), 8.0)));
                setHeightUnit('ft');
              }}
            >
              <AppText style={[styles.toggleText, heightUnit === 'ft' && styles.toggleTextActive]}>{t('basicInfo.unitFeet')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, heightUnit === 'm' && styles.toggleBtnActive]}
              onPress={() => {
                setHeight((prev) => Math.max(1.0, Math.min(Number((prev / 3.28084).toFixed(2)), 2.5)));
                setHeightUnit('m');
              }}
            >
              <AppText style={[styles.toggleText, heightUnit === 'm' && styles.toggleTextActive]}>{t('basicInfo.unitMeters')}</AppText>
            </TouchableOpacity>
          </View>
          <View style={[styles.valueTextContainer]}>
            <AppText style={styles.valueText}>{height.toFixed(2)}</AppText>
            <AppText style={styles.unitText}>{heightUnit}</AppText>
          </View>
          <SliderPicker
            key={`height-${heightUnit}`}
            min={heightUnit === 'm' ? 1.0 : 3.0}
            max={heightUnit === 'm' ? 2.5 : 8.0}
            step={heightUnit === 'm' ? 0.01 : 0.1}
            value={height}
            onValueChange={(val) => setHeight(Number(val.toFixed(2)))}
            itemWidth={12}
            majorTickInterval={10}
            renderLabel={(val) => val.toFixed(heightUnit === 'm' ? 2 : 1)}
          />
        </View>
      </AppModal>
      <AppModal
        visible={activeModal === 'weight'}
        onClose={() => setActiveModal(null)}
        showHandle={false}
        showCloseButton={false}
        style={styles.modalContainer}
        overlayColor="transparent"
      >
        <View style={styles.modalContent}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, weightUnit === 'kg' && styles.toggleBtnActive]}
              onPress={() => {
                setWeight((prev) => Math.max(30, Math.min(Math.round(prev / 2.20462), 200)));
                setWeightUnit('kg');
              }}
            >
              <AppText style={[styles.toggleText, weightUnit === 'kg' && styles.toggleTextActive]}>{t('basicInfo.unitKg')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, weightUnit === 'lbs' && styles.toggleBtnActive]}
              onPress={() => {
                setWeight((prev) => Math.max(50, Math.min(Math.round(prev * 2.20462), 400)));
                setWeightUnit('lbs');
              }}
            >
              <AppText style={[styles.toggleText, weightUnit === 'lbs' && styles.toggleTextActive]}>{t('basicInfo.unitLbs')}</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.valueTextContainer}>
            <AppText style={styles.valueText}>{Math.round(weight)}</AppText>
            <AppText style={styles.unitText}>{weightUnit}</AppText>
          </View>
          <SliderPicker
            key={`weight-${weightUnit}`}
            min={weightUnit === 'lbs' ? 50 : 30}
            max={weightUnit === 'lbs' ? 400 : 200}
            step={1}
            value={Math.round(weight)}
            onValueChange={(val) => setWeight(Math.round(val))}
            itemWidth={12}
            majorTickInterval={10}
            renderLabel={(val) => val}
          />
        </View>
      </AppModal>
      <AppModal
        visible={activeModal === 'dob'}
        onClose={() => setActiveModal(null)}
        showHandle={false}
        showCloseButton={false}
        style={styles.modalContainer}
        overlayColor="transparent"
      >
        <View style={styles.modalContent}>
          <DateWheelPicker
            date={dob}
            onDateChange={setDob}
          />
        </View>
      </AppModal>
    </SafeContainer>
  );
};

export default memo(BasicInfoScreen);