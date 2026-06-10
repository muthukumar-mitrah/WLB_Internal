/**
 * SurveyQ4Screen — "What kind of buddy do you want?"
 * Survey screen 4 of 10+
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
import { radioOptionStyles, createSurveyStyles } from './styles';

const TOTAL_QUESTIONS = 9;
const CURRENT_QUESTION = 4;

const BUDDY_OPTIONS = [
  { value: 'mentor', labelKey: 'survey.q4.mentor' },
  { value: 'partner', labelKey: 'survey.q4.partner' },
  { value: 'cheerleader', labelKey: 'survey.q4.cheerleader' },
];

const OptionRow = memo(({ label, selected, onPress, colors, borderRadius }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      radioOptionStyles.row,
      {
        borderRadius: borderRadius.lg,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.backgroundSecondary : colors.background,
      },
    ]}
  >
    <AppText
      variant="bodyMedium"
      color={colors.textSecondary}
      style={radioOptionStyles.label}
    >
      {label}
    </AppText>
    <View
      style={[
        selected ? radioOptionStyles.radio : '',
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
const SurveyQ4Screen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );
  const isDark = useTheme().isDark;
  const surveyQ4Image = isDark
    ? require('../../../assets/images/survey_4_dark.png')
    : require('../../../assets/images/survey_4.png');

  const initialIndex = BUDDY_OPTIONS.findIndex(
    o => o.value === surveyData.buddyType,
  );
  const [selectedValue, setSelectedValue] = useState(
    initialIndex >= 0 ? BUDDY_OPTIONS[initialIndex].value : BUDDY_OPTIONS[0].value,
  );

  const handleSelect = useCallback(value => setSelectedValue(value), []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('buddyType', selectedValue);
    navigation.navigate(ROUTES.SURVEY_Q5);
  }, [selectedValue, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('buddyType', selectedValue);
    navigation.goBack();
  }, [selectedValue, setSurveyAnswer, navigation]);

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
          source={surveyQ4Image}
          style={styles.illustration}
          resizeMode="contain"
        />
        <AppText variant="title" color={colors.textPrimary}>
          {t('survey.q4.question')}
        </AppText>
        <View style={{ marginTop: 20 }}>
          {BUDDY_OPTIONS.map(option => (
            <OptionRow
              key={option.value}
              label={t(option.labelKey)}
              selected={selectedValue === option.value}
              onPress={() => handleSelect(option.value)}
              colors={colors}
              borderRadius={borderRadius}
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
          style={styles.halfBtn}
        />
      </View>
    </SafeContainer>
  );
};

export default memo(SurveyQ4Screen);
