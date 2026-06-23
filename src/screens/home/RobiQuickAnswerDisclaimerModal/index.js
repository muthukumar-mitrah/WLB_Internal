/**
 * RobiQuickAnswerDisclaimerModal
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppModal, AppText, Button } from '../../../components/common';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

const RobiQuickAnswerDisclaimerModal = ({
  visible,
  onClose,
  onContinue,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const { t } = useTranslation();

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows }),
    [colors, spacing, borderRadius, shadows],
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
      closeOnOverlay={false}
      contentStyle={styles.containerStyle}
    >
      <Image
        source={require('../../../assets/icons/ai_disclaimer.png')}
        style={styles.disclaimerIcon}
        resizeMode="contain"
      />
      <AppText
        variant="h2"
        color={colors.textPrimary}
        style={styles.title}
      >
        {t('robi.disclaimer.title')}
      </AppText>
      <AppText
        variant="body"
        color={colors.textSecondary}
        style={styles.description}
      >
        {t('robi.disclaimer.description')}
      </AppText>
      <TouchableOpacity
        style={styles.dontShowRow}
        onPress={toggleDontShow}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.checkbox,
            dontShowAgain && styles.checkboxChecked,
            dontShowAgain && { borderColor: colors.primary },
          ]}
        >
          {dontShowAgain && (
            <Ionicons name="checkmark" size={14} color={colors.white} />
          )}
        </View>
        <AppText
          variant="bodyMedium"
          style={[styles.dontShowText, { color: colors.textPrimary }]}
        >
          {t('robi.disclaimer.dontShowAgain')}
        </AppText>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <Button
          testID="robi-disclaimer-close-btn"
          title={t('robi.disclaimer.close')}
          variant="gray"
          size="md"
          fullWidth={false}
          style={styles.button}
          onPress={handleClose}
        />
        <Button
          testID="robi-disclaimer-continue-btn"
          title={t('robi.disclaimer.continue')}
          rightIcon={<Ionicons name="arrow-forward" color={colors.white} size={16} />}
          variant="primary"
          size="md"
          fullWidth={false}
          style={styles.button}
          onPress={handleContinue}
        />
      </View>
    </AppModal>
  );
};

export default memo(RobiQuickAnswerDisclaimerModal);
