import React, { memo, useMemo } from 'react';
import { View, StatusBar } from 'react-native';
import { useTheme } from '../../../theme';
import { AppText, Header, SafeContainer } from '../../../components/common';
import createStyles from './styles';
import { useTranslation } from 'react-i18next';

const EditViewPortraitScreen = () => {
  const { t } = useTranslation();
  const { colors, spacing, typography } = useTheme();

  const styles = useMemo(
    () => createStyles({ colors, spacing, typography }),
    [colors, spacing, typography]
  );

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      
      <Header title={t("profile.header.editPortrait")} showBack />
      
      <View style={styles.content}>
        <AppText style={styles.comingSoonText}>
          {t("common.comingSoon")}
        </AppText>
      </View>
    </SafeContainer>
  );
};

export default memo(EditViewPortraitScreen);
