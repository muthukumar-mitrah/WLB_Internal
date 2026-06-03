/**
 * AiBuddyScreen — "Robi also found you a great AI Buddy"
 *
 * Screen 2 of the post-match onboarding flow.
 * Showcases Emma the AI buddy with her photo, style tag, bio, alignment note,
 * and an informational footer line.
 * Tapping Continue navigates to the FindEmma screen.
 */
import React, { memo, useCallback } from 'react';
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
import { GLOBAL_TEXTS, ROUTES } from '../../../constants';
import { fontFamily } from '../../../theme/fonts';
import { t } from 'i18next';

// ─── Screen ───────────────────────────────────────────────────────────────────
const AiBuddyScreen = ({ navigation }) => {
  const { spacing } = useTheme();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(
    () => navigation.navigate(ROUTES.FIND_EMMA),
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

        {/* ── Two-robots illustration ── */}
        <Image
          source={require('../../../assets/images/survey_match.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* ── Title ── */}
        <AppText style={styles.title}>{t('common.robiAlsoFoundYouAGreatBuddy')}</AppText>

        {/* ── AI Buddy card ── */}
        <View style={styles.card}>
          {/* Card header */}
          <AppText style={styles.cardHeader}>{t('common.meetYourAiBuddy')}</AppText>

          {/* Emma profile row */}
          <View style={styles.profileRow}>
            <Image
              source={require('../../../assets/images/user.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <AppText style={styles.buddyName}>Emma</AppText>
                <AppText style={styles.buddyTag}> (Strict Coach)</AppText>
              </View>
              <AppText style={styles.buddyBio}>
                Emma is direct but supportive, helping you stay focused and consistent every day.
              </AppText>
            </View>
          </View>

          {/* Alignment note */}
          <View style={styles.alignmentBox}>
            <AppText style={styles.alignmentText}>
              You and Emma are aligned on steady progress and accountability.
            </AppText>
          </View>

          {/* Footer info line */}
          <View style={styles.infoRow}>
            <Icon name="information-circle-outline" size={16} color="#515151" style={styles.infoIcon} />
            <AppText style={styles.infoText}>
              You can see why you were matched on Emma's profile. You can switch Buddies anytime.
            </AppText>
          </View>
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

// ─── Styles ───────────────────────────────────────────────────────────────────
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
    paddingHorizontal: 20,
  },
  illustration: {
    width: 180,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 30,
    letterSpacing: -0.2,
    fontFamily: fontFamily.headingSemiBold,
  },

  // ─── Card ───────────────────────────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: fontFamily.medium
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  // ─── Emma profile ────────────────────────────────────────────────────
  profileRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 4,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  buddyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: fontFamily.headingSemiBold
  },
  buddyTag: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  buddyBio: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
    fontFamily: fontFamily.regular,
    fontWeight: '400'
  },

  // ─── Alignment box ───────────────────────────────────────────────────
  alignmentBox: {
    backgroundColor: '#FFF7E8',
    margin: 14,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  alignmentText: {
    fontSize: 16,
    color: '#404040',
    lineHeight: 19,
    fontWeight: '400',
    fontFamily: fontFamily.regular
  },

  // ─── Info row ────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 8,
  },
  infoIcon: {
    top: 2,
    bottom: 2
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#737373',
    lineHeight: 17,
    fontFamily: fontFamily.regular,
    fontWeight: '400'
  },

  // ─── Footer ──────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  ctaBtn: {
    width: '100%',
    borderRadius: 14,
  },
});

export default memo(AiBuddyScreen);
