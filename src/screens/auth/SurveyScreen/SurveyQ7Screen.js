/**
 * SurveyQ7Screen — "Do you have a gender preference?"
 * Survey screen 7 of 10+
 *
 * Layout: two-section (topSection = illustration, bottomSection = content).
 * Styles come from ./styles.js.
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer } from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useSurvey } from '../../../context/SurveyContext';
import SurveyProgressBar from './SurveyProgressBar';
import { useTranslation } from '../../../i18n/useTranslation';
import { radioOptionStyles, createSurveyStyles } from './styles';

const TOTAL_QUESTIONS  = 9;
const CURRENT_QUESTION = 7;

const GENDER_OPTIONS = [
  { value: 'none',   labelKey: 'survey.q7.noPreference' },
  { value: 'male',   labelKey: 'survey.q7.male' },
  { value: 'female', labelKey: 'survey.q7.female' },
];

// ─── Option Row ───────────────────────────────────────────────────────────────
const OptionRow = memo(({ label, selected, onPress, colors, borderRadius }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      radioOptionStyles.row,
      {
        borderRadius: borderRadius.lg,
         borderColor: selected ? '#3685C6' : colors.border,
        backgroundColor: selected ? '#EBF3F9' : colors.background,
      },
    ]}
  >
    <AppText
      variant="bodyMedium"
      color={colors.textSecondary}
      style={radioOptionStyles.label}
    >
      {label}
    </AppText>
    <View
      style={[
        selected ? radioOptionStyles.radio : '',
        {
          borderColor: selected ? '#3179B4' : colors.border,
          backgroundColor: selected ? '#3179B4' : colors.background,
        },
      ]}
    >
      {selected && <Icon name="checkmark" size={12} color={colors.white} />}
    </View>
  </TouchableOpacity>
));

// ─── Screen ───────────────────────────────────────────────────────────────────
const SurveyQ7Screen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );

  const initialIndex = GENDER_OPTIONS.findIndex(
    o => o.value === surveyData.genderPreference,
  );
  const [selectedValue, setSelectedValue] = useState(
    initialIndex >= 0 ? GENDER_OPTIONS[initialIndex].value : GENDER_OPTIONS[0].value,
  );

  const handleSelect = useCallback(value => setSelectedValue(value), []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('genderPreference', selectedValue);
    navigation.navigate(ROUTES.SURVEY_Q8);
  }, [selectedValue, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('genderPreference', selectedValue);
    navigation.goBack();
  }, [selectedValue, setSurveyAnswer, navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundSecondary} translucent={false} />

      {/* ═══ TOP SECTION — light-gray background ═══ */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handlePrevious}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backBtn}
          >
            <Icon name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <SurveyProgressBar total={TOTAL_QUESTIONS} current={CURRENT_QUESTION} />
          <View style={styles.backBtn} />
        </View>

        <View style={styles.illustrationArea}>
          <Image
            source={require('../../../assets/images/survey_7.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* ═══ BOTTOM SECTION — white ═══ */}
      <ScrollView
        style={styles.bottomSection}
        contentContainerStyle={styles.bottomContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h3" color={colors.textPrimary} style={styles.question}>
          {t('survey.q7.question')}
        </AppText>

        <View style={{ marginTop: 20 }}>
          {GENDER_OPTIONS.map(option => (
            <OptionRow
              key={option.value}
              label={t(option.labelKey)}
              selected={selectedValue === option.value}
              onPress={() => handleSelect(option.value)}
              colors={colors}
              borderRadius={borderRadius}
            />
          ))}
        </View>
      </ScrollView>

      {/* ═══ BOTTOM BUTTONS ═══ */}
      <View style={styles.bottomRow}>
        <Button
          title={t('common.buttons.previous')}
          onPress={handlePrevious}
          variant="gray"
          size="lg"
          style={styles.halfBtn}
        />
        <Button
          title={t('common.buttons.next')}
          onPress={handleNext}
          variant="primary"
          size="lg"
          style={styles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

export default memo(SurveyQ7Screen);
