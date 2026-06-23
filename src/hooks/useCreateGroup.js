import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ToastService } from '../components/common';
import groupService from '../api/services/groupService';

export const useCreateGroup = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('Public');
  const [requireApproval, setRequireApproval] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [activePickerType, setActivePickerType] = useState(null);

  const handleNameChange = useCallback((text) => {
    setGroupName(text);
    if (errors.groupName) {
      setErrors((prev) => ({ ...prev, groupName: null }));
    }
  }, [errors.groupName]);

  const handleDescriptionChange = useCallback((text) => {
    setDescription(text);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: null }));
    }
  }, [errors.description]);

  const handlePrivacyChange = useCallback((value) => {
    setPrivacy(value);
    if (errors.privacy) {
      setErrors((prev) => ({ ...prev, privacy: null }));
    }
  }, [errors.privacy]);

  const toggleRequireApproval = useCallback(() => {
    setRequireApproval((prev) => !prev);
  }, []);

  const openMediaPicker = useCallback((type) => {
    setActivePickerType(type);
    setIsMediaModalVisible(true);
  }, []);

  const closeMediaPicker = useCallback(() => {
    setIsMediaModalVisible(false);
    setActivePickerType(null);
  }, []);

  const handleImagePicked = useCallback((response) => {
    if (response && response.success && response.asset?.uri) {
      if (activePickerType === 'cover') {
        setCoverImage(response.asset.uri);
      } else if (activePickerType === 'avatar') {
        setAvatarImage(response.asset.uri);
      }
    }
    closeMediaPicker();
  }, [activePickerType, closeMediaPicker]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!groupName.trim()) {
      newErrors.groupName = t('home.createGroupForm.nameRequired');
    }
    if (!description.trim()) {
      newErrors.description = t('home.createGroupForm.descRequired');
    }
    if (!privacy) {
      newErrors.privacy = t('home.createGroupForm.privacyRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [groupName, description, privacy, t]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: groupName.trim(),
        description: description.trim(),
        privacy,
        requireApproval,
        coverImage,
        avatarImage,
      };

      const response = await groupService.createGroup(payload);

      if (response && response.success) {
        ToastService.show({
          type: 'success',
          message: t('home.createGroupForm.successMessage'),
        });
        
        navigation.goBack();
      } else {
        throw new Error('Failure response');
      }
    } catch (err) {
      console.error('[useCreateGroup] Error creating group:', err);
      ToastService.show({
        type: 'error',
        message: t('ERROR_MESSAGES.SERVER_ERROR') || 'Failed to create group. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [groupName, description, privacy, requireApproval, coverImage, avatarImage, validateForm, navigation, t]);

  return {
    groupName,
    description,
    privacy,
    requireApproval,
    coverImage,
    avatarImage,
    errors,
    loading,
    isMediaModalVisible,
    activePickerType,
    handleNameChange,
    handleDescriptionChange,
    handlePrivacyChange,
    toggleRequireApproval,
    openMediaPicker,
    closeMediaPicker,
    handleImagePicked,
    handleSubmit,
  };
};
