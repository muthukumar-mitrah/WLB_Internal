import React, { memo, useMemo, useCallback } from 'react';
import { ScrollView, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { AppText, SafeContainer, Divider } from '../../../components/common';
import { useProfile } from '../../../context/ProfileContext';
import { createStyles } from './styles';


// ── Static data ─────────────────────────────────────────────────────────────

const AWARD_LEVELS = [
  {
    id: 'starter',
    labelKey: 'awards.levels.starter',
    pointsKey: 'awards.levels.starterPts',
    imgUrl: require('../../../assets/images/starter.png'),
  },
  {
    id: 'risingStar',
    labelKey: 'awards.levels.risingStar',
    pointsKey: 'awards.levels.risingStarPts',
    imgUrl: require('../../../assets/images/rising_star.png'),
  },
  {
    id: 'supporter',
    labelKey: 'awards.levels.supporter',
    pointsKey: 'awards.levels.supporterPts',
    imgUrl: require('../../../assets/images/supporter.png'),
  },
  {
    id: 'energizer',
    labelKey: 'awards.levels.energizer',
    pointsKey: 'awards.levels.energizerPts',
    imgUrl: require('../../../assets/images/energizer_light.png'),
  },
  {
    id: 'achiever',
    labelKey: 'awards.levels.achiever',
    pointsKey: 'awards.levels.achieverPts',
    imgUrl: require('../../../assets/images/achiever.png'),
  },
  {
    id: 'champion',
    labelKey: 'awards.levels.champion',
    pointsKey: 'awards.levels.championPts',
    imgUrl: require('../../../assets/images/champion.png'),
  },
  {
    id: 'legend',
    labelKey: 'awards.levels.legend',
    pointsKey: 'awards.levels.legendPts',
    imgUrl: require('../../../assets/images/legend.png'),
  },
  {
    id: 'elite',
    labelKey: 'awards.levels.elite',
    pointsKey: 'awards.levels.elitePts',
    imgUrl: require('../../../assets/images/elite.png'),
  },
];

const LEVEL_RANGES = [
  { id: 'starter', min: 0, max: 99, labelKey: 'awards.levels.starter' },
  { id: 'risingStar', min: 100, max: 199, labelKey: 'awards.levels.risingStar' },
  { id: 'supporter', min: 200, max: 399, labelKey: 'awards.levels.supporter' },
  { id: 'energizer', min: 400, max: 699, labelKey: 'awards.levels.energizer' },
  { id: 'achiever', min: 700, max: 999, labelKey: 'awards.levels.achiever' },
  { id: 'champion', min: 1000, max: 9999, labelKey: 'awards.levels.champion' },
  { id: 'legend', min: 10000, max: 19999, labelKey: 'awards.levels.legend' },
  { id: 'elite', min: 20000, max: Infinity, labelKey: 'awards.levels.elite' },
];

const EARN_POINTS = [
  {
    id: 'post',
    labelKey: 'awards.earn.post',
    pointsKey: 'awards.earn.postPts',
    imageUrl: require('../../../assets/images/post.png')
  },
  {
    id: 'comment',
    labelKey: 'awards.earn.comment',
    pointsKey: 'awards.earn.commentPts',
    imageUrl: require('../../../assets/images/comment.png')
  },
  {
    id: 'liked',
    labelKey: 'awards.earn.liked',
    pointsKey: 'awards.earn.likedPts',
    imageUrl: require('../../../assets/images/post_like.png')
  },
  {
    id: 'shared',
    labelKey: 'awards.earn.shared',
    pointsKey: 'awards.earn.sharedPts',
    imageUrl: require('../../../assets/images/share_post.png')
  },
  {
    id: 'sharePost',
    labelKey: 'awards.earn.sharePost',
    pointsKey: 'awards.earn.sharePostPts',
    imageUrl: require('../../../assets/images/share_post.png')
  },
];

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
    const idx = LEVEL_RANGES.findIndex(
      (lvl) => totalPoints >= lvl.min && totalPoints <= lvl.max
    );
    return idx !== -1 ? idx : 0;
  }, [totalPoints]);

  const currentLevelId = useMemo(() => LEVEL_RANGES[currentIdx].id, [currentIdx]);

  const currentLevel = useMemo(() => t(LEVEL_RANGES[currentIdx].labelKey), [currentIdx, t]);

  const nextLevel = useMemo(() => {
    if (currentIdx < LEVEL_RANGES.length - 1) {
      return t(LEVEL_RANGES[currentIdx + 1].labelKey);
    }
    return '';
  }, [currentIdx, t]);

  const progressPercent = useMemo(() => {
    if (currentIdx === LEVEL_RANGES.length - 1) {
      return 1.0;
    }
    const currentLvl = LEVEL_RANGES[currentIdx];
    const range = currentLvl.max - currentLvl.min + 1;
    const pointsInLevel = totalPoints - currentLvl.min;
    const partialProgress = pointsInLevel / range;
    const clampedPartial = Math.max(0, Math.min(1, partialProgress));
    return (currentIdx + clampedPartial) / 8;
  }, [currentIdx, totalPoints]);

  return (
    <SafeContainer edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText variant="h3" color={colors.textPrimary}>
          {t('awards.title')}
        </AppText>
      </View>

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
                <AppText variant="display" color={colors.white} style={styles.totalPointsValue}>
                  {totalPoints.toLocaleString()}
                </AppText>
              </View>
              <View style={styles.rewardIconWrapper}>
                <Image source={require('../../../assets/images/energizer_dark.png')} style={styles.awardImage} />
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
          {AWARD_LEVELS.map((item) => (
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
          {EARN_POINTS.map((item, index) => (
            <React.Fragment key={item.id}>
              <EarnRow item={item} styles={styles} colors={colors} t={t} />
              {index < EARN_POINTS.length - 1 && (
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
