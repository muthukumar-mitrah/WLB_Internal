/**
 * MatchResultScreen — "Happy Dance Time"
 */
import React, { memo, useCallback } from 'react';
import {
  FlatList,
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
import { GLOBAL_TEXTS, ROUTES } from '../../../constants';
import { fontFamily, fontSize } from '../../../theme/fonts';
import { t } from 'i18next';

// ─── Static match data ────────────────────────────────────────────────────────
const STATIC_MATCHES = [
  {
    id: '1',
    name: 'David J.',
    tag: 'Gentle Accountability',
    matchPercent: 96,
    image: require('../../../assets/images/user.png'),
  },
  {
    id: '2',
    name: 'Daniel Brooks',
    tag: 'Goal-Focused',
    matchPercent: 92,
    image: require('../../../assets/images/user.png'),
  },
  {
    id: '3',
    name: 'Maya Lewis',
    tag: 'Encouraging Lifestyle',
    matchPercent: 89,
    image: require('../../../assets/images/user.png'),
  },
  {
    id: '4',
    name: 'Philip',
    tag: 'Wellness Support',
    matchPercent: 89,
    image: require('../../../assets/images/user.png'),
  },
  {
    id: '5',
    name: 'Mitchell',
    tag: 'Smart Accountability',
    matchPercent: 89,
    image: require('../../../assets/images/user.png'),
  },
];

// ─── Match % badge ────────────────────────────────────────────────────────────
const MatchBadge = memo(({ percent }) => {
  // All shown as green in the Figma — adjust thresholds to taste
  return (
    <View style={badgeStyles.badge}>
      <AppText style={badgeStyles.text}>{percent}% Match</AppText>
    </View>
  );
});

// ─── Single buddy row ─────────────────────────────────────────────────────────
const BuddyRow = memo(({ item }) => (
  <TouchableOpacity activeOpacity={0.8} style={rowStyles.card}>
    <Image
      source={item.image}
      style={rowStyles.avatar}
      resizeMode="cover"
    />

    <View style={rowStyles.content}>
      <View style={rowStyles.topRow}>
        <AppText
          style={rowStyles.name}
          numberOfLines={1}
        >
          {item.name}
        </AppText>

        <MatchBadge percent={item.matchPercent} />
      </View>

      <AppText style={rowStyles.tag}>
        {item.tag}
      </AppText>
    </View>
  </TouchableOpacity>
));

// ─── Screen ───────────────────────────────────────────────────────────────────
const MatchResultScreen = ({ navigation, route }) => {
  const { spacing } = useTheme();

  const matches = STATIC_MATCHES;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(
    () => navigation.navigate(ROUTES.AI_BUDDY),
    [navigation],
  );

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* ── Back ── */}
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[styles.backBtn, { top: spacing[3], left: spacing[4] }]}>
        <Icon name="chevron-back" size={22} color="#111827" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* ── Dancing robot ── */}
        <Image
          source={require('../../../assets/images/survey_dance.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* ── Title block ── */}
        <AppText style={styles.title}>{t('common.happyDanceTime')}</AppText>
        <AppText style={styles.subtitle}>
          {t('common.matchedYouPossibleBuddies')}
        </AppText>

        {/* ── Buddy list ── */}
        <View style={styles.listContainer}>
          {matches.map(item => (
            <BuddyRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={styles.footer}>
        <Button
          title={t('common.buttons.continue')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          style={styles.ctaBtn}
        />
      </View>
    </SafeContainer>
  );
};

// ─── Badge styles ─────────────────────────────────────────────────────────────
const badgeStyles = StyleSheet.create({
  badge: {
    backgroundColor: '#E2FFEB',
    borderRadius: 999,
    paddingHorizontal: 5,
  },

  text: {
    color: '#088D2E',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
  },
});

// ─── Row styles ───────────────────────────────────────────────────────────────
const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  tag: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
    fontFamily: fontFamily.regular,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 24,
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    flex: 1,
    fontSize: 16.01,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    color: '#222222',
    marginRight: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});

// ─── Screen styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    position: 'absolute',
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 24,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
    fontWeight: '500',
    lineHeight: 30,
    fontFamily: fontFamily.headingSemiBold,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
  ctaBtn: {
    width: '100%',
    borderRadius: 14,
  },
});

export default memo(MatchResultScreen);
