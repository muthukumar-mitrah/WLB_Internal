/**
 * SurveyQ9Screen — "Let's personalize your match"
 * Survey screen 9 of 9
 *
 * Displays 6 rating-type questions in scrollable cards.
 * Each card has: question text, 5 star rating, slider bar, left/right labels.
 * Star rating and slider are synced — user can tap a star or drag the slider.
 */
import React, { memo, useCallback, useMemo, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer } from '../../../components/common';
import { useSurvey } from '../../../context/SurveyContext';
import SurveyProgressBar from './SurveyProgressBar';
import { useTranslation } from '../../../i18n/useTranslation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 9;

// ─── 6 personalization questions ──────────────────────────────────────────────
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

// ─── Star constants ───────────────────────────────────────────────────────────
const STAR_COUNT = 5;
const STAR_SIZE = 30;
const STAR_GAP = 8;

// ─── Slider constants ────────────────────────────────────────────────────────
const CARD_PADDING_H = 20;
const SLIDER_MARGIN_TOP = 14;
const THUMB_SIZE = 18;
const TRACK_HEIGHT = 4;

// ─── Single Star ──────────────────────────────────────────────────────────────
const Star = memo(({ filled, onPress, size = STAR_SIZE }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }} style={{ flex: 1, justifyContent: 'space-evenly' }}>
    <Icon
      name={filled ? 'star' : 'star-outline'}
      size={size}
      color={filled ? '#F5A623' : '#D1D5DB'}
    />
  </TouchableOpacity>
));

