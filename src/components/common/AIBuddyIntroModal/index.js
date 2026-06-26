import React, { useMemo } from 'react';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { APP_IMAGES } from '../../../constants/images';
import AppModal from '../AppModal';
import AppText from '../AppText';
import Button from '../Button';
import { useTheme } from '../../../theme';
import { createStyles } from './styles';

const AIBuddyIntroModal = ({ visible, onClose, onNext }) => {
  const { t } = useTranslation();
  const { colors, spacing, isDark} = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing, isDark }), [colors, spacing, isDark]);

  const FEATURES = useMemo(() => [
    { imageSource: APP_IMAGES.aiBuddyChat, titleKey: 'feature1Title', descKey: 'feature1Desc', color: colors.primary, bg: colors.iconBg },
    { imageSource: APP_IMAGES.aiBuddyActivity, titleKey: 'feature2Title', descKey: 'feature2Desc', color: colors.primary, bg: colors.iconBg },
    { imageSource: APP_IMAGES.aiBuddyDiet, titleKey: 'feature3Title', descKey: 'feature3Desc', color: colors.primary, bg: colors.iconBg },
    { imageSource: APP_IMAGES.ai_diet_apple, titleKey: 'feature4Title', descKey: 'feature4Desc', color: colors.primary, bg: colors.iconBg },
    { imageSource: APP_IMAGES.aiBuddyResource, titleKey: 'feature5Title', descKey: 'feature5Desc', color: colors.primary, bg: colors.iconBg },
    { imageSource: APP_IMAGES.aiBuddyWorkout, titleKey: 'feature6Title', descKey: 'feature6Desc', color: colors.primary, bg: colors.iconBg },
  ], [colors.primary, colors.iconBg]);

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title={t('aiBuddy.modal.title')}
      position="center"
      showHandle={false}
    >
      <View style={styles.container}>
        <View style={styles.infoCard}>
          {FEATURES.map((feat, index) => (
            <React.Fragment key={index}>
              <View style={styles.featureRow}>
                <View style={[styles.iconContainer, { backgroundColor: feat.bg }]}>
                  <Image source={feat.imageSource} style={[styles.icon, { tintColor: feat.color }]} />
                </View>
                <View style={styles.featureText}>
                  <AppText variant="subtitleMedium" color={colors.textPrimary}>
                    {t(`aiBuddy.modal.${feat.titleKey}`)}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary} style={styles.desc}>
                    {t(`aiBuddy.modal.${feat.descKey}`)}
                  </AppText>
                </View>
              </View>
              {index < FEATURES.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <Button
            title={t('aiBuddy.modal.cancel')}
            variant="outline"
            onPress={onClose}
            style={styles.cancelBtn}
          />
          <Button
            title={t('aiBuddy.modal.next')}
            variant="primary"
            onPress={onNext}
            style={styles.nextBtn}
          />
        </View>
      </View>
    </AppModal>
  );
};

export default React.memo(AIBuddyIntroModal);
