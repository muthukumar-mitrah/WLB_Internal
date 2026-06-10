/**
 * AiBuddyScreen — "Robi also found you a great AI Buddy"
 *
 * Screen 2 of the post-match onboarding flow.
 * Showcases Emma the AI buddy with her photo, style tag, bio, alignment note,
 * and an informational footer line.
 * Tapping Continue navigates to the FindEmma screen.
 */
import React, { memo, useCallback, useMemo } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer } from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles } from './styles';

// ─── Screen ───────────────────────────────────────────────────────────────────
const AiBuddyScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { t } = useTranslation();

  const baseStyles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(
    () => navigation.navigate(ROUTES.FIND_EMMA),
    [navigation],
  );

  const isDark = useTheme().isDark;
  const surveyMatchImage = isDark
    ? require('../../../assets/images/survey_match_dark.png')
    : require('../../../assets/images/survey_match.png');

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[baseStyles.postMatchBackBtn, { top: spacing[3], left: spacing[4] }]}>
        <Icon name="chevron-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.contentArea}>
        <Image
          source={surveyMatchImage}
          style={styles.illustration}
          resizeMode="contain"
        />
        <AppText variant="h3" color={colors.textPrimary} style={styles.title}>
          {t('common.robiAlsoFoundYouAGreatBuddy')}
        </AppText>
        <View style={styles.card}>
          <AppText variant="subtitleMedium" color={colors.textPrimary} style={styles.cardHeader}>
            {t('common.meetYourAiBuddy')}
          </AppText>
          <View style={styles.profileRow}>
            <Image
              source={require('../../../assets/images/user.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <AppText variant="title" color={colors.textPrimary}>
                  {t('aiBuddy.buddyName')}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {' '}{t('aiBuddy.buddyTag')}
                </AppText>
              </View>
              <AppText variant="caption" color={colors.textSecondary} style={styles.buddyBio}>
                {t('aiBuddy.buddyBio')}
              </AppText>
            </View>
          </View>
          <View style={styles.alignmentBox}>
            <AppText variant="body" color={colors.textPrimary} style={styles.alignmentText}>
              {t('aiBuddy.alignmentText')}
            </AppText>
          </View>
          <View style={styles.infoRow}>
            <Icon name="information-circle-outline" size={16} color={colors.textTertiary} style={styles.infoIcon} />
            <AppText variant="caption" color={colors.textTertiary} style={styles.infoText}>
              {t('aiBuddy.infoText')}
            </AppText>
          </View>
        </View>
      </View>
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

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentArea: {
      flex: 1,
      paddingTop: 52,
      paddingHorizontal: spacing[5],
      alignItems: 'center',
    },
    illustration: {
      width: 180,
      height: 150,
      marginBottom: 20,
    },
    title: {
      textAlign: 'center',
      marginBottom: 24,
      paddingHorizontal: spacing[2],
    },
    card: {
      width: '100%',
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      overflow: 'hidden',
    },
    cardHeader: {
      textAlign: 'center',
      paddingVertical: 14,
      paddingHorizontal: spacing[4],
    },
    profileRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[3],
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
    buddyBio: {
      lineHeight: 19,
    },
    alignmentBox: {
      backgroundColor: colors.warmSurface,
      marginHorizontal: 14,
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.warmSurfaceBorder,
    },
    alignmentText: {
      lineHeight: 22,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 14,
      gap: 8,
    },
    infoIcon: {
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      lineHeight: 17,
    },
  });

export default memo(AiBuddyScreen);
