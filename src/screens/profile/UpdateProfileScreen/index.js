import React, {memo, useMemo, useState, useCallback, useEffect} from 'react';
import {View, StatusBar, ScrollView, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {
  AppText,
  Header,
  SafeContainer,
  AppImage,
  InputBox,
  AppModal,
} from '../../../components/common';
import MediaPicker from '../../../components/common/MediaPicker';
import {ROUTES} from '../../../constants';
import {APP_IMAGES} from '../../../constants';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';
import { useProfile } from '../../../context/ProfileContext';

const EditCard = ({imageSource, label, value, onPress, colors, styles}) => (
  <TouchableOpacity style={styles.editCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.iconWrapper}>
      <Image source={imageSource} style={styles.cardIcon} />
    </View>
    <View style={styles.cardTextContent}>
      <AppText variant="captionMedium" color={colors.textSecondary} style={styles.cardLabel}>
        {label}
      </AppText>
      <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.cardValue}>
        {value}
      </AppText>
    </View>
    <Icon name="pencil-outline" size={20} color={colors.textSecondary} />
  </TouchableOpacity>
);

const UpdateProfileScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  const { profile: contextProfile } = useProfile();
  
  const [profile, setProfile] = useState(contextProfile || {});
  const [avatar, setAvatar] = useState(null);
  const [isEditVisible, setIsEditVisible] = useState(false);

  useEffect(() => {
    if (contextProfile) {
      setProfile(prev => {
        // Only update if the form was empty or we want to overwrite it.
        // For simplicity, just sync the initial load if it was empty.
        if (!prev.name && contextProfile.name) {
          return contextProfile;
        }
        return prev;
      });
    }
  }, [contextProfile]);
  const handlePressCamera = useCallback(() => {
    setIsEditVisible(true);
  }, []);

  const handleImagePickerResponse = useCallback((response) => {
    if (!response) return;
    if (response.success) {
      setAvatar(response.asset.uri);
    }
    setIsEditVisible(false);
  }, []);

  // Sync any value returned from a child selection screen
  useEffect(() => {
    const p = route.params;
    if (!p) {return;}
    setProfile(prev => {
      const next = {...prev};
      if (p.updatedWeight)  {next.currentWeight = p.updatedWeight;}
      if (p.updatedPrivacy) {next.privacy       = p.updatedPrivacy;}
      if (p.updatedGender)  {next.gender        = p.updatedGender;}
      if (p.updatedCountry) {next.country       = p.updatedCountry;}
      if (p.updatedDob)     {next.dateOfBirth   = p.updatedDob;}
      return next;
    });
  }, [route.params]);

  // Navigation handlers — each opens a dedicated screen
  const handleWeightPress = useCallback(() => {
    navigation.navigate(ROUTES.WEIGHT_UPDATE, {
      currentWeight: profile.currentWeight,
      currentPrivacy: profile.privacy || 'Public',
    });
  }, [navigation, profile.currentWeight, profile.privacy]);

  const handleGenderPress = useCallback(() => {
    navigation.navigate(ROUTES.GENDER_SELECTION, {
      currentGender: profile.gender,
    });
  }, [navigation, profile.gender]);

  const handleCountryPress = useCallback(() => {
    navigation.navigate(ROUTES.COUNTRY_SELECTION, {
      currentCountry: profile.country,
    });
  }, [navigation, profile.country]);

  const handleDobPress = useCallback(() => {
    navigation.navigate(ROUTES.DOB_SELECTION, {
      currentDob: profile.dateOfBirth,
    });
  }, [navigation, profile.dateOfBirth]);

  const handleBack = useCallback(() => {
    navigation.navigate(ROUTES.DRAWER, {
      screen: ROUTES.MY_PROFILE,
  });
  }, [navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header
        title={t('profile.updateProfile.title')}
        showBack
        onBackPress={handleBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <AppImage
              source={avatar ? { uri: avatar } : APP_IMAGES.userAvatar}
              style={styles.avatarImage}
              imageStyle={styles.avatarImageInternal}
              borderRadius={50}
            />
            <TouchableOpacity
              style={styles.cameraIconWrapper}
              onPress={handlePressCamera}
              activeOpacity={0.7}
              accessibilityLabel="Change profile photo"
              accessibilityRole="button"
            >
              <Icon name="camera-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name */}
        <InputBox
          label={t('profile.updateProfile.labels.name')}
          value={profile.name}
          onChangeText={text => setProfile(prev => ({...prev, name: text}))}
          autoCapitalize="words"
          autoCorrect={false}
          containerStyle={styles.fieldContainer}
        />

        {/* Bio */}
        <InputBox
          label={t('profile.updateProfile.labels.bio')}
          value={profile.bio}
          onChangeText={text => setProfile(prev => ({...prev, bio: text}))}
          multiline
          numberOfLines={3}
          autoCorrect={false}
          containerStyle={styles.fieldContainer}
        />

        {/* Edit Detail Cards — each navigates to its own screen */}
        <View style={styles.cardsSection}>
          <EditCard
            imageSource={APP_IMAGES.gender}
            label={t('profile.updateProfile.labels.gender')}
            value={profile.gender}
            onPress={handleGenderPress}
            colors={colors}
            styles={styles}
          />
          <EditCard
            imageSource={APP_IMAGES.country}
            label={t('profile.updateProfile.labels.country')}
            value={profile.country}
            onPress={handleCountryPress}
            colors={colors}
            styles={styles}
          />
          <EditCard
            imageSource={APP_IMAGES.currentWeight}
            label={t('profile.updateProfile.labels.currentWeight')}
            value={profile.currentWeight}
            onPress={handleWeightPress}
            colors={colors}
            styles={styles}
          />
          <EditCard
            imageSource={APP_IMAGES.dateOfBirth}
            label={t('profile.updateProfile.labels.dateOfBirth')}
            value={profile.dateOfBirth}
            onPress={handleDobPress}
            colors={colors}
            styles={styles}
          />
        </View>
      </ScrollView>



      {/* Media Picker Bottom Sheet */}
      <AppModal
        visible={isEditVisible}
        onClose={() => setIsEditVisible(false)}
        showHandle={true}
        showCloseButton={false}
      >
        <MediaPicker
          onSelect={handleImagePickerResponse}
          closeModal={() => setIsEditVisible(false)}
          title={t('modals.uploadProfilePhoto.title')}
        />
      </AppModal>
    </SafeContainer>
  );
};

export default memo(UpdateProfileScreen);
