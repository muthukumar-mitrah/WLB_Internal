import React, {memo, useMemo, useCallback, useState} from 'react';
import {View, StatusBar, ScrollView} from 'react-native';
import {useTheme} from '../../../theme';
import {
  AppText,
  Header,
  SafeContainer,
  Button,
  PrivacyInfo,
} from '../../../components/common';
import {ROUTES} from '../../../constants';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';

const PrivacySelectionScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  const initialPrivacy = 'Public';
  const [selected, setSelected] = useState(initialPrivacy);

  const handleSelect = useCallback(key => {
    setSelected(key);
  }, []);

  const handleDone = useCallback(() => {
    navigation.navigate({
      name: ROUTES.WEIGHT_UPDATE,
      params: {updatedPrivacy: selected},
      merge: true,
    });
  }, [navigation, selected]);

  const privacyOptions = useMemo(() => [
    {
      key: 'Public',
      icon: 'earth',
      title: t('profile.privacy.options.public.title'),
      description: t('profile.privacy.options.public.description'),
    },
    {
      key: 'Only Me',
      icon: 'lock-closed-outline',
      title: t('profile.privacy.options.private.title'),
      description: t('profile.privacy.options.private.description'),
    },
  ], [t]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('profile.privacy.title')} showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Section label */}
        <AppText style={styles.sectionLabel}>{t('profile.privacy.chooseAudience')}</AppText>

        {/* Reusable Options List */}
        <PrivacyInfo
          options={privacyOptions}
          selectedValue={selected}
          onSelect={handleSelect}
          variant="list"
        />
      </ScrollView>

      {/* Done button pinned to bottom */}
      <View style={styles.buttonContainer}>
        <Button
          title={t('common.buttons.done')}
          onPress={handleDone}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </SafeContainer>
  );
};

export default memo(PrivacySelectionScreen);
