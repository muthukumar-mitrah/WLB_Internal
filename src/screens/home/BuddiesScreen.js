import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';
import { AppText, SafeContainer } from '../../components/common';
import { useTranslation } from '../../i18n/useTranslation';

const BuddiesScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeContainer edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.center}>
        <AppText variant="h3" color={colors.textPrimary}>{t('home.comingSoon')}</AppText>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default memo(BuddiesScreen);
