import React, {memo, useMemo, useState, useCallback} from 'react';
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

const GENDER_OPTIONS = [
  {key: 'Male',               icon: 'human-male'},
  {key: 'Female',             icon: 'human-female'},
  {key: 'Other',              icon: 'gender-non-binary'}
];

const GenderSelectionScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  const [selected, setSelected] = useState(
    route.params?.currentGender || 'Male',
  );

  const handleSelect = useCallback(key => setSelected(key), []);

  const handleDone = useCallback(() => {
    navigation.navigate(ROUTES.UPDATE_PROFILE, {
      updatedGender: selected,
    });
  }, [navigation, selected]);

  const getGenderLabel = key => {
    switch (key) {
      case 'Male':               return t('profile.gender.options.male');
      case 'Female':             return t('profile.gender.options.female');
      case 'Other':              return t('profile.gender.options.other');
      default:                   return key;
    }
  };

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('profile.gender.title')} showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AppText style={styles.sectionLabel}>{t('profile.gender.subtitle')}</AppText>

        <View style={styles.listContainer}>
          {GENDER_OPTIONS.map((option, index) => {
            const isSelected = option.key === selected;
            const isLast = index === GENDER_OPTIONS.length - 1;
            return (
              <View key={option.key}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(option.key)}
                  activeOpacity={0.7}>
                  <View style={styles.iconWrapper}>
                    <Icon name={option.icon} size={22} color={colors.textPrimary} />
                  </View>
                  <AppText style={styles.optionLabel}>{getGenderLabel(option.key)}</AppText>
                  <RadioOption selected={isSelected} />
                </TouchableOpacity>
                {!isLast && <Divider style={styles.divider} thickness={1} />}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title={t('common.buttons.done')} onPress={handleDone} variant="primary" size="lg" fullWidth />
      </View>
    </SafeContainer>
  );
};

export default memo(GenderSelectionScreen);
