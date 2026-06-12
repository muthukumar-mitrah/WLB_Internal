/**
 * ExploreMatchesScreen — "Here you can explore your real Buddy matches"
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
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles } from './styles';

const ExploreMatchesScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { t } = useTranslation();
  const { completeAuthSession } = useAuth();

  const baseStyles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleContinue = useCallback(() => {
    // Marking the session authenticated switches the root navigator to Main.
    completeAuthSession();
  }, [completeAuthSession]);

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
        <AppText variant="h3" color={colors.textPrimary} style={styles.title}>
          {t('common.hereYouCanExploreYourRealBuddyMatches')}
        </AppText>
        <Image
          source={require('../../../assets/images/find_buddy.png')}
          style={styles.mockupImage}
        />
      </View>
      <View style={baseStyles.postMatchFooter}>
        <Button
          title={t('common.buttons.continueToApp')}
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
      marginBottom: 20,
      paddingHorizontal: spacing[4],
    },
    sizeBox: {
      height: 50
    },
    mockupImage: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    },
  });

export default memo(ExploreMatchesScreen);
