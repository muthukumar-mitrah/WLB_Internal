/**
 * FindEmmaScreen — "Here's where you'll find Emma"
 */
import React, { memo, useCallback, useMemo } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer } from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles } from './styles';

const FindEmmaScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { t } = useTranslation();

  const baseStyles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(
    () => navigation.navigate(ROUTES.EXPLORE_MATCHES),
    [navigation],
  );

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[baseStyles.postMatchBackBtn, { top: spacing[3], left: spacing[4] }]}>
        <Icon name="chevron-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.sizeBox} />
      <View style={styles.contentArea}>
        <AppText variant="h2" color={colors.textPrimary} style={styles.title}>
          {t('common.hereIsWhereYouWillFindEmma')}
        </AppText>
        <Image
          source={require('../../../assets/images/find_robi.png')}
          style={styles.mockupImage}
          resizeMode="contain"
        />
      </View>
      <View style={baseStyles.postMatchFooter}>
        <Button
          title={t('common.buttons.continue')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          style={baseStyles.postMatchCtaBtn}
        />
      </View>
    </SafeContainer>
  );
};

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentArea: {
      flex: 1,
      paddingTop: 10,
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      paddingHorizontal: spacing[2]
    },
    mockupImage: {
      flex: 1,
      width: '85%',
      alignSelf: 'flex-start'
    },
    sizeBox: {
      height: 50
    }
  });

export default memo(FindEmmaScreen);
