/**
 * PortraitViewScreen — placeholder screen for viewing the user's portrait.
 * Will be implemented with the full portrait view in a future iteration.
 */
import React, {memo, useMemo} from 'react';
import {View, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {AppText, Header, SafeContainer} from '../../../components/common';
import createStyles from './styles';

const PortraitViewScreen = () => {
  const {colors, spacing} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing}),
    [colors, spacing],
  );

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title="Portrait View" showBack />

      <View style={styles.content}>
        <Icon
          name="account-circle-outline"
          size={64}
          color={colors.primary}
          style={styles.icon}
        />
        <AppText variant="h3" color={colors.textPrimary} style={styles.title}>
          Portrait View
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Your portrait view will be available soon. Stay tuned!
        </AppText>
      </View>
    </SafeContainer>
  );
};

export default memo(PortraitViewScreen);
