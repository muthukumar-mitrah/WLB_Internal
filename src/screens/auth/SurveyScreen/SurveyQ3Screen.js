/**
 * SurveyQ3Screen — "How committed are you right now?"
 * Survey screen 3 of 10+
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
import SurveyVerticalBar from './SurveyVerticalBar';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles, createQ3ExtraStyles, q3OptionStyles } from './styles';

const TOTAL_QUESTIONS  = 9;
const CURRENT_QUESTION = 3;

// Must match SurveyVerticalBar props for pixel-perfect alignment
const ROW_HEIGHT = 52;
const ROW_GAP    = 10;

const COMMITMENT_OPTIONS = [
  { value: 'very_committed',   labelKey: 'survey.q3.veryCommitted' },
  { value: 'pretty_committed', labelKey: 'survey.q3.prettyCommitted' },
  { value: 'getting_started',  labelKey: 'survey.q3.gettingStarted' },
];

// ─── Option Row ───────────────────────────────────────────────────────────────
const OptionRow = memo(({ label, selected, onPress, colors, borderRadius, isLast }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      q3OptionStyles.row,
      {
        height: ROW_HEIGHT,
        marginBottom: isLast ? 0 : ROW_GAP,
        borderRadius: borderRadius.lg,
        borderColor: selected ? '#3685C6' : colors.border,
        backgroundColor: selected ? '#EBF3F9' : colors.background,
      },
    ]}
  >
    <AppText
      variant="bodyMedium"
      color={colors.textSecondary}
      numberOfLines={2}
    >
      {label}
    </AppText>
  </TouchableOpacity>
));

// ─── Screen ───────────────────────────────────────────────────────────────────
const SurveyQ3Screen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { surveyData, setSurveyAnswer } = useSurvey();
  const { t } = useTranslation();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        ...createSurveyStyles({ colors, spacing }),
        ...createQ3ExtraStyles({ spacing }),
      }),
    [colors, spacing],
  );

  const initialIndex = COMMITMENT_OPTIONS.findIndex(
    o => o.value === surveyData.commitmentLevel,
  );
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  );

  const handleSelect = useCallback(index => setSelectedIndex(index), []);

  const handleNext = useCallback(() => {
    setSurveyAnswer('commitmentLevel', COMMITMENT_OPTIONS[selectedIndex].value);
    navigation.navigate(ROUTES.SURVEY_Q4);
  }, [selectedIndex, setSurveyAnswer, navigation]);

  const handlePrevious = useCallback(() => {
    setSurveyAnswer('commitmentLevel', COMMITMENT_OPTIONS[selectedIndex].value);
    navigation.goBack();
  }, [selectedIndex, setSurveyAnswer, navigation]);

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
            source={require('../../../assets/images/survey_3.png')}
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
          {t('survey.q3.question')}
        </AppText>

        {/* Options list + vertical indicator side by side */}
        <View style={styles.optionsRow}>
          <View style={styles.optionsList}>
            {COMMITMENT_OPTIONS.map((option, i) => (
              <OptionRow
                key={option.value}
                label={t(option.labelKey)}
                selected={selectedIndex === i}
                onPress={() => handleSelect(i)}
                colors={colors}
                borderRadius={borderRadius}
                isLast={i === COMMITMENT_OPTIONS.length - 1}
              />
            ))}
          </View>

          {/* Vertical bar — wrapper height = total options height for exact alignment */}
          <SurveyVerticalBar
            selectedIndex={selectedIndex}
            itemCount={COMMITMENT_OPTIONS.length}
            rowHeight={ROW_HEIGHT}
            rowGap={ROW_GAP}
            onSelect={handleSelect}
          />
        </View>
      </ScrollView>

      {/* ═══ BOTTOM BUTTONS ═══ */}
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

export default memo(SurveyQ3Screen);
