/**
 * HomeScreen — Main home screen with header, top tabs, and feed placeholder.
 */
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';
import { AppText, SafeContainer } from '../../components/common';
import { useTranslation } from '../../i18n/useTranslation';
import HomeHeader from '../../components/home/HomeHeader';

const HomeScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles({ colors }), [colors]);

  return (
    <SafeContainer edges={['top']} style={styles.container}>
      <HomeHeader />
      <View style={styles.feedPlaceholder}>
        <AppText variant="h3" color={colors.textTertiary}>
          {t('home.comingSoon')}
        </AppText>
      </View>
    </SafeContainer>
  );
};

const createStyles = ({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    feedPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default memo(HomeScreen);
