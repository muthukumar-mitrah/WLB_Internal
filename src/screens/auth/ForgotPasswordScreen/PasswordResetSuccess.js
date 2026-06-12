import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  SafeContainer,
} from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

const PasswordResetSuccessScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius, iconSize } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const handleBackToSignIn = useCallback(() => {
    navigation.navigate(ROUTES.LOGIN);
  }, [navigation]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        >
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={iconSize.md} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentWrapper}>
          <View style={styles.successIconContainer}>
            <View style={styles.successIconInner}>
              <Ionicons name="checkmark" size={iconSize['2xl']} color={colors.white} />
            </View>
          </View>
          <AppText variant="h2" color={colors.textPrimary} style={styles.heading}>
            {t('auth.passwordResetSuccess.heading')}
          </AppText>
          <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
            {t('auth.passwordResetSuccess.subheading')}
          </AppText>
          <Button
            testID="password-reset-success-btn"
            title={t('auth.passwordResetSuccess.backToSignIn')}
            onPress={handleBackToSignIn}
            variant="primary"
            size="lg"
            style={styles.continueBtn}
          />
        </View>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(PasswordResetSuccessScreen);
