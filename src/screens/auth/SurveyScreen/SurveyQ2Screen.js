/**
 * SurveyQ2Screen — "How many pounds do you want to lose?"
 * Survey screen 2 of 10+
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer } from '../../../components/common';
import RulerPicker from '../../../components/common/RulerPicker';
import { ROUTES } from '../../../constants';
import { useSurvey } from '../../../context/SurveyContext';
import SurveyProgressBar from './SurveyProgressBar';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles, createQ2ExtraStyles } from './styles';

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 2;
const DEFAULT_POUNDS = 10;
const MIN_POUNDS = 0;
const MAX_POUNDS = 150;

const clampPounds = value => Math.max(MIN_POUNDS, Math.min(value, MAX_POUNDS));

// ─── Screen ───────────────────────────────────────────────────────────────────
const SurveyQ2Screen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        ...createSurveyStyles({ colors, spacing }),
        ...createQ2ExtraStyles({ colors, spacing }),
      }),
    [colors, spacing],
  );
  const isDark = useTheme().isDark;
  const surveyQ2Image = isDark
    ? require('../../../assets/images/survey_2_dark.png')
    : require('../../../assets/images/survey_2.png');

  const [pounds, setPounds] = useState(clampPounds(surveyData.poundsToLose ?? DEFAULT_POUNDS));

  const handleValueChange = useCallback(val => setPounds(val), []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('poundsToLose', pounds);
    navigation.navigate(ROUTES.SURVEY_Q3);
  }, [pounds, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('poundsToLose', pounds);
    navigation.goBack();
  }, [pounds, setSurveyAnswer, navigation]);

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
      <Image
        source={surveyQ2Image}
        style={styles.illustration}
        resizeMode="contain"
      />
      <View style={[styles.bottomSection, styles.bottomSectionClip]}>
        <View style={styles.bottomContent}>
          <AppText variant="title" color={colors.textPrimary}>
            {t('survey.q2.question')}
          </AppText>
        </View>
        <View style={styles.sliderWrapper}>
          <RulerPicker
            interaction="thumb"
            isScrollableScale
            minValue={MIN_POUNDS}
            maxValue={MAX_POUNDS}
            showValueLabel
            valueUnit={t('survey.q2.unit')}
            min={MIN_POUNDS}
            max={MAX_POUNDS}
            step={1}
            value={pounds}
            onValueChange={handleValueChange}
            majorTickInterval={10}
            labelInterval={10}
            renderLabel={val => String(val)}
          />
        </View>
        <View style={styles.spacer} />
      </View>
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

export default memo(SurveyQ2Screen);
