import { memo, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { useSurvey } from '../../../context/SurveyContext';
import { AppText, SafeContainer, Header, RatingCard } from '../../../components/common';
import createStyles from './styles';
import { ROUTES } from '../../../constants';

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
  },
  {
    id: 'checkInImportance',
    questionKey: 'survey.q9.q5',
    leftLabelKey: 'survey.q9.q5Left',
    rightLabelKey: 'survey.q9.q5Right',
  },
  {
    id: 'emotionalSupport',
    questionKey: 'survey.q9.q6',
    leftLabelKey: 'survey.q9.q6Left',
    rightLabelKey: 'survey.q9.q6Right',
  },
];

const PortraitViewScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing, borderRadius, isDark } = useTheme();
  const { t } = useTranslation();
  const { surveyData } = useSurvey();

  const [activeTab, setActiveTab] = useState('journey');

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius]
  );

  const handleEditPortrait = useCallback(() => {
    navigation.navigate(ROUTES.EDIT_VIEW_PORTRAIT);
  }, [navigation]);

  const getGoalLabel = useCallback((val) => {
    if (!val) return '—';
    const map = {
      loseWeight: t('survey.q1.loseWeight'),
      stayConsistent: t('survey.q1.stayConsistent'),
      getHealthier: t('survey.q1.getHealthier'),
      maintainWeight: t('survey.q1.maintainWeight'),
    };
    return map[val] || val;
  }, [t]);

  const getCommitmentLabel = useCallback((val) => {
    if (!val) return '—';
    const map = {
      very_committed: t('survey.q3.veryCommitted'),
      pretty_committed: t('survey.q3.prettyCommitted'),
      getting_started: t('survey.q3.gettingStarted'),
    };
    return map[val] || val;
  }, [t]);

  const getBuddyLabel = useCallback((val) => {
    if (!val) return '—';
    const map = {
      mentor: t('survey.q4.mentor'),
      partner: t('survey.q4.partner'),
      cheerleader: t('survey.q4.cheerleader'),
    };
    return map[val] || val;
  }, [t]);

  const getCommunicationLabel = useCallback((val) => {
    if (!val) return '—';
    const map = {
      supportive: t('survey.q5.supportive'),
      balanced: t('survey.q5.balanced'),
      direct: t('survey.q5.direct'),
    };
    return map[val] || val;
  }, [t]);

  const getFrequencyLabel = useCallback((val) => {
    if (!val) return '—';
    const map = {
      daily: t('survey.q6.daily'),
      fewTimes: t('survey.q6.fewTimes'),
      onceWeek: t('survey.q6.onceWeek'),
    };
    return map[val] || val;
  }, [t]);

  const getGenderLabel = useCallback((val) => {
    if (!val) return '—';
    const map = {
      noPreference: t('survey.q7.noPreference'),
      male: t('survey.q7.male'),
      female: t('survey.q7.female'),
    };
    return map[val] || val;
  }, [t]);

  const getAgeRangeLabel = useCallback((val) => {
    if (!val || typeof val.min === 'undefined' || typeof val.max === 'undefined') return '—';
    return t('survey.q9.ageRangeLabel', { min: val.min, max: val.max });
  }, [t]);

  const getPoundsLabel = useCallback((val) => {
    if (typeof val === 'undefined' || val === null) return '—';
    return t('survey.q9.poundsToLoseLabel', { count: val });
  }, [t]);

  const mainGoal = surveyData?.mainGoal ?? 'loseWeight';
  const poundsToLose = surveyData?.poundsToLose ?? 25;
  const commitmentLevel = surveyData?.commitmentLevel ?? 'very_committed';
  const buddyType = surveyData?.buddyType ?? 'mentor';
  const communicationStyle = surveyData?.communicationStyle ?? 'supportive';
  const checkInFrequency = surveyData?.checkInFrequency ?? 'daily';
  const genderPreference = surveyData?.genderPreference ?? 'noPreference';
  const ageRange = useMemo(() => surveyData?.ageRange ?? { min: 30, max: 50 }, [surveyData?.ageRange]);

  const journeyQuestions = useMemo(() => [
    {
      id: 1,
      question: t('survey.q1.question'),
      answer: getGoalLabel(mainGoal),
    },
    {
      id: 2,
      question: t('survey.q2.question'),
      answer: getPoundsLabel(poundsToLose),
    },
    {
      id: 3,
      question: t('survey.q3.question'),
      answer: getCommitmentLabel(commitmentLevel),
    },
    {
      id: 4,
      question: t('survey.q4.question'),
      answer: getBuddyLabel(buddyType),
    },
    {
      id: 5,
      question: t('survey.q5.question'),
      answer: getCommunicationLabel(communicationStyle),
    },
    {
      id: 6,
      question: t('survey.q6.question'),
      answer: getFrequencyLabel(checkInFrequency),
    },
    {
      id: 7,
      question: t('survey.q7.question'),
      answer: getGenderLabel(genderPreference),
    },
    {
      id: 8,
      question: t('survey.q8.questionPortrait'),
      answer: getAgeRangeLabel(ageRange),
    },
  ], [
    mainGoal,
    poundsToLose,
    commitmentLevel,
    buddyType,
    communicationStyle,
    checkInFrequency,
    genderPreference,
    ageRange,
    t,
    getGoalLabel,
    getPoundsLabel,
    getCommitmentLabel,
    getBuddyLabel,
    getCommunicationLabel,
    getFrequencyLabel,
    getGenderLabel,
    getAgeRangeLabel,
  ]);

  const ratings = useMemo(() => {
    const r = surveyData?.personalizationRatings || {};
    return {
      motivation: r.motivation ?? 3,
      consistency: r.consistency ?? 3,
      accountability: r.accountability ?? 0,
      sharingHonesty: r.sharingHonesty ?? 5,
      checkInImportance: r.checkInImportance ?? 3,
      emotionalSupport: r.emotionalSupport ?? 4,
    };
  }, [surveyData]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <Header title={t("profile.header.viewPortrait")} showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Portrait Card */}
        <View style={styles.portraitCard}>
          <AppText variant="title" color={colors.gray100} style={styles.portraitCardTitle}>
            Your Portrait
          </AppText>
          <AppText variant="bodySmall" style={styles.portraitCardSubtitle}>
            A quick summary of your goals, progress and support preferences.
          </AppText>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={handleEditPortrait}
          >
            <AppText variant="bodyMedium" style={styles.editBtnText}>
              Edit Portrait
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'journey' && (isDark ? styles.tabBtnActiveDark : styles.tabBtnActive)]}
            onPress={() => setActiveTab('journey')}
          >
            <AppText
              variant="bodySmall"
              color={activeTab === 'journey' ? isDark ? colors.primary : colors.primaryDeep : colors.textSecondary}
              style={[activeTab === 'journey' && styles.tabText]}
            >
              Journey Answers
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'readiness' && (isDark ? styles.tabBtnActiveDark : styles.tabBtnActive)]}
            onPress={() => setActiveTab('readiness')}
          >
            <AppText
              variant="bodySmall"
              color={activeTab === 'readiness' ? isDark ? colors.primary : colors.primaryDeep : colors.textSecondary}
              style={[activeTab === 'readiness' && styles.tabText]}
            >
              Readiness Ratings
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.listContainer}>
          {activeTab === 'journey' ? (
            journeyQuestions.map((q) => (
              <View key={q.id} style={styles.cardItem}>
                <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.questionText}>
                  {q.id}. {q.question}
                </AppText>
                <AppText variant="body" color={colors.textSecondary}>
                  {q.answer}
                </AppText>
              </View>
            ))
          ) : (
            PERSONALIZATION_QUESTIONS.map((q, idx) => (
              <RatingCard
                key={q.id}
                questionNumber={idx + 1}
                question={t(q.questionKey)}
                leftLabel={t(q.leftLabelKey)}
                rightLabel={t(q.rightLabelKey)}
                rating={ratings[q.id] ?? 0}
                showSlider={false}
                readOnly={true}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(PortraitViewScreen);
