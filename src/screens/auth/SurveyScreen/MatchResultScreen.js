/**
 * MatchResultScreen — "Happy Dance Time"
 */
import React, { memo, useCallback, useMemo } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer } from '../../../components/common';
import { APP_IMAGES, ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles } from './styles';

const STATIC_MATCHES = [
  {
    id: '1',
    name: 'David J.',
    tag: 'Gentle Accountability',
    matchPercent: 96,
    image: APP_IMAGES.userAvatar,
  },
  {
    id: '2',
    name: 'Daniel Brooks',
    tag: 'Goal-Focused',
    matchPercent: 92,
    image: APP_IMAGES.userAvatar,
  },
  {
    id: '3',
    name: 'Maya Lewis',
    tag: 'Encouraging Lifestyle',
    matchPercent: 89,
    image: APP_IMAGES.userAvatar,
  },
  {
    id: '4',
    name: 'Philip',
    tag: 'Wellness Support',
    matchPercent: 89,
    image: APP_IMAGES.userAvatar,
  },
  {
    id: '5',
    name: 'Mitchell',
    tag: 'Smart Accountability',
    matchPercent: 89,
    image: APP_IMAGES.userAvatar,
  },
];

const MatchBadge = memo(({ percent, colors, t }) => (
  <View style={[badgeBase.badge, { backgroundColor: colors.successSurface }]}>
    <AppText
      variant="captionMedium"
      color={colors.successDark}
      style={badgeBase.text}>
      {t('common.matchPercent', { percent })}
    </AppText>
  </View>
));

const BuddyRow = memo(({ item, colors, t }) => (
  <View style={[buddyBase.card, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
    <Image source={item.image} style={buddyBase.avatar} resizeMode="cover" />
    <View style={buddyBase.content}>
      <View style={buddyBase.topRow}>
        <AppText
          variant="titleMedium"
          color={colors.textPrimary}
          numberOfLines={1}
          style={buddyBase.name}>
          {item.name}
        </AppText>
        <MatchBadge percent={item.matchPercent} colors={colors} t={t} />
      </View>
      <AppText variant="caption" color={colors.textSecondary}>
        {item.tag}
      </AppText>
    </View>
  </View>
));

const MatchResultScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { t } = useTranslation();

  const baseStyles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const matches = STATIC_MATCHES;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(
    () => navigation.navigate(ROUTES.AI_BUDDY),
    [navigation],
  );

  const isDark = useTheme().isDark;
  const matchResultImage = isDark
    ? require('../../../assets/images/survey_dance_dark.png')
    : require('../../../assets/images/survey_dance.png');

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[baseStyles.postMatchBackBtn, { top: spacing[3], left: spacing[4] }]}>
        <Icon name="chevron-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}>
        <Image
          source={matchResultImage}
          style={styles.illustration}
          resizeMode="contain"
        />
        <AppText variant="h2" color={colors.textPrimary} style={styles.title}>
          {t('common.happyDanceTime')}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          {t('common.matchedYouPossibleBuddies')}
        </AppText>
        <View style={styles.listContainer}>
          {matches.map(item => (
            <BuddyRow key={item.id} item={item} colors={colors} t={t} />
          ))}
        </View>
      </ScrollView>
      <View style={baseStyles.postMatchFooter}>
        <Button
          title={t('common.buttons.continue')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          style={baseStyles.postMatchCtaBtn}
        />
      </View>
    </SafeContainer>
  );
};

const badgeBase = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 10,
  },
});

const buddyBase = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    marginRight: 12,
  },
});

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingTop: 52,
      paddingBottom: 20,
      alignItems: 'center',
    },
    illustration: {
      width: 160,
      height: 140,
      marginBottom: 20,
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 24,
      paddingHorizontal: spacing[8],
    },
    listContainer: {
      width: '100%',
      paddingHorizontal: spacing[5],
    },
  });

export default memo(MatchResultScreen);
