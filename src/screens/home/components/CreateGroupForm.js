import React, { memo, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { AppText, AppModal, PrivacyInfo } from '../../../components/common';

const CreateGroupForm = ({
  groupName,
  description,
  privacy,
  requireApproval,
  coverImage,
  avatarImage,
  errors,
  loading,
  onNameChange,
  onDescriptionChange,
  onPrivacyChange,
  onToggleApproval,
  onOpenPicker,
  handleSubmit,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleSelectPrivacy = (val) => {
    onPrivacyChange(val);
    setIsPrivacyModalOpen(false);
  };

  const privacyOptions = React.useMemo(() => [
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

  return (
    <View style={styles.container}>
      {/* Cover & Avatar Section */}
      <View style={styles.imageSection}>
        {/* Cover Image Block */}
        <TouchableOpacity
          style={[styles.coverContainer, { backgroundColor: colors.backgroundTertiary }]}
          activeOpacity={0.9}
          onPress={() => onOpenPicker('cover')}
        >
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={70} color={colors.textDisabled} />
            </View>
          )}

          {/* Cover Camera Overlay */}
          <View style={[styles.coverCameraBtn, { backgroundColor: colors.background }]}>
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Avatar Image Block */}
        <TouchableOpacity
          style={[
            styles.avatarContainer,
            {
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.background,
            },
          ]}
          activeOpacity={0.9}
          onPress={() => onOpenPicker('avatar')}
        >
          {avatarImage ? (
            <Image source={{ uri: avatarImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}

          {/* Avatar Camera Overlay */}
          <View style={[styles.avatarCameraBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Ionicons name="camera-outline" size={13} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Group Name Input */}
      <View style={styles.fieldContainer}>
        <AppText style={[styles.fieldLabel, { color: colors.textSecondary }]}>
          {t('home.createGroupForm.groupName')}
        </AppText>
        <TextInput
          value={groupName}
          onChangeText={onNameChange}
          placeholder={t('home.createGroupForm.groupNamePlaceholder')}
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
          {t('home.createGroupForm.description')}
        </AppText>
        <TextInput
          value={description}
          onChangeText={onDescriptionChange}
          placeholder={t('home.createGroupForm.descriptionPlaceholder')}
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

      {/* Privacy Selection */}
      <View style={styles.fieldContainer}>
        <AppText style={[styles.fieldLabel, { color: colors.textSecondary, marginBottom: spacing[2] }]}>
          {t('home.createGroupForm.privacy')}
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
            {privacy ? t(`home.createGroupForm.${privacy.toLowerCase()}`) : t('home.createGroupForm.choosePrivacy')}
          </AppText>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        {errors.privacy && (
          <AppText style={[styles.errorText, { color: colors.error }]}>
            {errors.privacy}
          </AppText>
        )}
      </View>

      {/* Require Approval Checkbox */}
      <TouchableOpacity
        style={styles.checkboxRow}
        activeOpacity={0.8}
        onPress={onToggleApproval}
      >
        <Ionicons
          name={requireApproval ? 'checkbox' : 'square-outline'}
          size={24}
          color={requireApproval ? colors.primary : colors.textSecondary}
        />
        <AppText style={[styles.checkboxText, { color: colors.textPrimary }]}>
          {t('home.createGroupForm.requireApproval')}
        </AppText>
      </TouchableOpacity>

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

      {/* CTA Create Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary, borderRadius: borderRadius.lg }]}
          onPress={() => {
            if (!loading && handleSubmit) {
              handleSubmit();
            }
          }}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <AppText style={styles.submitButtonText}>
              {t('home.createGroupForm.submitButton')}
            </AppText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    height: 180,
    marginBottom: 44,
    position: 'relative',
    width: '100%',
  },
  coverContainer: {
    borderRadius: 16,
    height: 180,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  coverImage: {
    height: '100%',
    width: '100%',
  },
  coverPlaceholder: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  coverCameraBtn: {
    alignItems: 'center',
    borderRadius: 18,
    bottom: 12,
    elevation: 3,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    width: 36,
  },
  avatarContainer: {
    borderRadius: 16,
    borderWidth: 3,
    bottom: -28,
    elevation: 4,
    height: 80,
    left: 16,
    overflow: 'visible',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    width: 80,
  },
  avatarImage: {
    borderRadius: 13,
    height: '100%',
    width: '100%',
  },
  avatarPlaceholder: {
    borderRadius: 13,
    height: '100%',
    width: '100%',
  },
  avatarCameraBtn: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    bottom: -6,
    elevation: 2,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 28,
  },
  fieldContainer: {
    marginBottom: 24,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  flatInput: {
    borderBottomWidth: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  dropdownContainer: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dropdownValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 4,
    paddingVertical: 4,
  },
  checkboxText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  privacyModalContent: {
    paddingVertical: 8,
  },
  privacyOptionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
  },
  privacyIconWrap: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  privacyTextContent: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },
  privacyOptionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  privacyOptionDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginTop: 2,
  },
  buttonWrapper: {
    marginTop: 40,
    paddingBottom: 20,
    width: '100%',
  },
  submitButton: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default memo(CreateGroupForm);
