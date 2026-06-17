/**
 * SurveyQ9Screen — "Let's personalize your match"
 */
import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
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
import { ROUTES } from '../../../constants';
import { createSurveyStyles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 9;

const TRIANGLE_W = 6;
const TRIANGLE_H = 8;
const TRIANGLE_GAP = 2;

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

const STAR_COUNT = 5;
const STAR_SIZE = 25;

const CARD_H_PAD = 12;
const WRAPPER_H_PAD = 16;

const SCROLL_H_PAD = 20;

const CONTENT_W = SCREEN_WIDTH - SCROLL_H_PAD * 2 - CARD_H_PAD * 2 - WRAPPER_H_PAD * 2;

const TRACK_HEIGHT = 4;
const THUMB_SIZE = 20;
const THUMB_BORDER = 3;
const GLOW_SIZE = THUMB_SIZE + 10;
const THUMB_TRAVEL = CONTENT_W - THUMB_SIZE;

const starX = (starIdx) =>
  (starIdx / (STAR_COUNT - 1)) * THUMB_TRAVEL;

const starCentreX = (starIdx) => starX(starIdx) + THUMB_SIZE / 2;

const HALF_STEP = THUMB_TRAVEL / (STAR_COUNT - 1) / 2;

const xToValue = (x) => {
  const clampedX = Math.max(0, Math.min(x, THUMB_TRAVEL));
  return Math.max(1, Math.round((clampedX / THUMB_TRAVEL) * (STAR_COUNT - 1)) + 1); // 1..5
};

const valueToX = (value) => {
  if(value <= 0) return 0;
  return starX(value - 1);
};

const Star = memo(({ filled, onPress, centreX, size = STAR_SIZE }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
    style={[
      cardStyles.starBtn,
      {
        position: 'absolute',
        left: centreX - size / 2,
        width: size,
        height: size,
      },
    ]}
  >
    <Icon
      name={filled ? 'star' : 'star-outline'}
      size={size}
      color={filled ? '#F5A623' : '#D1D5DB'}
    />
  </TouchableOpacity>
));

const RatingCard = memo(({ index, question, leftLabel, rightLabel, value, onValueChange, colors }) => {
  const thumbX = useRef(new Animated.Value(valueToX(value))).current;
  const currentValue = useRef(value);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if(!isDragging.current) {
      currentValue.current = value;
      thumbX.setValue(valueToX(value));
    }
  }, [value, thumbX]);

  const snapToValue = useCallback((newValue) => {
    const clamped = Math.max(1, Math.min(newValue, STAR_COUNT));
    currentValue.current = clamped;
    onValueChange(clamped);
    Animated.spring(thumbX, {
      toValue: valueToX(clamped),
      useNativeDriver: false,
      friction: 8,
      tension: 120,
    }).start();
  }, [onValueChange, thumbX]);

  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        isDragging.current = true;
        dragStartX.current = valueToX(currentValue.current);
      },

      onPanResponderMove: (_, gestureState) => {
        const nextX = Math.max(0, Math.min(dragStartX.current + gestureState.dx, THUMB_TRAVEL));
        thumbX.setValue(nextX);
      },

      onPanResponderRelease: (_, gestureState) => {
        isDragging.current = false;
        const rawX = Math.max(0, Math.min(dragStartX.current + gestureState.dx, THUMB_TRAVEL));
        snapToValue(xToValue(rawX));
      },

      onPanResponderTerminate: (_, gestureState) => {
        isDragging.current = false;
        const rawX = Math.max(0, Math.min(dragStartX.current + gestureState.dx, THUMB_TRAVEL));
        snapToValue(xToValue(rawX));
      },
    }),
    [snapToValue, thumbX],
  );

  const handleStarPress = useCallback((starIdx) => {
    snapToValue(starIdx + 1);
  }, [snapToValue]);

  const filledWidth = thumbX.interpolate({
    inputRange: [0, THUMB_TRAVEL],
    outputRange: [THUMB_SIZE / 2, THUMB_TRAVEL + THUMB_SIZE / 2],
    extrapolate: 'clamp',
  });

  const starCentres = useMemo(
    () => Array.from({ length: STAR_COUNT }, (_, i) => starCentreX(i)),
    [],
  );

  return (
    <View style={[cardStyles.card, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}>
      <AppText variant="bodyMedium" color={colors.textPrimary}>
        {index + 1}. {question}
      </AppText>

      <View style={[cardStyles.ratingWrapper, { backgroundColor: colors.background }]}>
        <View style={cardStyles.starsRow}>
          {starCentres.map((cx, i) => (
            <Star
              key={i}
              filled={i < value}
              onPress={() => handleStarPress(i)}
              centreX={cx}
              size={STAR_SIZE}
            />
          ))}
        </View>
        <View style={cardStyles.sliderOuter}>
          <View
            style={[
              cardStyles.track,
              { backgroundColor: colors.primary },
            ]}
          />
          <Animated.View
            style={[
              cardStyles.filledTrack,
              { backgroundColor: colors.primary, width: filledWidth },
            ]}
          />
          <Animated.View
            style={[
              cardStyles.indicatorWrapper,
              { left: -(GLOW_SIZE / 2 - THUMB_SIZE / 2), transform: [{ translateX: thumbX }] },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={[cardStyles.triangle, { borderBottomColor: colors.primary }]} />

            <View style={[cardStyles.glow, { backgroundColor: `${colors.primary}30` }]} />

            <View
              style={[
                cardStyles.thumb,
                { backgroundColor: colors.primary, borderColor: colors.white },
              ]}
            />
          </Animated.View>
        </View>
      </View>
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
            index={idx}
            question={t(q.questionKey)}
            leftLabel={t(q.leftLabelKey)}
            rightLabel={t(q.rightLabelKey)}
            value={ratings[q.id]}
            onValueChange={(val) => handleRatingChange(q.id, val)}
            colors={colors}
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
  textCenter:{
    textAlign: 'center',
    marginBottom: 15
  }
});

// ─── Card styles ──────────────────────────────────────────────────────────────
const cardStyles = StyleSheet.create({
  card: {
    borderWidth: 1.2,
    borderRadius: 16,
    paddingHorizontal: CARD_H_PAD,
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

  ratingWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: WRAPPER_H_PAD,
    borderRadius: 10,
    alignItems: 'flex-start',
    marginTop: 15
  },

  // ── Stars
  starsRow: {
    width: CONTENT_W,
    height: STAR_SIZE,
    marginBottom: 16,
    position: 'relative',
  },
  starBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Slider 
  sliderOuter: {
    width: CONTENT_W,
    height: TRIANGLE_H + TRIANGLE_GAP + THUMB_SIZE + 6,
    position: 'relative',
  },
  track: {
    position: 'absolute',
    top: TRIANGLE_H + TRIANGLE_GAP + (THUMB_SIZE - TRACK_HEIGHT) / 2,
    left: 0,
    width: CONTENT_W,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    opacity: 0.15,
  },

  filledTrack: {
    position: 'absolute',
    top: TRIANGLE_H + TRIANGLE_GAP + (THUMB_SIZE - TRACK_HEIGHT) / 2,
    left: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },

  indicatorWrapper: {
    position: 'absolute',
    top: 0,
    width: GLOW_SIZE,
    height: TRIANGLE_H + TRIANGLE_GAP + THUMB_SIZE + 6,
    alignItems: 'center',
    justifyContent: 'flex-start', // triangle at top, thumb stacked below
  },

  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: TRIANGLE_W,
    borderRightWidth: TRIANGLE_W,
    borderBottomWidth: TRIANGLE_H,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: TRIANGLE_GAP,
    zIndex: 20,
  },

  // Glow halo — absolute, centred behind the thumb
  glow: {
    position: 'absolute',
    top: TRIANGLE_H + TRIANGLE_GAP + (THUMB_SIZE - GLOW_SIZE) / 2,
    left: (GLOW_SIZE - GLOW_SIZE) / 2, // 0
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
  },

  // Thumb circle
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: THUMB_BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 30,
  },

  // ── Labels
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  labelText: {
    fontSize: 11,
    lineHeight: 15,
    maxWidth: '45%',
    marginLeft:5
  },
  rightLabelText: {
    textAlign: 'right',
    marginRight: 5
  },
});

export default memo(SurveyQ9Screen);
