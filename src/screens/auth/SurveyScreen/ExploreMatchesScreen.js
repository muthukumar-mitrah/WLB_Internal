/**
 * ExploreMatchesScreen — "Here you can explore your real Buddy matches"
 *
 * Screen 4 (final) of the post-match onboarding flow.
 * Shows the app mockup (find_buddy.png) with the buddy list callout overlay,
 * and a "Continue to App" CTA that routes the user to the main app.
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
const ExploreMatchesScreen = ({ navigation }) => {
  const { spacing } = useTheme();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(() => {
    // TODO: Replace with navigation to the main/home screen once available
    // navigation.replace(ROUTES.MAIN);
    console.log('Navigate to Main App');
  }, []);

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

        {/* ── Title ── */}
        <AppText style={styles.title}>{t('common.hereYouCanExploreYourRealBuddyMatches')}
        </AppText>

        {/* ── App mockup image (contains phone + buddy list callout) ── */}
        <Image
          source={require('../../../assets/images/find_buddy.png')}
          style={styles.mockupImage}
          resizeMode="contain"
        />
      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={styles.footer}>
        <Button
          title={t('common.buttons.continueToApp')}
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
    backgroundColor: '#F9FAFB',
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 24,
    letterSpacing: -0.2,
    lineHeight: 30,
    fontFamily: fontFamily.headingSemiBold,
  },
  mockupImage: {
    width: 550,
    height: 700,
    right: 90,
    bottom: 20
  },

  // ─── Footer ──────────────────────────────────────────────────────────
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

export default memo(ExploreMatchesScreen);
