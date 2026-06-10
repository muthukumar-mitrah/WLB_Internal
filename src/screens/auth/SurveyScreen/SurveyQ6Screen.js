/**
 * SurveyQ6Screen — "How often do you want to check in?"
 * Survey screen 6 of 10+
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
import { createSurveyStyles } from './styles';

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 6;

const PATTERNS = {
  daily: [
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ],
  fewTimes: [
    [1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1],
  ],
  onceWeek: [
    [0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0],
  ],
};

const CHECK_IN_OPTIONS = [
  { value: 'daily', labelKey: 'survey.q6.daily', pattern: PATTERNS.daily },
  { value: 'fewTimes', labelKey: 'survey.q6.fewTimes', pattern: PATTERNS.fewTimes },
  { value: 'onceWeek', labelKey: 'survey.q6.onceWeek', pattern: PATTERNS.onceWeek },
];

const CheckInCard = memo(({ option, isSelected, onPress, colors, borderRadius }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          borderRadius: borderRadius.lg,
          borderColor: isSelected ? colors.primarySoft : colors.border,
          backgroundColor: isSelected ? colors.primarySurface : colors.background,
        }
      ]}
    >
      <View style={[styles.gridContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
        {option.pattern.map((row, rIdx) => (
          <View key={rIdx} style={styles.gridRow}>
            {row.map((cell, cIdx) => (
              <View
                key={cIdx}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell === 1
                      ? colors.primarySoft
                      : colors.backgroundTertiary
                  },
                  cell === 1 && { opacity: 0.5 },
                  cell === 1 && { opacity: 1 },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.cardTextContainer}>
        <AppText
          variant="bodySmall"
          color={colors.textPrimary}
          style={styles.cardText}
          numberOfLines={2}
        >
          {option.label}
        </AppText>
      </View>
    </TouchableOpacity>
  );
});

const SurveyQ6Screen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const baseStyles = useMemo(
    () => createSurveyStyles({ colors, spacing }),
    [colors, spacing],
  );

  const initialIndex = CHECK_IN_OPTIONS.findIndex(
    o => o.value === surveyData.checkInFrequency,
  );
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  );

  const handleSelect = useCallback(index => setSelectedIndex(index), []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('checkInFrequency', CHECK_IN_OPTIONS[selectedIndex].value);
    navigation.navigate(ROUTES.SURVEY_Q7);
  }, [selectedIndex, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('checkInFrequency', CHECK_IN_OPTIONS[selectedIndex].value);
    navigation.goBack();
  }, [selectedIndex, setSurveyAnswer, navigation]);

  const translatedOptions = CHECK_IN_OPTIONS.map(opt => ({
    ...opt,
    label: t(opt.labelKey)
  }));

  const isDark = useTheme().isDark;
  const surveyQ6Image = isDark
    ? require('../../../assets/images/survey_6_dark.png')
    : require('../../../assets/images/survey_6.png');

  return (
    <SafeContainer edges={['top', 'bottom']} style={baseStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundSecondary} translucent={false} />
      <View style={baseStyles.header}>
        <TouchableOpacity
          onPress={handlePrevious}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={baseStyles.backBtn}
        >
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <SurveyProgressBar total={TOTAL_QUESTIONS} current={CURRENT_QUESTION} />
        <View style={baseStyles.backBtn} />
      </View>
      <ScrollView
        style={baseStyles.bottomSection}
        contentContainerStyle={baseStyles.bottomContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={surveyQ6Image}
          style={baseStyles.illustration}
          resizeMode="contain"
        />
        <AppText variant="title" color={colors.textPrimary}>
          {t('survey.q6.question')}
        </AppText>
        <View style={styles.cardsRow}>
          {translatedOptions.map((opt, idx) => (
            <CheckInCard
              key={opt.value}
              option={opt}
              isSelected={selectedIndex === idx}
              onPress={() => handleSelect(idx)}
              colors={colors}
              borderRadius={borderRadius}
            />
          ))}
        </View>
      </ScrollView>
      <View style={baseStyles.bottomRow}>
        <Button
          title={t('common.buttons.previous')}
          onPress={handlePrevious}
          variant="gray"
          size="lg"
          style={baseStyles.halfBtn}
        />
        <Button
          title={t('common.buttons.next')}
          onPress={handleNext}
          variant="primary"
          size="lg"
          style={baseStyles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 20,
    gap: 12,
  },
  card: {
    flex: 1,
    borderWidth: 1.5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  gridContainer: {
    width: '100%',
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    padding: 6,
    gap: 4,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 4,
  },
  cell: {
    width: 9,
    height: 9,
    borderRadius: 1.5,
  },
  cardTextContainer: {
    marginTop: 5,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
    fontWeight: '500',
  }
});

export default memo(SurveyQ6Screen);
