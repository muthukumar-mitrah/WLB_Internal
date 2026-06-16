import React, {memo, useMemo, useCallback, useState} from 'react';
import {View, StatusBar, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {
  AppText,
  Header,
  SafeContainer,
  Button,
  Divider,
} from '../../../components/common';
import {ROUTES} from '../../../constants';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';
import RadioOption from '../components/RadioOption';

// Options shown in the reference design
const PRIVACY_OPTIONS = [
  {key: 'Public',   icon: 'earth'},
  {key: 'Only Me',  icon: 'lock-outline'},
];

const PrivacySelectionScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  const initialPrivacy = route.params?.currentPrivacy || 'Public';
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

  const getPrivacyOptionTitle = key => {
    switch (key) {
      case 'Public':   return t('profile.privacy.options.public.title');
      case 'Only Me':  return t('profile.privacy.options.private.title');
      default:         return key;
    }
  };

  const getPrivacyOptionSubtitle = key => {
    switch (key) {
      case 'Public':   return t('profile.privacy.options.public.description');
      case 'Only Me':  return t('profile.privacy.options.private.description');
      default:         return '';
    }
  };

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

        {/* Options list */}
        <View style={styles.listContainer}>
          {PRIVACY_OPTIONS.map((option, index) => {
            const isSelected = option.key === selected;
            const isLast = index === PRIVACY_OPTIONS.length - 1;
            return (
              <View key={option.key}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(option.key)}
                  activeOpacity={0.7}>
                  {/* Left icon */}
                  <View style={styles.iconWrapper}>
                    <Icon
                      name={option.icon}
                      size={24}
                      color={colors.textPrimary}
                    />
                  </View>

                  {/* Text content */}
                  <View style={styles.textContent}>
                    <AppText style={styles.optionLabel}>{getPrivacyOptionTitle(option.key)}</AppText>
                    <AppText style={styles.optionSubtitle}>
                      {getPrivacyOptionSubtitle(option.key)}
                    </AppText>
                  </View>

                  {/* Radio button */}
                  <RadioOption selected={isSelected} />
                </TouchableOpacity>

                {/* Divider between rows, not after last */}
                {!isLast && (
                  <Divider style={styles.divider} thickness={1} />
                )}
              </View>
            );
          })}
        </View>
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
