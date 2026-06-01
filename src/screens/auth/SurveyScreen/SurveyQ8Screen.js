/**
 * SurveyQ8Screen — "What age range do you prefer?"
 * Survey screen 8 of 10+
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
import RulerPicker from '../../../components/common/RulerPicker';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles } from './styles';

const TOTAL_QUESTIONS  = 9;
const CURRENT_QUESTION = 8;

const SurveyQ8Screen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );

  const initialRange = surveyData.ageRange || { min: 30, max: 50 };
  const [ageRange, setAgeRange] = useState(initialRange);

  const handleValuesChange = useCallback((min, max) => {
    setAgeRange({ min, max });
  }, []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('ageRange', ageRange);
    navigation.navigate(ROUTES.SURVEY_Q9);
  }, [ageRange, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('ageRange', ageRange);
    navigation.goBack();
  }, [ageRange, setSurveyAnswer, navigation]);

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
            source={require('../../../assets/images/survey_8.png')}
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
          {t('survey.q8.question')}
        </AppText>

        <RulerPicker
          mode="range"
          minValue={ageRange.min}
          maxValue={ageRange.max}
          min={10}
          max={60}
          onValuesChange={handleValuesChange}
        />
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
          style={styles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

export default memo(SurveyQ8Screen);
