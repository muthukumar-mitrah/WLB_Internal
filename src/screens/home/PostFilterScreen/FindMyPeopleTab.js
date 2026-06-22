/**
 * FindMyPeopleTab — Filter By People tab.
 *
 * Reuses the same Gender buttons and Country modal pattern as BasicInfoScreen.
 */
import React, {
  memo,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { View,  ScrollView } from 'react-native';
import { useTheme } from '../../../theme';
import { AppText, Button } from '../../../components/common';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';
import { kgToLbs, lbsToKg } from '../../../utils/weightUtils';
import {
  generateScaleValues,
  SwitchRow,
  GenderButtons,
  RangeSliderSection,
  CountrySelector
} from '../../../components/common/BuddyFilters';

const AGE_MIN = 18;
const AGE_MAX = 75;

const WEIGHT_MIN_KG = 36;
const WEIGHT_MAX_KG = 127;

const LOSE_MIN_KG = 2;
const LOSE_MAX_KG = 27;


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
