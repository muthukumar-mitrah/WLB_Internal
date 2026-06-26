import React, { memo } from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import { useCreateGroup } from '../../hooks/useCreateGroup';
import { SafeContainer, AppText, AppModal } from '../../components/common';
import MediaPicker from '../../components/common/MediaPicker';
import CreateGroupForm from './components/CreateGroupForm';

const CreateGroupScreen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();

  const {
    groupName,
    description,
    privacy,
    postingPermission,
    requireApproval,
    coverImage,
    avatarImage,
    errors,
    loading,
    isMediaModalVisible,
    handleNameChange,
    handleDescriptionChange,
    handlePrivacyChange,
    handlePostingPermissionChange,
    toggleRequireApproval,
    openMediaPicker,
    closeMediaPicker,
    handleImagePicked,
    handleSubmit,
  } = useCreateGroup();

  return (
    <SafeContainer edges={['top', 'bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />

      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}
        >
          <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.textPrimary} />
          <AppText style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('home.createGroupForm.title')}
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing[4], paddingTop: spacing[4] }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CreateGroupForm
          groupName={groupName}
          description={description}
          privacy={privacy}
          postingPermission={postingPermission}
          requireApproval={requireApproval}
          coverImage={coverImage}
          avatarImage={avatarImage}
          errors={errors}
          loading={loading}
          onNameChange={handleNameChange}
          onDescriptionChange={handleDescriptionChange}
          onPrivacyChange={handlePrivacyChange}
          onPostingPermissionChange={handlePostingPermissionChange}
          onToggleApproval={toggleRequireApproval}
          onOpenPicker={openMediaPicker}
          handleSubmit={handleSubmit}
        />
      </ScrollView>

      <AppModal
        visible={isMediaModalVisible}
        onClose={closeMediaPicker}
        showHandle={true}
        showCloseButton={false}
      >
        <MediaPicker
          onSelect={handleImagePicked}
          title={t('modals.uploadProfilePhoto.groupTitle')}
        />
      </AppModal>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 16,
  },
  backBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default memo(CreateGroupScreen);
