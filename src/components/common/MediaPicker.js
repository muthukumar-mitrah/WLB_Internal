import React, { memo } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    Linking,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from './AppText';
import { t } from 'i18next';

const PERM = Platform.select({
    ios: {
        camera: PERMISSIONS.IOS.CAMERA,
        gallery: PERMISSIONS.IOS.PHOTO_LIBRARY,
    },
    android: {
        camera: PERMISSIONS.ANDROID.CAMERA,
        gallery:
            Platform.Version >= 33
                ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
                : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    },
});

const CROP_OPTIONS = {
    compressImageQuality: 0.8,
    showCropGuidelines: false,
    enableRotationGesture: true,
    mediaType: 'photo',
    cropperToolbarTitle: 'Adjust Photo',
};

const normalizeUri = (path) =>
    path && !path.startsWith('file://') ? `file://${path}` : path;

const toCroppedAsset = (result) => ({
    uri: normalizeUri(result.path),
    fileName: result.filename || `photo_${Date.now()}.jpg`,
    type: result.mime || 'image/jpeg',
    fileSize: result.size || 0,
});

const ensurePermission = async (type) => {
    const permission = PERM[type];
    const current = await check(permission);

    switch(current) {
        case RESULTS.GRANTED:
        case RESULTS.LIMITED:
            return 'granted';
        case RESULTS.UNAVAILABLE:
            return 'granted';
        case RESULTS.DENIED: {
            const after = await request(permission);
            if(after === RESULTS.GRANTED || after === RESULTS.LIMITED) return 'granted';
            if(after === RESULTS.BLOCKED) return 'blocked';
            return 'denied';
        }
        case RESULTS.BLOCKED:
            return 'blocked';
        default:
            return 'denied';
    }
};

const showSettingsAlert = (title, message) =>
    Alert.alert(title, message, [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);

const MediaPicker = ({ onSelect, title }) => {
    const { colors, spacing } = useTheme();

    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: spacing[4],
            height: 180,
        },
        optionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 5,
        },
        iconWrap: {
            width: 35,
            height: 35,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        label: {
            fontSize: 16,
            lineHeight: 20,
            marginLeft: spacing[2],
        },
        title: {
            marginVertical: spacing[2],
        },
    });

    const emit = (obj) => {
        if(onSelect) {
            try { onSelect(obj); } catch { /* ignore */ }
        }
    };

    const cropImage = async (rawUri) => {
        try {
            const result = await ImageCropPicker.openCropper({
                path: rawUri,
                ...CROP_OPTIONS,
            });
            emit({ success: true, asset: toCroppedAsset(result) });
        } catch(err) {
            if(err?.code === 'E_PICKER_CANCELLED') {
                emit({ success: false, error: 'cancelled' });
            } else {
                emit({ success: false, error: err?.message || 'crop_failed' });
            }
        }
    };

    const handlePickerResponse = (response) => {
        if(response.didCancel) {
            emit({ success: false, error: 'cancelled' });
            return;
        }
        if(response.errorCode) {
            emit({ success: false, error: response.errorMessage || response.errorCode });
            return;
        }
        const asset = response.assets?.[0];
        if(!asset) {
            emit({ success: false, error: 'no_asset' });
            return;
        }
        cropImage(asset.uri);
    };

    const handleCamera = async () => {
        const status = await ensurePermission('camera');

        if(status === 'blocked') {
            showSettingsAlert(
                'Camera Access Blocked',
                'Camera access has been permanently denied. Please enable it in Settings.',
            );
            emit({ success: false, error: 'cancelled' });
            return;
        }
        if(status === 'denied') {
            emit({ success: false, error: 'cancelled' });
            return;
        }

        launchCamera(
            { mediaType: 'photo', maxWidth: 1200, maxHeight: 1200, quality: 0.9, saveToPhotos: false },
            handlePickerResponse,
        );
    };

    const handleGallery = async () => {
        const status = await ensurePermission('gallery');

        if(status === 'blocked') {
            showSettingsAlert(
                'Photo Access Blocked',
                'Photo library access has been permanently denied. Please enable it in Settings.',
            );
            emit({ success: false, error: 'cancelled' });
            return;
        }
        if(status === 'denied') {
            emit({ success: false, error: 'cancelled' });
            return;
        }

        launchImageLibrary(
            { mediaType: 'photo', maxWidth: 1200, maxHeight: 1200, quality: 0.9 },
            handlePickerResponse,
        );
    };

    return (
        <View style={styles.container}>
            <AppText style={styles.title} variant='h3'>
                {title || t('modals.uploadProfilePhoto.title')}
            </AppText>
            <TouchableOpacity
                style={styles.optionRow}
                activeOpacity={0.8}
                onPress={handleCamera}
            >
                <View style={[styles.iconWrap, { backgroundColor: `${colors.primaryLight}35` }]}>
                    <Icon name="camera-outline" size={20} color={colors.primary} />
                </View>
                <AppText style={styles.label}>
                    {t('modals.uploadProfilePhoto.takePhoto')}
                </AppText>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.optionRow}
                activeOpacity={0.8}
                onPress={handleGallery}
            >
                <View style={[styles.iconWrap, { backgroundColor: `${colors.primaryLight}35` }]}>
                    <Icon name="image-outline" size={18} color={colors.primary} />
                </View>
                <AppText style={styles.label}>
                    {t('modals.uploadProfilePhoto.chooseGallery')}
                </AppText>
            </TouchableOpacity>
        </View>
    );
};

export default memo(MediaPicker);
