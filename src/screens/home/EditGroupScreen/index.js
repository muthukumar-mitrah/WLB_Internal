import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { ROUTES } from '../../../constants';
import {
  Header,
  AppText,
  SafeContainer,
  ToastService,
  AppModal,
  PrivacyInfo,
} from '../../../components/common';
import MediaPicker from '../../../components/common/MediaPicker';
import groupService from '../../../api/services/groupService';
import createStyles from './styles';

const EditGroupScreen = () => {
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows, isDark }),
    [colors, spacing, borderRadius, shadows, isDark]
  );

  const { groupId } = route.params || {};

  // Form State
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [postingPermission, setPostingPermission] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [admins, setAdmins] = useState([]);

  // UI Control State
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isPostingPermissionModalOpen, setIsPostingPermissionModalOpen] = useState(false);
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [mediaModalType, setMediaModalType] = useState('cover'); // 'cover' or 'avatar'
  const [activeAdminMenuId, setActiveAdminMenuId] = useState(null);
  const [adminMenuPageY, setAdminMenuPageY] = useState(300);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Fetch initial group details
  useEffect(() => {
    let active = true;
    const fetchDetails = async () => {
      try {
        const detailsRes = await groupService.getGroupDetails(groupId);
        if (active && detailsRes.data) {
          const data = detailsRes.data;
          setGroupName(data.groupName || '');
          setDescription(data.groupDescription || '');
          setPrivacy(data.privacyType === 'private' ? 'Private' : 'Public');
          setPostingPermission(data.postingPermission || 'allMembers');

          if (data.groupCoverImage) {
            setCoverImage(
              typeof data.groupCoverImage === 'number'
                ? Image.resolveAssetSource(data.groupCoverImage).uri
                : data.groupCoverImage
            );
          }
          if (data.groupProfileImage) {
            setAvatarImage(
              typeof data.groupProfileImage === 'number'
                ? Image.resolveAssetSource(data.groupProfileImage).uri
                : data.groupProfileImage
            );
          }

          // Fetch or use mock admins
          setAdmins([
            {
              id: 'a1',
              name: data.admin?.name || 'Olivia K.',
              role: t('groupDetails.editGroup.admin'),
              profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
            },
            {
              id: 'a2',
              name: 'Eleanor Pena',
              role: t('groupDetails.editGroup.admin'),
              profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            },
          ]);
        }
      } catch (err) {
        console.warn('[EditGroupScreen] Error fetching group details:', err);
      }
    };

    fetchDetails();

    return () => {
      active = false;
    };
  }, [groupId, t]);

  // Dropdown Options Setup
  const privacyOptions = useMemo(() => [
    {
      key: 'Public',
      icon: 'earth-outline',
      title: t('home.privacyInfo.group.publicTitle'),
      description: t('home.privacyInfo.group.publicDesc'),
    },
    {
      key: 'Private',
      icon: 'lock-closed-outline',
      title: t('home.privacyInfo.group.privateTitle'),
      description: t('home.privacyInfo.group.privateDesc'),
    },
  ], [t]);

  const postingPermissionOptions = useMemo(() => [
    {
      key: 'allMembers',
      title: t('home.postingPermissionInfo.allMembersTitle'),
      description: t('home.postingPermissionInfo.allMembersDesc'),
    },
    {
      key: 'adminsOnly',
      title: t('home.postingPermissionInfo.adminsOnlyTitle'),
      description: t('home.postingPermissionInfo.adminsOnlyDesc'),
    },
  ], [t]);

  // Select handlers
  const handleSelectPrivacy = useCallback((val) => {
    setPrivacy(val);
    setIsPrivacyModalOpen(false);
  }, []);

  const handleSelectPostingPermission = useCallback((val) => {
    setPostingPermission(val);
    setIsPostingPermissionModalOpen(false);
  }, []);

  // Image Picker setup
  const openMediaPicker = useCallback((type) => {
    setMediaModalType(type);
    setIsMediaModalVisible(true);
  }, []);

  const handleImagePicked = useCallback((response) => {
    if (response?.success && response?.asset?.uri) {
      if (mediaModalType === 'cover') {
        setCoverImage(response.asset.uri);
      } else {
        setAvatarImage(response.asset.uri);
      }
    }
    setIsMediaModalVisible(false);
  }, [mediaModalType]);

  // Form Validation & Save
  const handleSaveChanges = useCallback(async () => {
    const nextErrors = {};
    if (!groupName.trim()) {
      nextErrors.groupName = t('groupDetails.editGroup.nameEmpty');
    }
    if (!description.trim()) {
      nextErrors.description = t('groupDetails.editGroup.descriptionEmpty');
    }
    if (!privacy) {
      nextErrors.privacy = t('groupDetails.editGroup.privacyRequired');
    }
    if (!postingPermission) {
      nextErrors.postingPermission = t('groupDetails.editGroup.postingPermissionRequired');
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await groupService.updateGroup(groupId, {
        groupName: groupName.trim(),
        groupDescription: description.trim(),
        privacyType: privacy.toLowerCase(),
        postingPermission,
        groupCoverImage: coverImage,
        groupProfileImage: avatarImage,
      });

      ToastService.show({
        type: 'success',
        message: 'Group updated successfully.',
      });
      navigation.goBack();
    } catch (err) {
      ToastService.show({
        type: 'error',
        message: 'Failed to update group details.',
      });
    } finally {
      setLoading(false);
    }
  }, [groupId, groupName, description, privacy, postingPermission, coverImage, avatarImage, navigation, t]);

  // Admin row option actions
  const handleAdminMenuPress = useCallback((admin, event) => {
    const { pageY } = event.nativeEvent;
    setActiveAdminMenuId(admin.id);
    setSelectedAdmin(admin);
    setAdminMenuPageY(pageY);
  }, []);

  const handleAdminOptionSelect = useCallback((action) => {
    if (!selectedAdmin) return;
    setActiveAdminMenuId(null);
    switch (action) {
      case 'viewProfile':
        navigation.navigate(ROUTES.VIEW_PROFILE, { userId: selectedAdmin.name });
        break;
      case 'message':
        ToastService.show({
          type: 'info',
          message: `${t('groupDetails.options.message')} ${selectedAdmin.name}...`,
        });
        break;
      case 'removeFromAdmin':
        if (admins.length <= 1) {
          ToastService.show({
            type: 'error',
            message: 'Cannot remove the last group admin.',
          });
          return;
        }
        setAdmins((prev) => prev.filter((a) => a.id !== selectedAdmin.id));
        ToastService.show({
          type: 'success',
          message: `${selectedAdmin.name} removed from admin successfully.`,
        });
        break;
      default:
        break;
    }
  }, [selectedAdmin, admins.length, navigation, t]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header
        title={t('groupDetails.editGroup.title')}
        showBack
        titleAlign="left"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cover & Avatar Section */}
        <View style={styles.imageSection}>
          {/* Cover Container */}
          <TouchableOpacity
            style={[styles.coverContainer, { backgroundColor: colors.backgroundTertiary }]}
            activeOpacity={0.9}
            onPress={() => openMediaPicker('cover')}
          >
            {coverImage ? (
              <Image source={typeof coverImage === 'string' ? { uri: coverImage } : coverImage} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="image-outline" size={70} color={colors.textDisabled} />
              </View>
            )}

            <View style={[styles.coverCameraBtn, { backgroundColor: colors.background }]}>
              <Ionicons name="camera-outline" size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Profile/Avatar Container */}
          <TouchableOpacity
            style={[
              styles.avatarContainer,
              {
                backgroundColor: colors.backgroundTertiary,
                borderColor: colors.background,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => openMediaPicker('avatar')}
          >
            {avatarImage ? (
              <Image source={typeof avatarImage === 'string' ? { uri: avatarImage } : avatarImage} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}

            <View style={[styles.avatarCameraBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="camera-outline" size={13} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Group Name Input */}
        <View style={styles.fieldContainer}>
          <AppText style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            {t('groupDetails.editGroup.groupName')}
          </AppText>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder={t('groupDetails.editGroup.groupName')}
            placeholderTextColor={colors.inputPlaceholder}
            style={[
              styles.flatInput,
              {
                color: colors.textPrimary,
                borderBottomColor: errors.groupName ? colors.error : colors.border,
              },
            ]}
          />
          {errors.groupName && (
            <AppText style={[styles.errorText, { color: colors.error }]}>
              {errors.groupName}
            </AppText>
          )}
        </View>

        {/* Description Input */}
        <View style={styles.fieldContainer}>
          <AppText style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            {t('groupDetails.editGroup.description')}
          </AppText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('groupDetails.editGroup.description')}
            placeholderTextColor={colors.inputPlaceholder}
            multiline
            style={[
              styles.flatInput,
              {
                color: colors.textPrimary,
                borderBottomColor: errors.description ? colors.error : colors.border,
                paddingBottom: spacing[2],
              },
            ]}
          />
          {errors.description && (
            <AppText style={[styles.errorText, { color: colors.error }]}>
              {errors.description}
            </AppText>
          )}
        </View>

        {/* Privacy Dropdown */}
        <View style={styles.fieldContainer}>
          <AppText style={[styles.fieldLabel, { color: colors.textSecondary, marginBottom: spacing[2] }]}>
            {t('groupDetails.editGroup.privacy')}
          </AppText>
          <TouchableOpacity
            style={[
              styles.dropdownContainer,
              {
                borderColor: errors.privacy ? colors.error : colors.border,
                backgroundColor: colors.inputBackground,
                borderRadius: borderRadius.lg,
              },
            ]}
            activeOpacity={0.7}
            onPress={() => setIsPrivacyModalOpen(true)}
          >
            <AppText
              style={[
                styles.dropdownValue,
                { color: privacy ? colors.textPrimary : colors.textSecondary },
              ]}
            >
              {privacy ? t(`home.createGroupForm.${privacy.toLowerCase()}`) : t('groupDetails.editGroup.choosePrivacy')}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {errors.privacy && (
            <AppText style={[styles.errorText, { color: colors.error }]}>
              {errors.privacy}
            </AppText>
          )}
        </View>

        {/* Posting Permission Dropdown */}
        <View style={styles.fieldContainer}>
          <AppText style={[styles.fieldLabel, { color: colors.textSecondary, marginBottom: spacing[2] }]}>
            {t('groupDetails.editGroup.postingPermission')}
          </AppText>
          <TouchableOpacity
            style={[
              styles.dropdownContainer,
              {
                borderColor: errors.postingPermission ? colors.error : colors.border,
                backgroundColor: colors.inputBackground,
                borderRadius: borderRadius.lg,
              },
            ]}
            activeOpacity={0.7}
            onPress={() => setIsPostingPermissionModalOpen(true)}
          >
            <AppText
              style={[
                styles.dropdownValue,
                { color: postingPermission ? colors.textPrimary : colors.textSecondary },
              ]}
            >
              {postingPermission
                ? postingPermission === 'adminsOnly'
                  ? t('groupDetails.editGroup.adminOnly')
                  : t('home.createGroupForm.allMembers')
                : t('groupDetails.editGroup.choosePermission')}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {errors.postingPermission && (
            <AppText style={[styles.errorText, { color: colors.error }]}>
              {errors.postingPermission}
            </AppText>
          )}
        </View>

        {/* Admin Section */}
        <View style={styles.adminList}>
          <AppText style={[styles.adminLabel, { color: colors.textSecondary }]}>
            {t('groupDetails.editGroup.admin')}
          </AppText>
          {admins.map((admin) => (
            <View key={admin.id} style={[styles.adminCardRow, { borderBottomColor: colors.divider, borderBottomWidth: 0.5 }]}>
              <Image source={{ uri: admin.profileImage }} style={styles.adminAvatar} />
              <View style={styles.adminInfo}>
                <AppText style={[styles.adminName, { color: colors.textPrimary }]}>
                  {admin.name}
                </AppText>
                <AppText style={[styles.adminRole, { color: colors.textSecondary }]}>
                  {admin.role}
                </AppText>
              </View>
              <TouchableOpacity
                style={styles.adminMenuBtn}
                onPress={(e) => handleAdminMenuPress(admin, e)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Save & Cancel CTA Buttons */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary, borderRadius: borderRadius.lg }]}
            onPress={handleSaveChanges}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <AppText style={[styles.submitButtonText, { color: colors.textInverse }]}>
                {t('groupDetails.editGroup.saveChanges')}
              </AppText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <AppText style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
              {t('groupDetails.editGroup.cancel')}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Privacy Option Selection Modal */}
      <AppModal
        visible={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        showHandle={true}
        showCloseButton={false}
      >
        <PrivacyInfo
          title={t('home.privacyInfo.group.title')}
          options={privacyOptions}
          selectedValue={privacy}
          onSelect={handleSelectPrivacy}
          variant="card"
        />
      </AppModal>

      {/* Posting Permission Selection Modal */}
      <AppModal
        visible={isPostingPermissionModalOpen}
        onClose={() => setIsPostingPermissionModalOpen(false)}
        showHandle={true}
        showCloseButton={false}
      >
        <PrivacyInfo
          title={t('home.postingPermissionInfo.title')}
          options={postingPermissionOptions}
          selectedValue={postingPermission}
          onSelect={handleSelectPostingPermission}
          variant="card"
        />
      </AppModal>

      {/* Cover / Avatar Native Media Picker Modal */}
      <AppModal
        visible={isMediaModalVisible}
        onClose={() => setIsMediaModalVisible(false)}
        showHandle={true}
        showCloseButton={false}
      >
        <MediaPicker
          onSelect={handleImagePicked}
          title={t('modals.uploadProfilePhoto.groupTitle')}
        />
      </AppModal>

      {/* Admin Popup Actions Menu */}
      <AppModal
        visible={activeAdminMenuId !== null}
        onClose={() => setActiveAdminMenuId(null)}
        position="top"
        showHandle={false}
        showCloseButton={false}
        closeOnOverlay={true}
        overlayColor="transparent"
        style={[
          styles.adminPopupMenu,
          {
            top: Math.max(100, adminMenuPageY - 20),
            backgroundColor: colors.surface,
            shadowColor: colors.textPrimary,
            borderRadius: borderRadius.lg,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleAdminOptionSelect('viewProfile')}
        >
          <AppText style={[styles.menuRowText, { color: colors.textPrimary }]}>
            {t('groupDetails.editGroup.viewProfile')}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleAdminOptionSelect('message')}
        >
          <AppText style={[styles.menuRowText, { color: colors.textPrimary }]}>
            {t('groupDetails.editGroup.message')}
          </AppText>
        </TouchableOpacity>
        {admins.length > 1 && (
          <>
            <View style={[styles.menuDivider, { backgroundColor: isDark ? '#374151' : colors.divider }]} />
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => handleAdminOptionSelect('removeFromAdmin')}
            >
              <AppText style={[styles.menuRowText, { color: colors.error }]}>
                {t('groupDetails.editGroup.removeFromAdmin')}
              </AppText>
            </TouchableOpacity>
          </>
        )}
      </AppModal>
    </SafeContainer>
  );
};

export default memo(EditGroupScreen);
