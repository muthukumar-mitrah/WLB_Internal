/**
 * SurveyQ1Screen — "What's your main goal right now?"
 * Survey screen 1 of 10+
 *
 * Layout: two-section (topSection = illustration, bottomSection = content).
 * Styles come from ./styles.js.
 */
import React, { memo, useCallback, useMemo } from 'react';
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
import { createSurveyStyles, q1OptionStyles } from './styles';

const TOTAL_QUESTIONS  = 9;
const CURRENT_QUESTION = 1;

const GOAL_OPTIONS = [
  { value: 'lose_weight',     labelKey: 'survey.q1.loseWeight' },
  { value: 'stay_consistent', labelKey: 'survey.q1.stayConsistent' },
  { value: 'get_healthier',   labelKey: 'survey.q1.getHealthier' },
  { value: 'maintain_weight', labelKey: 'survey.q1.maintainWeight' },
];

// ─── Option Row ───────────────────────────────────────────────────────────────
const OptionRow = memo(({ label, selected, onPress, colors, borderRadius }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      q1OptionStyles.row,
      {
        borderRadius: borderRadius.lg,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: colors.background,
      },
    ]}
  >
    <AppText
      variant="bodyMedium"
      color={selected ? colors.textPrimary : colors.textSecondary}
      style={q1OptionStyles.label}
    >
      {label}
    </AppText>
    <View
      style={[
        q1OptionStyles.radio,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primary : colors.background,
        },
      ]}
    >
      {selected && <Icon name="checkmark" size={12} color={colors.white} />}
    </View>
  </TouchableOpacity>
));

// ─── Screen ───────────────────────────────────────────────────────────────────
const SurveyQ1Screen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );

  const selectedGoal = surveyData.mainGoal;

  const handleSelect = useCallback(
    value => setSurveyAnswer('mainGoal', value),
    [setSurveyAnswer],
  );

  const handleNext = useCallback(() => {
    navigation.navigate(ROUTES.SURVEY_Q2);
  }, [navigation]);

  const handlePrevious = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
            source={require('../../../assets/images/survey_1.png')}
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
          {t('survey.q1.question')}
        </AppText>

        <View>
          {GOAL_OPTIONS.map(option => (
            <OptionRow
              key={option.value}
              label={t(option.labelKey)}
              selected={selectedGoal === option.value}
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
          variant="outline"
          size="lg"
          style={styles.halfBtn}
        />
        <Button
          title={t('common.buttons.next')}
          onPress={handleNext}
          variant="primary"
          size="lg"
          disabled={!selectedGoal}
          style={styles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

export default memo(SurveyQ1Screen);
