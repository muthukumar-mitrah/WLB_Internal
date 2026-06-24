import React, { memo, useMemo, useCallback } from 'react';
import { ScrollView, TouchableOpacity, View, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { AppText, SafeContainer, Divider, Header } from '../../../components/common';
import { useProfile } from '../../../context/ProfileContext';
import { createStyles } from './styles';
import { APP_IMAGES } from '../../../constants/images';
import { awardLevels, awardLevelRanges, earnPoints } from '../../../constants/mockData';


// ── Sub-components ──────────────────────────────────────────────────────────

const AwardCard = memo(({ item, styles, colors, t, isSelected }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.awardCard, isSelected && styles.awardCardSelected]}
    >
      <View style={styles.awardIconWrapper}>
        <Image source={item.imgUrl} style={styles.awardImage} />
      </View>
      <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.awardCardTitle}>
        {t(item.labelKey)}
      </AppText>
      <AppText variant="captionMedium" color={colors.textSecondary}>
        {t(item.pointsKey)}
      </AppText>
    </TouchableOpacity>
  );
});

const EarnRow = memo(({ item, styles, colors, t }) => (
  <View style={styles.earnRow}>
    <View style={styles.earnIconWrapper}>
      <Image source={item.imageUrl} style={styles.earnImage} />
    </View>
    <AppText variant="body" color={colors.textPrimary} style={styles.earnLabel}>
      {t(item.labelKey)}
    </AppText>
    <View style={styles.pointsWrapper}>
      <AppText variant="body" color={colors.primary}>
        {t(item.pointsKey)}
      </AppText>
      <AppText variant="captionSmall" color={colors.textSecondary} style={styles.pointText}>
        {"pt"}
      </AppText>
    </View>
  </View>
));

// ── Main Screen ─────────────────────────────────────────────────────────────

const AwardScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const { t } = useTranslation();
  const { profile } = useProfile();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows }),
    [colors, spacing, borderRadius, shadows],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const totalPoints = profile?.totalPoints ?? 0;

  const currentIdx = useMemo(() => {
    const idx = awardLevelRanges.findIndex(
      (lvl) => totalPoints >= lvl.min && totalPoints <= lvl.max
    );
    return idx !== -1 ? idx : 0;
  }, [totalPoints]);

  const currentLevelId = useMemo(() => awardLevelRanges[currentIdx].id, [currentIdx]);

  const currentLevel = useMemo(() => t(awardLevelRanges[currentIdx].labelKey), [currentIdx, t]);

  const nextLevel = useMemo(() => {
    if (currentIdx < awardLevelRanges.length - 1) {
      return t(awardLevelRanges[currentIdx + 1].labelKey);
    }
    return '';
  }, [currentIdx, t]);

  const progressPercent = useMemo(() => {
    if (currentIdx === awardLevelRanges.length - 1) {
      return 1.0;
    }
    const currentLvl = awardLevelRanges[currentIdx];
    const range = currentLvl.max - currentLvl.min + 1;
    const pointsInLevel = totalPoints - currentLvl.min;
    const partialProgress = pointsInLevel / range;
    const clampedPartial = Math.max(0, Math.min(1, partialProgress));
    return (currentIdx + clampedPartial) / 8;
  }, [currentIdx, totalPoints]);

  return (
    <SafeContainer edges={['top']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('awards.title')} showBack titleAlign="left" transparent={true} onBackPress={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Gradient Points Card ─────────────────────────────────────── */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsCardGradient}>
            <View style={styles.pointsCardTopRow}>
              <View style={styles.pointsCardLeft}>
                <AppText variant="caption" color="rgba(255,255,255,0.85)">
                  {t('awards.yourTotalPoints')}
                </AppText>
                <AppText variant="display" color={colors.white}>
                  {totalPoints.toLocaleString()}
                </AppText>
              </View>
              <View style={styles.rewardIconWrapper}>
                <Image source={APP_IMAGES.energizerDark} style={styles.awardImage} />
              </View>
            </View>

            {/* Level info + progress */}
            <View style={styles.levelRow}>
              <AppText variant="captionMedium" color="rgba(255,255,255,0.9)">
                {t('awards.currentLevelLabel', { level: currentLevel })}
              </AppText>
              <AppText variant="captionMedium" color="rgba(255,255,255,0.9)">
                {nextLevel ? t('awards.nextLevelLabel', { level: nextLevel }) : ''}
              </AppText>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent * 100}%` }]} />
            </View>
            <AppText
              variant="caption"
              color="rgba(255,255,255,0.75)"
              style={styles.currentLevelText}
            >
              {t('awards.currentLevelLabel', { level: currentLevel })}
            </AppText>
            <AppText
              variant="caption"
              color="rgba(255,255,255,0.7)"
              style={styles.motivationText}
            >
              {t('awards.motivation')}
            </AppText>
          </View>
        </View>

        {/* ── Award Levels ────────────────────────────────────────────── */}
        <AppText variant="titleMedium" color={colors.textPrimary} style={styles.sectionTitle}>
          {t('awards.awardLevels')}
        </AppText>

        <View style={styles.awardGrid}>
          {awardLevels.map((item) => (
            <AwardCard
              key={item.id}
              item={item}
              styles={styles}
              colors={colors}
              t={t}
              isSelected={item.id === currentLevelId}
            />
          ))}
        </View>

        {/* ── How to Earn Points ──────────────────────────────────────── */}
        <AppText variant="titleMedium" color={colors.textPrimary} style={styles.earnSectionTitle}>
          {t('awards.howToEarn')}
        </AppText>

        <View style={styles.earnCard} >
          {earnPoints.map((item, index) => (
            <React.Fragment key={item.id}>
              <EarnRow item={item} styles={styles} colors={colors} t={t} />
              {index < earnPoints.length - 1 && (
                <Divider style={styles.earnDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

      </ScrollView>
    </SafeContainer>
  );
};

export default memo(AwardScreen);
