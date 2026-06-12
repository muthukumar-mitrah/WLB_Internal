/**
 * AiBuddyDisclaimerModal
 *
 * Shown before navigating to RobiScreen.
 * Respects "Don't show again" preference via AsyncStorage.
 * Uses AppModal (center), Button, AppText, Divider — all existing common components.
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppModal, AppText, Button } from '../../common';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';
import Icon from 'react-native-vector-icons/Ionicons'

const ASSETS = {
  disclaimer: require('../../../assets/icons/ai_disclaimer.png'),
  aiSupport: require('../../../assets/icons/ai_support.png'),
  judgment: require('../../../assets/icons/judgement.png'),
  medicalAdvice: require('../../../assets/icons/medical_advice.png'),
  aiSettings: require('../../../assets/icons/ai_setting.png'),
};

const SECTIONS = [
  {
    key: 'aiGenerated',
    asset: 'aiSupport',
    titleKey: 'aiBuddy.disclaimer.aiGeneratedTitle',
    descKey: 'aiBuddy.disclaimer.aiGeneratedDesc',
  },
  {
    key: 'useJudgment',
    asset: 'judgment',
    titleKey: 'aiBuddy.disclaimer.useJudgmentTitle',
    descKey: 'aiBuddy.disclaimer.useJudgmentDesc',
  },
  {
    key: 'notMedical',
    asset: 'medicalAdvice',
    titleKey: 'aiBuddy.disclaimer.notMedicalTitle',
    descKey: 'aiBuddy.disclaimer.notMedicalDesc',
  },
];

const AiBuddyDisclaimerModal = ({
  visible,
  onClose,
  onContinue,
  onAiSettings,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const handleContinue = useCallback(() => {
    onContinue(dontShowAgain);
  }, [dontShowAgain, onContinue]);

  const handleClose = useCallback(() => {
    setDontShowAgain(false);
    onClose();
  }, [onClose]);

  const toggleDontShow = useCallback(
    () => setDontShowAgain(prev => !prev),
    [],
  );

  return (
    <AppModal
      visible={visible}
      onClose={handleClose}
      position="center"
      showHandle={false}
      showCloseButton={true}
      closeOnOverlay={false}>
      <Image
        source={ASSETS.disclaimer}
        style={styles.disclaimerIcon}
        resizeMode="contain"
      />
      <AppText
        variant="h3"
        color={colors.textPrimary}
        style={styles.title}>
        {t('aiBuddy.disclaimer.title')}
      </AppText>
      <AppText
        variant="body"
        color={colors.textSecondary}
        style={styles.description}>
        {t('aiBuddy.disclaimer.description')}
      </AppText>
      <View style={styles.sectionList}>
        {SECTIONS.map(section => (
          <View key={section.key} style={styles.sectionItem}>
            <Image
              source={ASSETS[section.asset]}
              style={[styles.sectionIcon]}
              resizeMode="contain"
            />
            <View style={styles.sectionText}>
              <AppText variant="bodyMedium" color={colors.textPrimary}>
                {t(section.titleKey)}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {t(section.descKey)}
              </AppText>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.dontShowRow}
        onPress={toggleDontShow}
        activeOpacity={0.8}>
        <Ionicons
          name={dontShowAgain ? 'checkbox' : 'square-outline'}
          size={22}
          color={dontShowAgain ? colors.primary : colors.textSecondary}
        />
        <AppText variant="titleMedium" color={colors.textPrimary}>
          {t('aiBuddy.disclaimer.dontShowAgain')}
        </AppText>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.aiSettingsBtn}
          onPress={onAiSettings}
          activeOpacity={0.7}>
          <Image
            source={ASSETS.aiSettings}
            style={[styles.aiSettingsIcon]}
            resizeMode="contain"
          />
          <AppText variant="bodyMedium" color={colors.textSecondary}>
            {t('aiBuddy.disclaimer.aiSettings')}
          </AppText>
        </TouchableOpacity>
        <Button
          testID="ai-disclaimer-close-btn"
          title={t('aiBuddy.disclaimer.close')}
          variant="gray"
          size="md"
          fullWidth={false}
          style={styles.closeBtn}
          onPress={handleClose}
        />
        <Button
          testID="ai-disclaimer-continue-btn"
          title={t('aiBuddy.disclaimer.continue')}
          rightIcon={<Icon name={'arrow-forward'} color={colors.textInverse} size={20} />}
          variant="primary"
          size="md"
          fullWidth={false}
          style={styles.continueBtn}
          onPress={handleContinue}
        />
      </View>
    </AppModal>
  );
};

export default memo(AiBuddyDisclaimerModal);
