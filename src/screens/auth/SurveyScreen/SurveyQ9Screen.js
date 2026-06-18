/**
 * SurveyQ9Screen — "Let's personalize your match"
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer, RatingCard } from '../../../components/common';
import { useSurvey } from '../../../context/SurveyContext';
import SurveyProgressBar from './SurveyProgressBar';
import { useTranslation } from '../../../i18n/useTranslation';
import { ROUTES } from '../../../constants';
import { createSurveyStyles } from './styles';

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 9;

const PERSONALIZATION_QUESTIONS = [
  {
    id: 'motivation',
    questionKey: 'survey.q9.q1',
    leftLabelKey: 'survey.q9.q1Left',
    rightLabelKey: 'survey.q9.q1Right',
  },
  {
    id: 'consistency',
    questionKey: 'survey.q9.q2',
    leftLabelKey: 'survey.q9.q2Left',
    rightLabelKey: 'survey.q9.q2Right',
  },
  {
    id: 'accountability',
    questionKey: 'survey.q9.q3',
    leftLabelKey: 'survey.q9.q3Left',
    rightLabelKey: 'survey.q9.q3Right',
  },
  {
    id: 'sharingHonesty',
    questionKey: 'survey.q9.q4',
    leftLabelKey: 'survey.q9.q4Left',
    rightLabelKey: 'survey.q9.q4Right',
    defaultValue: 5,
  },
  {
    id: 'checkInImportance',
    questionKey: 'survey.q9.q5',
    leftLabelKey: 'survey.q9.q5Left',
    rightLabelKey: 'survey.q9.q5Right',
    defaultValue: 3,
  },
  {
    id: 'emotionalSupport',
    questionKey: 'survey.q9.q6',
    leftLabelKey: 'survey.q9.q6Left',
    rightLabelKey: 'survey.q9.q6Right',
    defaultValue: 4,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
const SurveyQ9Screen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const initialRatings = surveyData.personalizationRatings || {};
  const [ratings, setRatings] = useState(() => {
    const initial = {};
    PERSONALIZATION_QUESTIONS.forEach(q => {
      initial[q.id] = initialRatings[q.id] ?? (q.defaultValue ?? 3);
    });
    return initial;
  });

  const styles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );

  const handleRatingChange = useCallback((questionId, val) => {
    setRatings(prev => ({ ...prev, [questionId]: val }));
  }, []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('personalizationRatings', ratings);
    navigation.navigate(ROUTES.MATCH_LOADING);
  }, [ratings, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('personalizationRatings', ratings);
    navigation.goBack();
  }, [ratings, setSurveyAnswer, navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[screenStyles.header, { paddingHorizontal: spacing[4], paddingTop: spacing[3], paddingBottom: spacing[2] }]}>
        <TouchableOpacity
          onPress={handlePrevious}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={screenStyles.backBtn}
        >
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <SurveyProgressBar total={TOTAL_QUESTIONS} current={CURRENT_QUESTION} />
        <View style={screenStyles.backBtn} />
      </View>
      <ScrollView
        style={screenStyles.scrollView}
        contentContainerStyle={[screenStyles.scrollContent, { paddingHorizontal: spacing[5], paddingBottom: spacing[5] }]}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="title" color={colors.textPrimary} style={screenStyles.textCenter}>
          {t('survey.q9.title')}
        </AppText>

        {PERSONALIZATION_QUESTIONS.map((q, idx) => (
          <RatingCard
            key={q.id}
            questionNumber={idx + 1}
            question={t(q.questionKey)}
            leftLabel={t(q.leftLabelKey)}
            rightLabel={t(q.rightLabelKey)}
            rating={ratings[q.id]}
            onRatingChange={(val) => handleRatingChange(q.id, val)}
            showSlider={true}
            readOnly={false}
          />
        ))}
      </ScrollView>
      <View style={[styles.bottomRow, { paddingHorizontal: spacing[5], paddingBottom: spacing[5], paddingTop: spacing[3], borderTopColor: colors.divider }]}>
        <Button
          title={t('common.buttons.previous')}
          onPress={handlePrevious}
          variant="gray"
          size="lg"
          style={screenStyles.halfBtn}
        />
        <Button
          title={t('common.buttons.next')}
          onPress={handleNext}
          variant="primary"
          size="lg"
          style={screenStyles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

// ─── Screen styles ────────────────────────────────────────────────────────────
const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  halfBtn: {
    flex: 1,
  },
  textCenter: {
    textAlign: 'center',
    marginBottom: 15
  }
});

export default memo(SurveyQ9Screen);
