import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  SafeContainer,
  AppModal,
} from '../../../components/common';
import RulerPicker from '../../../components/common/RulerPicker';
import DateWheelPicker from '../../../components/common/DateWheelPicker';
import { COUNTRIES } from '../../../constants/countries';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';
import { ROUTES } from '../../../constants/index';

const GENDER_KEYS = [
  { value: 'Male',   labelKey: 'basicInfo.genderMale' },
  { value: 'Female', labelKey: 'basicInfo.genderFemale' },
  { value: 'Other',  labelKey: 'basicInfo.genderOther' },
];

const BasicInfoScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius]
  );

  // Form State
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('');

  const [height, setHeight] = useState(1.45);
  const [heightUnit, setHeightUnit] = useState('m');

  const [weight, setWeight] = useState(135);
  const [weightUnit, setWeightUnit] = useState('lbs');

  const [dob, setDob] = useState(new Date(2005, 0, 25));

  // Modals visibility
  const [activeModal, setActiveModal] = useState(null);

  // Formatters
  const formattedDob = useMemo(() => {
    return dob.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [dob]);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find(c => c.value === country)?.label || '';
  }, [country]);

  // Sort countries: selected one at top
  const sortedCountries = useMemo(() => {
    if (!country) return COUNTRIES;
    const selected = COUNTRIES.find(c => c.value === country);
    const rest = COUNTRIES.filter(c => c.value !== country);
    return selected ? [selected, ...rest] : COUNTRIES;
  }, [country]);

  // Handlers
  const handleNext = useCallback(() => {
    navigation.navigate(ROUTES.BASIC_INFO2);
  }, [navigation]);

  const renderCountryItem = useCallback(({ item }) => {
    const isSelected = item.value === country;
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          isSelected && styles.countryItemSelected,
        ]}
        onPress={() => {
          setCountry(item.value);
          setActiveModal(null);
        }}
      >
        <AppText
          variant="body"
          color={isSelected ? colors.primary : colors.textPrimary}
          style={isSelected ? { fontWeight: '600' } : undefined}
        >
          {item.label}
        </AppText>
        {isSelected && (
          <Icon name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  }, [colors, country, styles]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />

      {/* ── Header ── */}
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

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="h2" color={colors.textPrimary} style={styles.heading}>
          {t('basicInfo.heading')}
        </AppText>

        {/* ── Gender ── */}
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

        {/* ── Country ── */}
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.countryLabel')}</AppText>
        <TouchableOpacity
          style={[styles.pickerInput, activeModal === 'country' && styles.pickerInputActive]}
          onPress={() => setActiveModal('country')}
        >
          <AppText variant="body" style={selectedCountry ? styles.pickerText : styles.pickerPlaceholder}>
            {selectedCountry || t('basicInfo.countryPlaceholder')}
          </AppText>
          <Icon
            name={activeModal === 'country' ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* ── Height ── */}
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.heightLabel')}</AppText>
        <TouchableOpacity
          style={[styles.pickerInput, activeModal === 'height' && styles.pickerInputActive]}
          onPress={() => setActiveModal('height')}
        >
          <AppText variant="body" style={styles.pickerText}>
            {height.toFixed(2)} {heightUnit}
          </AppText>
        </TouchableOpacity>

        {/* ── Weight ── */}
        <AppText variant="body" style={styles.sectionLabel}>{t('basicInfo.weightLabel')}</AppText>
        <TouchableOpacity
          style={[styles.pickerInput, activeModal === 'weight' && styles.pickerInputActive]}
          onPress={() => setActiveModal('weight')}
        >
          <AppText variant="body" style={styles.pickerText}>
            {weight} {weightUnit}
          </AppText>
        </TouchableOpacity>

        {/* ── Date of Birth ── */}
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

      {/* ── Next Button (Fixed at bottom) ── */}
      <View style={styles.bottomBtnContainer}>
        <Button
          title={t('common.buttons.next')}
          onPress={handleNext}
          variant="primary"
          style={styles.nextBtn}
        />
      </View>

      {/* ── Country Modal ── */}
      <AppModal visible={activeModal === 'country'} onClose={() => setActiveModal(null)} title={t('modals.selectCountry.title')}>
        <FlatList
          data={sortedCountries}
          keyExtractor={(item) => item.value}
          renderItem={renderCountryItem}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 400 }}
        />
      </AppModal>

      {/* ── Height Modal ── */}
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
              onPress={() => setHeightUnit('ft')}
            >
              <AppText style={[styles.toggleText, heightUnit === 'ft' && styles.toggleTextActive]}>{t('basicInfo.unitFeet')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, heightUnit === 'm' && styles.toggleBtnActive]}
              onPress={() => setHeightUnit('m')}
            >
              <AppText style={[styles.toggleText, heightUnit === 'm' && styles.toggleTextActive]}>{t('basicInfo.unitMeters')}</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.valueTextContainer}>
            <AppText style={styles.valueText}>{height.toFixed(2)}</AppText>
            <AppText style={styles.unitText}>{heightUnit}</AppText>
          </View>

          <RulerPicker
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

      {/* ── Weight Modal ── */}
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
              onPress={() => setWeightUnit('kg')}
            >
              <AppText style={[styles.toggleText, weightUnit === 'kg' && styles.toggleTextActive]}>{t('basicInfo.unitKg')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, weightUnit === 'lbs' && styles.toggleBtnActive]}
              onPress={() => setWeightUnit('lbs')}
            >
              <AppText style={[styles.toggleText, weightUnit === 'lbs' && styles.toggleTextActive]}>{t('basicInfo.unitLbs')}</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.valueTextContainer}>
            <AppText style={styles.valueText}>{Math.round(weight)}</AppText>
            <AppText style={styles.unitText}>{weightUnit}</AppText>
          </View>

          <RulerPicker
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

      {/* ── DOB Modal ── */}
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
