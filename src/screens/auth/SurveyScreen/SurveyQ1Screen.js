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
import { createSurveyStyles, createQ1OptionStyles } from './styles';

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 1;

const GOAL_OPTIONS = [
  { value: 'lose_weight', labelKey: 'survey.q1.loseWeight' },
  { value: 'stay_consistent', labelKey: 'survey.q1.stayConsistent' },
  { value: 'get_healthier', labelKey: 'survey.q1.getHealthier' },
  { value: 'maintain_weight', labelKey: 'survey.q1.maintainWeight' },
];

// ─── Option Row ───────────────────────────────────────────────────────────────
const OptionRow = memo(({ label, selected, onPress, optStyles }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        selected ? optStyles.rowSelected : optStyles.rowDefault,
      ]}
    >
      <AppText
        style={[
          optStyles.label,
          { color: selected ? colors.textPrimary : colors.textSecondary },
        ]}
      >
        {label}
      </AppText>
      {selected && (
        <Icon name="checkmark-circle" size={22} color={colors.primary} />
      )}
    </TouchableOpacity>
  )
});

// ─── Screen ───────────────────────────────────────────────────────────────────
const SurveyQ1Screen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );
  const isDark = useTheme().isDark;
  const surveyQ1Image = isDark ? require('../../../assets/images/survey_1_dark.png') : require('../../../assets/images/survey_1.png')

  const optStyles = useMemo(
    () => StyleSheet.create({ ...createQ1OptionStyles({ colors }) }),
    [colors],
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
      <ScrollView
        style={styles.bottomSection}
        contentContainerStyle={styles.bottomContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={surveyQ1Image}
          style={styles.illustration}
          resizeMode="contain"
        />
        <AppText variant="title" color={colors.textPrimary}>
          {t('survey.q1.question')}
        </AppText>
        <View style={{ marginTop: 10 }}>
          {GOAL_OPTIONS.map(option => (
            <OptionRow
              key={option.value}
              label={t(option.labelKey)}
              selected={selectedGoal === option.value}
              onPress={() => handleSelect(option.value)}
              optStyles={optStyles}
            />
          ))}
        </View>
      </ScrollView>
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
          disabled={!selectedGoal}
          style={styles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

export default memo(SurveyQ1Screen);
