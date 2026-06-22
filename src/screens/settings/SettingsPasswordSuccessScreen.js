/**
 * Screen 5: Password Reset Successful (Settings Flow)
 */
import React, { memo, useCallback, useMemo } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import {
  AppText,
  Button,
  Header,
} from '../../components/common';
import { ROUTES } from '../../constants';
import createStyles from './styles';

const SettingsPasswordSuccessScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius, iconSize } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const handleBackToSettings = useCallback(() => {
    navigation.navigate(ROUTES.DRAWER);
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.navigate(ROUTES.DRAWER);
  }, [navigation]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.container}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <Header onBackPress={handleBack} transparent={true} />

      <ScrollView
        contentContainerStyle={styles.successScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successWrapper}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Ionicons name="checkmark" size={iconSize['lg']} color={colors.white} />
            </View>
          </View>

          <AppText variant="h3" color={colors.textPrimary} style={styles.successTitle}>
            {t('auth.settingsPassword.successTitle')}
          </AppText>

          <AppText variant="body" color={colors.textSecondary} style={styles.successMessage}>
            {t('auth.settingsPassword.successMessage')}
          </AppText>

          <Button
            testID="settings-back-to-settings-btn"
            title={t('auth.settingsPassword.backToSettingsBtn')}
            onPress={handleBackToSettings}
            variant="primary"
            size="lg"
            style={styles.successBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(SettingsPasswordSuccessScreen);
