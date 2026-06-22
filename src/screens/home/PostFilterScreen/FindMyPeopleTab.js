/**
 * FindMyPeopleTab — Filter By People tab.
 *
 * Reuses the same Gender buttons and Country modal pattern as BasicInfoScreen.
 */
import React, {
  memo,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons'; 
import { useTheme } from '../../../theme';
import { AppText, Button, AppModal } from '../../../components/common';
import RulerPicker from '../../../components/common/RulerPicker';
import { useTranslation } from '../../../i18n/useTranslation';
import { COUNTRIES, countryCodeToFlag } from '../../../constants/countries';
import createStyles from './styles';
import { spacing } from '../../../theme/spacing';
import { kgToLbs, lbsToKg } from '../../../utils/weightUtils';

const generateScaleValues = (min, max, count = 6) => {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, index) => {
    const value = Math.round(min + step * index);
    return {
      value,
      label: index === count - 1 ? `${value}+` : `${value}`,
    };
  });
};

const AGE_MIN = 18;
const AGE_MAX = 75;

const WEIGHT_MIN_KG = 36;
const WEIGHT_MAX_KG = 127;

const LOSE_MIN_KG = 2;
const LOSE_MAX_KG = 27;

// ── Static gender data — mirrors BasicInfoScreen's GENDER_KEYS + "All" ────────
const GENDER_OPTIONS = [
  { value: 'All',    labelKey: 'basicInfo.genderAll' },
  { value: 'Male',   labelKey: 'basicInfo.genderMale' },
  { value: 'Female', labelKey: 'basicInfo.genderFemale' },
  { value: 'Other',  labelKey: 'basicInfo.genderOther' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components — all wrapped in React.memo
// ─────────────────────────────────────────────────────────────────────────────

const SwitchRow = memo(({ label, subLabel, value, onValueChange, colors, styles }) => {
  return (<View style={styles?.switchRow}>
    <View style={styles?.switchTextContainer}>
         <AppText style={styles?.switchLabel} >{label}</AppText>
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
  </View>)
});

// Gender buttons — exact same layout as BasicInfoScreen's genderRow
const GenderButtons = memo(({ gender, onGenderChange, colors, borderRadius, t, styles }) => (
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

// Kg / Lbs unit toggle — styled to match the design
const UnitToggle = memo(({ unit, onUnitChange, colors }) => {
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

const RangeSliderSection = memo(({
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

// Country field — uses AppModal + FlatList, same pattern as BasicInfoScreen
const CountrySelector = memo(({
  country, colors, spacing, borderRadius, t,
  modalVisible, onOpenModal, onCloseModal, onSelectCountry,styles
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
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: spacing[3],
              paddingHorizontal: spacing[2],
            },
            isSelected && {
              backgroundColor: colors.primarySurface,
              borderRadius: borderRadius.md,
            }
          ]}
          onPress={() => onSelectCountry(item.value)}
          activeOpacity={0.7}
        >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <AppText style={{ fontSize: 22, marginRight: spacing[3], lineHeight: 28 }}>
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
        {isSelected ? <IonIcon name="checkmark-circle" size={20} color={colors.primary} /> : null}
      </TouchableOpacity>
    );
  }, [country, colors, spacing, borderRadius, onSelectCountry]);

  const keyExtractor = useCallback(item => item.value, []);

  return (
    <>
      {/* Trigger row */}
      <AppText style={styles?.formLabel}>
        {t('basicInfo.countryLabel')}
      </AppText>
      <TouchableOpacity
        style={styles?.countryDropdown}
        onPress={handleOpen}
        activeOpacity={0.8}
      >
        {selectedCountry ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <AppText style={{ fontSize: 22, marginRight: spacing[2], lineHeight: 28 }}>
              {countryCodeToFlag(selectedCountry.value)}
            </AppText>
            <AppText variant="body" style={styles?.countryDropdownText}>
              {selectedCountry.label}
            </AppText>
          </View>
        ) : (
          <AppText variant="body" style={{ color: colors.textSecondary }}>All Countries</AppText>
        )}
        <IonIcon name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Country modal — same as BasicInfoScreen */}
      <AppModal
        visible={modalVisible}
        onClose={onCloseModal}
        title={t('modals.selectCountry.title')}
      >
        {/* Search bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.backgroundSecondary,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          paddingHorizontal: spacing[3],
          marginBottom: spacing[3],
          height: 42,
        }}>
          <TextInput
            style={{ flex: 1, fontSize: 14, color: colors.textPrimary, paddingVertical: 0, height: '100%' }}
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
          style={{ height: 420, marginBottom: spacing[4] }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', paddingVertical: spacing[6] }}>
              No countries found
            </AppText>
          }
        />
      </AppModal>
    </>
  );
});

// ── Main tab ───────────────────────────────────────────────────────────────────
const FindMyPeopleTab = ({ onApply }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
   const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius]
  );

  // Filter state
  const [seeAll, setSeeAll] = useState(false);
  const [gender, setGender] = useState('All');
  const [buddyAge, setBuddyAge] = useState({ min: 25, max: 45 });

  const [weightUnit, setWeightUnit] = useState('lbs');
  const [currentWeightKg, setCurrentWeightKg] = useState({ min: 78, max: 111 });

  const [loseUnit, setLoseUnit] = useState('lbs');
  const [wantsToLoseKg, setWantsToLoseKg] = useState(18);

  const [country, setCountry] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Handlers — all memoized, no inline functions in JSX
  const handleInteractionStart = useCallback(() => setScrollEnabled(false), []);
  const handleInteractionEnd = useCallback(() => setScrollEnabled(true), []);
  const handleSeeAll = useCallback(v => setSeeAll(v), []);
  const handleGender = useCallback(v => setGender(v), []);
  const handleBuddyAge = useCallback((mn, mx) => setBuddyAge({ min: mn, max: mx }), []);
  const handleWeightChange = useCallback((mn, mx) => {
    setCurrentWeightKg({ 
      min: weightUnit === 'lbs' ? lbsToKg(mn) : mn, 
      max: weightUnit === 'lbs' ? lbsToKg(mx) : mx 
    });
  }, [weightUnit]);
  
  const handleWeightUnit = useCallback(u => setWeightUnit(u), []);

  const handleLoseChange = useCallback((val) => {
    setWantsToLoseKg(loseUnit === 'lbs' ? lbsToKg(val) : val);
  }, [loseUnit]);
  
  const handleLoseUnit = useCallback(u => setLoseUnit(u), []);

  const handleOpenCountry = useCallback(() => setCountryModalVisible(true), []);
  const handleCloseCountry = useCallback(() => setCountryModalVisible(false), []);
  const handleSelectCountry = useCallback(val => {
    setCountry(val);
    setCountryModalVisible(false);
  }, []);
  const handleFollowing = useCallback(v => setFollowing(v), []);
  const handleFollowers = useCallback(v => setFollowers(v), []);

  const weightConfig = useMemo(() => ({
    min: weightUnit === 'lbs' ? kgToLbs(WEIGHT_MIN_KG) : WEIGHT_MIN_KG,
    max: weightUnit === 'lbs' ? kgToLbs(WEIGHT_MAX_KG) : WEIGHT_MAX_KG,
  }), [weightUnit]);

  const loseConfig = useMemo(() => ({
    min: loseUnit === 'lbs' ? kgToLbs(LOSE_MIN_KG) : LOSE_MIN_KG,
    max: loseUnit === 'lbs' ? kgToLbs(LOSE_MAX_KG) : LOSE_MAX_KG,
  }), [loseUnit]);

  const buddyAgeScale = useMemo(() => generateScaleValues(AGE_MIN, AGE_MAX, 7), []);
  const weightScale = useMemo(() => generateScaleValues(weightConfig.min, weightConfig.max, 6), [weightConfig]);
  const loseScale = useMemo(() => generateScaleValues(loseConfig.min, loseConfig.max, 7), [loseConfig]);

  const currentWeightDisplay = useMemo(() => ({
    min: weightUnit === 'lbs' ? kgToLbs(currentWeightKg.min) : currentWeightKg.min,
    max: weightUnit === 'lbs' ? kgToLbs(currentWeightKg.max) : currentWeightKg.max,
  }), [weightUnit, currentWeightKg]);

  const wantsToLoseDisplay = useMemo(() => (
    loseUnit === 'lbs' ? kgToLbs(wantsToLoseKg) : wantsToLoseKg
  ), [loseUnit, wantsToLoseKg]);

  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={styles.flex1}
      contentContainerStyle={styles.peopleContent}
    >

      {/* See All Posts */}
      <View style={styles.sectionContainer}>
        <SwitchRow
          label={t('basicInfo.seeAllPosts')}
          subLabel="Posts from the full community"
          value={seeAll}
          onValueChange={handleSeeAll}
          colors={colors}
          styles={styles}
        />
      </View>

      {/* Gender — same layout as BasicInfoScreen */}
      <View style={styles.sectionContainer}>
        <AppText variant="body" style={styles?.formLabel}>
          {t('basicInfo.genderLabel')}
        </AppText>
        <GenderButtons
          gender={gender}
          onGenderChange={handleGender}
          colors={colors}
          borderRadius={borderRadius}
          t={t}
          styles={styles}
        />
      </View>

      {/* Buddy Age */}
      <View style={styles.sectionContainer}>
        <RangeSliderSection
          label="Buddy Age"
          min={AGE_MIN} max={AGE_MAX}
          minValue={buddyAge.min} maxValue={buddyAge.max}
          onValuesChange={handleBuddyAge}
          colors={colors}
          styles={styles}
          spacing={spacing}
          onInteractionStart={handleInteractionStart}
          onInteractionEnd={handleInteractionEnd}
          bgColor={'red'}
          fixedScaleLabels={buddyAgeScale}
        />
      </View>

      {/* Current Weight */}
      <View style={styles.sectionContainer}>
        <RangeSliderSection
          label="Current Weight"
          min={weightConfig.min} max={weightConfig.max}
          minValue={currentWeightDisplay.min} maxValue={currentWeightDisplay.max}
          onValuesChange={handleWeightChange}
          unit={weightUnit}
          showUnitToggle
          onUnitChange={handleWeightUnit}
          colors={colors}
          styles={styles}
          spacing={spacing}
          onInteractionStart={handleInteractionStart}
          onInteractionEnd={handleInteractionEnd}
           bgColor={'blue'}
           fixedScaleLabels={weightScale}
        />
      </View>

      {/* Wants To Lose */}
      <View style={styles.sectionContainer}>
        <RangeSliderSection
          label="Wants To Lose"
          isRange={false}
          min={loseConfig.min} max={loseConfig.max}
          value={wantsToLoseDisplay}
          onValueChange={handleLoseChange}
          unit={loseUnit}
          showUnitToggle
          onUnitChange={handleLoseUnit}
          colors={colors}
          styles={styles}
          spacing={spacing}
          onInteractionStart={handleInteractionStart}
          onInteractionEnd={handleInteractionEnd}
          bgColor={'orange'}
          fixedScaleLabels={loseScale}
        />
      </View>

      {/* Country — same modal as BasicInfoScreen */}
      <View style={styles.sectionContainer}>
        <CountrySelector
          country={country}
          colors={colors}
          spacing={spacing}
          borderRadius={borderRadius}
          t={t}
          modalVisible={countryModalVisible}
          onOpenModal={handleOpenCountry}
          onCloseModal={handleCloseCountry}
          onSelectCountry={handleSelectCountry}
          styles={styles}
        />
      </View>

      {/* Following */}
      <View style={styles.sectionContainer}>
        <SwitchRow
          label="Following"
          subLabel="See posts from buddies you follow"
          value={following}
          onValueChange={handleFollowing}
          colors={colors}
          styles={styles}
        />
      </View>

      {/* Followers */}
      <View style={styles.sectionContainer}>
        <SwitchRow
          label="Followers"
          subLabel="See posts from buddies following your journey"
          value={followers}
          onValueChange={handleFollowers}
          colors={colors}
          styles={styles}
        />
      </View>

      {/* Apply Filter */}
      <View style={styles.footer}>
        <Button title="Apply Filter" onPress={onApply} variant="primary" />
      </View>

    </ScrollView>
  );
};

export default memo(FindMyPeopleTab);
