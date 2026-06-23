import React, { memo, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../theme';
import { useProfile } from '../../context/ProfileContext';
import {
  SafeContainer,
  Header,
  AppText,
  Button
} from '../../components/common';
import RadioOption from '../profile/components/RadioOption';
import createStyles from './styles';
import { PROFILE_VISIBILITY_OPTIONS } from '../../constants/accountSetting';

const ProfileVisibilityScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const { profile, updateProfileLocal } = useProfile();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows, isDark }),
    [colors, spacing, borderRadius, shadows, isDark]
  );

  const initialValue = profile?.profileVisibility || 'Public';
  const [selected, setSelected] = useState(initialValue);

  const handleSelect = useCallback((key) => {
    setSelected(key);
  }, []);

  const handleDone = useCallback(async () => {
    try {
      await updateProfileLocal({ profileVisibility: selected });
      navigation.goBack();
    } catch (error) {
      console.warn('Failed to save profile visibility setting', error);
    }
  }, [selected, updateProfileLocal, navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('accountSettings.visibility.profile.title', 'Profile Visibility')} showBack transparent={true} />

      <ScrollView
        contentContainerStyle={styles.visibilityScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="body" color={colors.textPrimary} style={styles.visibilitySectionLabel}>
          {t('accountSettings.visibility.profile.chooseAudience', 'Choose audience')}
        </AppText>

        <View style={styles.visibilityListCard}>
          {PROFILE_VISIBILITY_OPTIONS.map((option) => {
            const isSelected = option.key === selected;

            return (
              <View key={option.key}>
                <TouchableOpacity
                  style={styles.visibilityRow}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(option.key)}
                >
                  <View style={styles.visibilityIconWrapper}>
                    <Image source={option.imageSource} style={styles.visibilityIconImage} />
                  </View>

                  <View style={styles.visibilityTextWrapper}>
                    <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.visibilityTitle}>
                      {t(option.titleKey, option.key)}
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary} style={styles.visibilityDesc}>
                      {t(option.descKey)}
                    </AppText>
                  </View>

                  <View style={styles.radioWrapper}>
                    <RadioOption selected={isSelected} />
                  </View>
                </TouchableOpacity>

                {/* {!isLast && <Divider style={styles.divider} />} */}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.visibilityButtonContainer}>
        <Button
          title={t('common.buttons.done', 'Done')}
          onPress={handleDone}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </SafeContainer>
  );
};

export default memo(ProfileVisibilityScreen);
