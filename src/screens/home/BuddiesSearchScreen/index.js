import React, { memo, useMemo, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import {
  AppText,
  SafeContainer,
  Header,
  InputBox,
  Button,
  ToastService,
} from '../../../components/common';
import {
  GenderButtons,
  RangeSliderSection,
  CountrySelector,
  generateScaleValues,
} from '../../../components/common/BuddyFilters';
import { useTranslation } from '../../../i18n/useTranslation';
import { ROUTES, APP_IMAGES } from '../../../constants';
import { kgToLbs, lbsToKg } from '../../../utils/weightUtils';
import createStyles from './styles';

const AGE_MIN = 18;
const AGE_MAX = 75;

const WEIGHT_MIN_KG = 36;
const WEIGHT_MAX_KG = 127;

const LOSE_MIN_KG = 2;
const LOSE_MAX_KG = 27;

const SUPPORT_TYPES = [
  'dailyCheckIns',
  'beginnerFriendly',
  'similarGoals',
  'walkingBuddy',
  'nonJudgmental',
  'mealSupport',
  'motivation',
];

const FindSupportiveBuddiesScreen = () => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows }),
    [colors, spacing, borderRadius, shadows]
  );

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('All');
  const [buddyAge, setBuddyAge] = useState({ min: 25, max: 45 });
  const [country, setCountry] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedSupportTypes, setSelectedSupportTypes] = useState([]);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);

  const [weightUnit, setWeightUnit] = useState('lbs');
  const [currentWeightKg, setCurrentWeightKg] = useState({ min: 78, max: 111 });

  const [loseUnit, setLoseUnit] = useState('lbs');
  const [wantsToLoseKg, setWantsToLoseKg] = useState(18);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleInteractionStart = useCallback(() => setScrollEnabled(false), []);
  const handleInteractionEnd = useCallback(() => setScrollEnabled(true), []);

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

  const toggleSupportType = useCallback((type) => {
    setSelectedSupportTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  const toggleAdvanced = useCallback(() => setAdvancedExpanded(prev => !prev), []);

  const handleShowMatches = useCallback(() => {
    navigation.navigate(ROUTES.BUDDY_SEARCH_RESULT);
  }, [navigation]);

  const handleAiSuggest = useCallback(() => {
    ToastService.show({
      type: 'info',
      title: 'Coming Soon',
      message: 'AI Suggestions will be available soon!',
    });
  }, []);

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
    <SafeContainer edges={['top']} style={styles.container}>
      <Header
        title={t('buddiesSearch.title')}
        onBack={() => navigation.goBack()}
        showDivider
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Search */}
          <View style={styles.headerSearchContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={t('buddiesSearch.searchPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                value={search}
                onChangeText={setSearch}
              />
              <TouchableOpacity style={styles.searchIcon} onPress={() => {
                ToastService.show({
                  type: 'info',
                  message: 'Coming Soon',
                });
              }}>
                <IonIcon name="search-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.sectionContainer}>
            <AppText style={styles.formLabel}>{t('basicInfo.genderLabel')}</AppText>
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
              fixedScaleLabels={buddyAgeScale}
            />
          </View>

          {/* Country */}
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

          {/* Support Type */}
          <View style={styles.sectionContainer}>
            <AppText style={styles.formLabel}>{t('buddiesSearch.supportTypeTitle')}</AppText>
            <View style={styles.chipGrid}>
              {SUPPORT_TYPES.map(type => {
                const isSelected = selectedSupportTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleSupportType(type)}
                    activeOpacity={0.7}
                  >
                    <AppText style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {t(`buddiesSearch.supportTypes.${type}`)}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Advanced Settings */}
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={toggleAdvanced}
            activeOpacity={0.7}
          >
            <AppText style={styles.accordionTitle}>{t('buddiesSearch.advancedSettings')}</AppText>
            <IonIcon
              name={advancedExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          
          {advancedExpanded && (
            <View style={styles.accordionContent}>
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
                  fixedScaleLabels={loseScale}
                />
              </View>
            </View>
          )}

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Button
              title={t('buddiesSearch.showMatches')}
              onPress={handleShowMatches}
              variant="primary"
            />
            
            <TouchableOpacity
              style={styles.robiCard}
              onPress={handleAiSuggest}
              activeOpacity={0.8}
            >
              <Image
                source={APP_IMAGES.robi}
                style={styles.robiCardIcon}
                resizeMode="contain"
              />
              <AppText style={styles.robiCardText}>{t('buddiesSearch.robiSuggestTitle')}</AppText>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

export default memo(FindSupportiveBuddiesScreen);
