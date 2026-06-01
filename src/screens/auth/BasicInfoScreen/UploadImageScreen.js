import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer, AppModal } from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

// ─── Upload Zone ─────────────────────────────────────────────────────────────
// Shown when no file is selected
const UploadZone = memo(({ onPress, styles, colors, t }) => (
  <TouchableOpacity style={styles.uploadZone} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.uploadIconCircle}>
      <Image
        source={require('../../../assets/images/upload.png')}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />
    </View>
    <AppText style={styles.uploadLabel}>{t('uploadImage.tapToUpload')}</AppText>
    <AppText style={styles.uploadHint}>{t('uploadImage.uploadHint')}</AppText>
  </TouchableOpacity>
));

// ─── Progress Zone ────────────────────────────────────────────────────────────
// Shown while the photo is being uploaded
const ProgressZone = memo(({ progress, fileName, styles, colors, t }) => (
  <View style={styles.uploadZone}>
    <View style={styles.progressFileIconCircle}>
      <Image
        source={require('../../../assets/images/file.png')}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />
    </View>
    <View style={styles.progressRow}>
      <AppText style={styles.progressLabel}>{t('uploadImage.uploading')}</AppText>
      <AppText style={styles.progressPercent}>{Math.round(progress)}%</AppText>
    </View>
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
    </View>
    <AppText style={styles.fileName}>{fileName}</AppText>
  </View>
));

// ─── Screen ───────────────────────────────────────────────────────────────────
const UploadImageScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const timerRef = useRef(null);

  const simulateUpload = useCallback((name) => {
    setIsUploading(true);
    setUploadProgress(0);
    setFileName(name);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let current = 0;
    timerRef.current = setInterval(() => {
      current += Math.random() * 15 + 10; // random increment
      if (current >= 100) {
        current = 100;
        clearInterval(timerRef.current);
        setIsUploading(false);
      }
      setUploadProgress(current);
    }, 150);
  }, []);

  const handleImagePickerResponse = useCallback((response) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'An error occurred while picking the image.');
      return;
    }
    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      setSelectedImage(asset.uri);
      simulateUpload(asset.fileName || 'profile_image.jpg');
    }
  }, [simulateUpload]);

  // Opens custom bottom sheet modal
  const handlePickPhoto = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleNext = useCallback(() => {
    navigation.navigate(ROUTES.WELCOME_SURVEY);
  }, [navigation]);

  const showingProgress = isUploading || (selectedImage && uploadProgress < 100);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />

      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressDots}>
          <View style={styles.dotInactive} />
          <View style={styles.dotActive} />
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={handleNext}>
          <AppText variant="bodyMedium" color={colors.primary}>{t('common.buttons.skip')}</AppText>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={styles.uploadScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h2" color={colors.textPrimary} style={styles.uploadHeading}>
          {t('uploadImage.heading')}
        </AppText>

        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          {t('uploadImage.subtitle')}
        </AppText>

        {/* ── Avatar Preview ── */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            {selectedImage && uploadProgress === 100 ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('../../../assets/images/user.png')}
                style={{ width: 56, height: 56, tintColor: '#B0B8C4' }}
                resizeMode="contain"
              />
            )}
          </View>
          <TouchableOpacity style={styles.cameraBadge} onPress={handlePickPhoto}>
            <Image
              source={require('../../../assets/images/camera.png')}
              style={{ width: 14, height: 14, tintColor: '#FFFFFF' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* ── Hint ── */}
        <AppText style={[styles.hint, { color: colors.textSecondary }]}>
          {t('uploadImage.hint')}
        </AppText>

        {/* ── Upload / Progress Zone ── */}
        {showingProgress ? (
          <ProgressZone
            progress={uploadProgress}
            fileName={fileName}
            styles={styles}
            colors={colors}
            t={t}
          />
        ) : (
          <UploadZone
            onPress={handlePickPhoto}
            styles={styles}
            colors={colors}
            t={t}
          />
        )}
      </ScrollView>

      {/* ── Next Button (Fixed at bottom) ── */}
      <View style={styles.bottomBtnContainer}>
        <Button
          title={t('common.buttons.next')}
          onPress={handleNext}
          variant="primary"
          style={styles.nextBtn}
        />
      </View>

      {/* ── Camera/Gallery Selector Bottom Sheet ── */}
      <AppModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        showHandle={true}
        showCloseButton={true}
      >
        <AppText style={styles.modalTitle}>{t('modals.uploadProfilePhoto.title')}</AppText>
        <AppText style={styles.modalSubtitle}>
          {t('modals.uploadProfilePhoto.subtitle')}
        </AppText>

        <View style={styles.photoOptionsRow}>
          <TouchableOpacity
            style={styles.photoOptionCard}
            onPress={() => {
              setIsModalVisible(false);
              setTimeout(() => {
                const options = {
                  mediaType: 'photo',
                  maxWidth: 800,
                  maxHeight: 600,
                  quality: 0.8,
                  saveToPhotos: false,
                };
                launchCamera(options, handleImagePickerResponse);
              }, 300);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.photoOptionIconBg, { backgroundColor: colors.primarySurface }]}>
              <Icon name="camera" size={28} color={colors.primary} />
            </View>
            <AppText style={styles.photoOptionTitle}>{t('modals.uploadProfilePhoto.takePhoto')}</AppText>
            <AppText style={styles.photoOptionDesc}>{t('modals.uploadProfilePhoto.takePhotoDesc')}</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.photoOptionCard}
            onPress={() => {
              setIsModalVisible(false);
              setTimeout(() => {
                const options = {
                  mediaType: 'photo',
                  maxWidth: 800,
                  maxHeight: 600,
                  quality: 0.8,
                };
                launchImageLibrary(options, handleImagePickerResponse);
              }, 300);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.photoOptionIconBg, { backgroundColor: colors.successSurface }]}>
              <Icon name="image" size={28} color={colors.success} />
            </View>
            <AppText style={styles.photoOptionTitle}>{t('modals.uploadProfilePhoto.chooseGallery')}</AppText>
            <AppText style={styles.photoOptionDesc}>{t('modals.uploadProfilePhoto.chooseGalleryDesc')}</AppText>
          </TouchableOpacity>
        </View>
      </AppModal>
    </SafeContainer>
  );
};

export default memo(UploadImageScreen);