// ─── Rating Slider Card ──────────────────────────────────────────────────────
const RatingCard = memo(({ index, question, leftLabel, rightLabel, value, onValueChange, colors }) => {
  const trackWidth = SCREEN_WIDTH - 40 - (CARD_PADDING_H * 4); // 40 = screen horizontal padding
  const thumbOffset = useRef(new Animated.Value(((value - 1) / (STAR_COUNT - 1)) * (trackWidth - THUMB_SIZE))).current;

  const updateFromPosition = useCallback((x) => {
    const clampedX = Math.max(0, Math.min(x, trackWidth - THUMB_SIZE));
    const ratio = clampedX / (trackWidth - THUMB_SIZE);
    const starValue = Math.round(ratio * (STAR_COUNT - 1)) + 1;
    onValueChange(starValue);
    // Snap to star position
    const snappedX = ((starValue - 1) / (STAR_COUNT - 1)) * (trackWidth - THUMB_SIZE);
    Animated.spring(thumbOffset, {
      toValue: snappedX,
      useNativeDriver: false,
      friction: 8,
      tension: 100,
    }).start();
  }, [trackWidth, onValueChange, thumbOffset]);

  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        thumbOffset.setOffset(thumbOffset._value);
        thumbOffset.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        const newX = thumbOffset._offset + gesture.dx;
        const clampedX = Math.max(0, Math.min(newX, trackWidth - THUMB_SIZE));
        thumbOffset.setOffset(0);
        thumbOffset.setValue(clampedX);
      },
      onPanResponderRelease: (_, gesture) => {
        const currentVal = thumbOffset._value;
        thumbOffset.flattenOffset();
        updateFromPosition(currentVal);
      },
    }),
    [trackWidth, thumbOffset, updateFromPosition]);

  const handleStarPress = useCallback((starIndex) => {
    const newValue = starIndex + 1;
    onValueChange(newValue);
    const snappedX = ((newValue - 1) / (STAR_COUNT - 1)) * (trackWidth - THUMB_SIZE);
    Animated.spring(thumbOffset, {
      toValue: snappedX,
      useNativeDriver: false,
      friction: 8,
      tension: 100,
    }).start();
  }, [onValueChange, trackWidth, thumbOffset]);

  // Filled track width (animated)
  const filledWidth = thumbOffset.interpolate({
    inputRange: [0, trackWidth - THUMB_SIZE],
    outputRange: [THUMB_SIZE / 2, trackWidth - THUMB_SIZE / 2],
    extrapolate: 'clamp',
  });

  return (
    <View style={[cardStyles.card, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}>
      {/* Question text */}
      <AppText variant="bodyMedium" color={colors.textPrimary} style={cardStyles.questionText}>
        {index + 1}. {question}
      </AppText>
      <View style={cardStyles.ratingWrapper}>
        {/* Stars */}
        <View style={cardStyles.starsRow}>
          {Array.from({ length: STAR_COUNT }).map((_, i) => (
            <Star
              key={i}
              filled={i < value}
              onPress={() => handleStarPress(i)}
            />
          ))}
        </View>

        {/* Slider */}
        <View style={[cardStyles.sliderContainer, { width: trackWidth }]}>
          {/* Background track */}
          <View
            style={[
              cardStyles.track,
              {
                backgroundColor: colors.primary,
                width: trackWidth,
              },
            ]}
          />

          {/* Filled track */}
          <Animated.View
            style={[
              cardStyles.filledTrack,
              {
                backgroundColor: colors.primary,
                width: filledWidth,
              },
            ]}
          />

          {/* Thumb */}
          <Animated.View
            style={[
              cardStyles.thumbContainer,
              {
                transform: [{ translateX: thumbOffset }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View
              style={[
                cardStyles.thumbOuter,
                { backgroundColor: `${colors.primary}30` },
              ]}
            >
              <View
                style={[
                  cardStyles.thumb,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.white,
                  },
                ]}
              />
            </View>
          </Animated.View>
        </View>
      </View>
      {/* Labels */}
      <View style={cardStyles.labelsRow}>
        <AppText variant="bodySmall" color={colors.textSecondary} style={cardStyles.labelText}>
          {leftLabel}
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary} style={[cardStyles.labelText, cardStyles.rightLabelText]}>
          {rightLabel}
        </AppText>
      </View>
    </View>
  );
});

// ─── Screen ───────────────────────────────────────────────────────────────────
const SurveyQ9Screen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  // Initialize ratings from surveyData or each question's default.
  const initialRatings = surveyData.personalizationRatings || {};
  const [ratings, setRatings] = useState(() => {
    const initial = {};
    PERSONALIZATION_QUESTIONS.forEach(q => {
      initial[q.id] = initialRatings[q.id] || q.defaultValue || 3;
    });
    return initial;
  });

  const handleRatingChange = useCallback((questionId, value) => {
    setRatings(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('personalizationRatings', ratings);
    // TODO: Navigate to next screen or finish
    // navigation.navigate(ROUTES.SURVEY_COMPLETE);
  }, [ratings, setSurveyAnswer]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('personalizationRatings', ratings);
    navigation.goBack();
  }, [ratings, setSurveyAnswer, navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={screenStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />

      {/* ═══ HEADER ═══ */}
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

      {/* ═══ TITLE ═══ */}
      <AppText variant="h3" color={colors.textPrimary} style={screenStyles.title}>
        {t('survey.q9.title')}
      </AppText>

      {/* ═══ SCROLLABLE CARDS ═══ */}
      <ScrollView
        style={screenStyles.scrollView}
        contentContainerStyle={[screenStyles.scrollContent, { paddingHorizontal: spacing[5], paddingBottom: spacing[5] }]}
        showsVerticalScrollIndicator={false}
      >
        {PERSONALIZATION_QUESTIONS.map((q, index) => (
          <RatingCard
            key={q.id}
            index={index}
            question={t(q.questionKey)}
            leftLabel={t(q.leftLabelKey)}
            rightLabel={t(q.rightLabelKey)}
            value={ratings[q.id]}
            onValueChange={(val) => handleRatingChange(q.id, val)}
            colors={colors}
          />
        ))}
      </ScrollView>

      {/* ═══ BOTTOM BUTTONS ═══ */}
      <View style={[screenStyles.bottomRow, { paddingHorizontal: spacing[5], paddingBottom: spacing[5], paddingTop: spacing[3], borderTopColor: colors.divider }]}>
        <Button
          title={t('common.buttons.previous')}
          onPress={handlePrevious}
          variant="outline"
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
});

// ─── Card styles ──────────────────────────────────────────────────────────────
const cardStyles = StyleSheet.create({
  card: {
    borderWidth: 1.2,
    borderRadius: 16,
    paddingHorizontal: CARD_PADDING_H,
    paddingTop: 20,
    paddingBottom: 18,
    marginBottom: 14,
  },
  questionText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: STAR_GAP,
    marginBottom: SLIDER_MARGIN_TOP,
  },
  sliderContainer: {
    height: THUMB_SIZE + 12,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    opacity: 0.15,
  },
  filledTrack: {
    position: 'absolute',
    left: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumbContainer: {
    position: 'absolute',
    width: THUMB_SIZE + 16,
    height: THUMB_SIZE + 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -(16 / 2),
  },
  thumbOuter: {
    width: THUMB_SIZE + 12,
    height: THUMB_SIZE + 12,
    borderRadius: (THUMB_SIZE + 12) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 3,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  labelText: {
    fontSize: 11,
    lineHeight: 15,
    maxWidth: '45%',
  },
  rightLabelText: {
    textAlign: 'right',
  },
  ratingWrapper: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: STAR_GAP,
    marginBottom: 16,
    width: '100%',
  },
});

export default memo(SurveyQ9Screen);
