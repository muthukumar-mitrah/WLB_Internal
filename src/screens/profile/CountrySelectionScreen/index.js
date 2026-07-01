import React, {memo, useMemo, useState, useCallback, useEffect} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {
  AppText,
  Header,
  SafeContainer,
  Button,
  CountrySelector,
} from '../../../components/common';
import {ROUTES} from '../../../constants';
import {COUNTRIES} from '../../../constants/countries';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';

const CountrySelectionScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  const initialCountry = route.params?.currentCountry;
  const resolvedCountryCode = useMemo(() => {
    if (!initialCountry) return 'US';
    const found = COUNTRIES.find(c => c.value === initialCountry || c.label === initialCountry);
    return found ? found.value : 'US';
  }, [initialCountry]);

  const [selected, setSelected] = useState(resolvedCountryCode);
  
  const [privacy, setPrivacy] = useState(route.params?.currentPrivacy || 'Public');

  useEffect(() => {
    if (route.params?.updatedPrivacy) {
      setPrivacy(route.params.updatedPrivacy);
    }
  }, [route.params?.updatedPrivacy]);

  const handleSelect = useCallback(val => setSelected(val), []);

  const handleDone = useCallback(() => {
    navigation.navigate(ROUTES.UPDATE_PROFILE, {
      updatedCountry: selected,
    });
  }, [navigation, selected]);

  const handlePrivacyPress = useCallback(() => {
    navigation.navigate(ROUTES.PRIVACY_SELECTION, {
      currentPrivacy: privacy,
      returnRoute: ROUTES.COUNTRY_SELECTION,
    });
  }, [navigation, privacy]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('profile.country.title')} showBack />

      <View style={styles.content}>
        <CountrySelector
          value={selected}
          onSelect={handleSelect}
          placeholder={t('basicInfo.countryPlaceholder')}
        />

        <TouchableOpacity style={styles.privacyRow} onPress={handlePrivacyPress} activeOpacity={0.7}>
          <View style={styles.privacyTextContainer}>
            <AppText style={styles.privacyLabel}> {t('profile.privacySelectionTitle')}</AppText>
            <AppText style={styles.privacyValue}>{privacy}</AppText>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title={t('common.buttons.done')} onPress={handleDone} variant="primary" size="lg" fullWidth />
      </View>
    </SafeContainer>
  );
};

export default memo(CountrySelectionScreen);
