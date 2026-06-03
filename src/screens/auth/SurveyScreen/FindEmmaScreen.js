/**
 * FindEmmaScreen — "Here's where you'll find Emma"
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
const FindEmmaScreen = ({ navigation }) => {
  const { spacing } = useTheme();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(
    () => navigation.navigate(ROUTES.EXPLORE_MATCHES),
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

        {/* ── Title ── */}
        <AppText style={styles.title}>{t('common.hereIsWhereYouWillFindEmma')}</AppText>

        {/* ── App mockup image (contains phone + Emma callout annotation) ── */}
        <Image
          source={require('../../../assets/images/find_robi.png')}
          style={styles.mockupImage}
          resizeMode="contain"
        />
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
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#262626',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 28,
    letterSpacing: -0.2,
    lineHeight: 30,
    fontFamily: fontFamily.headingSemiBold,
  },
  mockupImage: {
    width: 400,
    height: 600,
    right: 19,
    top: 5
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

export default memo(FindEmmaScreen);
