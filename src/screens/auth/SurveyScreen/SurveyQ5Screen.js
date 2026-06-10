/**
 * SurveyQ5Screen — "How do you want your buddy to communicate?"
 * Survey screen 5 of 10+
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
import SurveySemiCircleSlider from './SurveySemiCircleSlider';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles } from './styles';

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 5;

const COMM_OPTIONS = [
  { value: 'supportive', labelKey: 'survey.q5.supportive', label: 'Supportive' },
  { value: 'balanced', labelKey: 'survey.q5.balanced', label: 'Balanced' },
  { value: 'direct', labelKey: 'survey.q5.direct', label: 'Direct' },
];

const SurveyQ5Screen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () => StyleSheet.create({
      ...createSurveyStyles({ colors, spacing }),
      sliderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing[2],
      }
    }),
    [colors, spacing],
  );
  const isDark = useTheme().isDark;
  const surveyQ5Image = isDark
    ? require('../../../assets/images/survey_5_dark.png')
    : require('../../../assets/images/survey_5.png');

  const initialIndex = COMM_OPTIONS.findIndex(
    o => o.value === surveyData.communicationStyle,
  );
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  );

  const handleSelect = useCallback(index => setSelectedIndex(index), []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('communicationStyle', COMM_OPTIONS[selectedIndex].value);
    navigation.navigate(ROUTES.SURVEY_Q6);
  }, [selectedIndex, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('communicationStyle', COMM_OPTIONS[selectedIndex].value);
    navigation.goBack();
  }, [selectedIndex, setSurveyAnswer, navigation]);

  const translatedOptions = COMM_OPTIONS.map(opt => ({
    ...opt,
    label: t(opt.labelKey)
  }));

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
          source={surveyQ5Image}
          style={styles.illustration}
          resizeMode="contain"
        />
        <AppText variant="title" color={colors.textPrimary}>
          {t('survey.q5.question')}
        </AppText>
        <View style={styles.sliderContainer}>
          <SurveySemiCircleSlider
            options={translatedOptions}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
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
          style={styles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

export default memo(SurveyQ5Screen);
