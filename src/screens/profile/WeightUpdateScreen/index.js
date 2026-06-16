import React, {memo, useMemo, useState, useCallback, useEffect} from 'react';
import {View, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {
  AppText,
  Header,
  SafeContainer,
  Button,
  WeightPicker,
} from '../../../components/common';
import {ROUTES} from '../../../constants';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';

const WeightUpdateScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  // Parse initial weight and unit from route params
  const initialWeightStr = String(route.params?.currentWeight || '144 lbs');
  const parsed = useMemo(() => {
    const match = initialWeightStr.match(/^(\d+(?:\.\d+)?)\s*(lbs|kg)?$/i);
    return {
      value: match ? match[1] : '144',
      unit: match && match[2] ? match[2].toLowerCase() : 'lbs',
    };
  }, [initialWeightStr]);

  const [weight, setWeight] = useState(parsed.value);
  const [unit, setUnit] = useState(parsed.unit);
  const [privacy, setPrivacy] = useState(route.params?.currentPrivacy || 'Public');


  // Unit conversion
  const handleUnitChange = useCallback((newUnit) => {
    if (newUnit === unit) return;
    const num = parseFloat(weight);
    if (!isNaN(num)) {
      let converted;
      if (newUnit === 'lbs') {
        converted = Math.round(num * 2.20462);
      } else {
        converted = Math.round(num / 2.20462);
      }
      setWeight(String(converted));
    }
    setUnit(newUnit);
  }, [weight, unit]);



  const handleSave = useCallback(() => {
    const formattedWeight = `${weight} ${unit}`;
    navigation.navigate(ROUTES.UPDATE_PROFILE, {
      updatedWeight: formattedWeight,
      updatedPrivacy: privacy,
    });
  }, [weight, unit, privacy, navigation]);

  const handlePrivacyPress = useCallback(() => {
    navigation.navigate(ROUTES.PRIVACY_SELECTION, {
      currentPrivacy: privacy,
    });
  }, [navigation, privacy]);

  const getPrivacyLabel = (key) => {
    switch (key?.toLowerCase()) {
      case 'public':
        return t('profile.privacy.options.public.title');
      case 'buddies only':
      case 'buddies':
        return t('profile.privacy.options.buddies.title');
      case 'only me':
      case 'private':
        return t('profile.privacy.options.private.title');
      default:
        return key;
    }
  };

  // Sync privacy from parameters return
  useEffect(() => {
    if (route.params?.updatedPrivacy) {
      setPrivacy(route.params.updatedPrivacy);
    }
  }, [route.params?.updatedPrivacy]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('profile.weightUpdate.title')} showBack  transparent={true}
        onBackPress={handleSave} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Read-only weight display field */}
        <View style={styles.weightFieldContainer}>
          <AppText style={styles.weightFieldInput}>
            {weight} {unit}
          </AppText>
        </View>

        {/* Who can see this field */}
        <TouchableOpacity
          style={styles.privacyRow}
          onPress={handlePrivacyPress}
          activeOpacity={0.7}
        >
          <View style={styles.privacyTexts}>
            <AppText style={styles.privacyTitle}>
              {t('profile.weightUpdate.privacyTitle')}
            </AppText>
            <AppText style={styles.privacyValue}>
              {getPrivacyLabel(privacy)}
            </AppText>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Spacer pushes slider card to bottom, matching design */}
        <View style={styles.spacer} />

        {/* Slider Card — positioned before Done button */}
        <View style={styles.sliderCard}>
          <WeightPicker
            weight={Number(weight)}
            unit={unit}
            onWeightChange={(val) => setWeight(String(val))}
            onUnitChange={handleUnitChange}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('common.buttons.done')}
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(WeightUpdateScreen);
