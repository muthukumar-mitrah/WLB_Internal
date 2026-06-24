import { memo, useState, useCallback, useMemo } from 'react';
import { FlatList, Image, StatusBar, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import {
  AppText,
  SafeContainer,
  AppModal,
  Button,
  EmptyState,
  Header,
} from '../../../components/common';
import { createStyles } from './styles';

const BLOCKED_USERS_DATA = [
  { id: '1', name: 'Sarah M.', blockedDate: 'Jun 4, 2026', avatar: require('../../../assets/images/user.png') },
  { id: '2', name: 'James L.', blockedDate: 'Jun 4, 2026', avatar: require('../../../assets/images/user.png') },
  { id: '3', name: 'Emily R.', blockedDate: 'Jun 4, 2026', avatar: require('../../../assets/images/user.png') },
  { id: '4', name: 'Michael T.', blockedDate: 'Jun 4, 2026', avatar: require('../../../assets/images/user.png') },
  { id: '5', name: 'Olivia K.', blockedDate: 'Jun 4, 2026', avatar: require('../../../assets/images/user.png') },
];

const BlockedUserItem = memo(({ item, onUnblock, styles, colors, t }) => (
  <View style={styles.userRow}>
    <Image source={item.avatar} style={styles.avatar} resizeMode="cover" />

    <View style={styles.userInfo}>
      <AppText variant="bodyMedium" color={colors.textPrimary}>
        {item.name}
      </AppText>
      <AppText variant="captionSmall" color={colors.textSecondary} style={styles.blockedDate}>
        {t('blockedUsers.blockedOn', { date: item.blockedDate })}
      </AppText>
    </View>

    <TouchableOpacity
      onPress={() => onUnblock(item)}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <AppText variant="captionMedium" color={colors.primary}>
        {t('blockedUsers.unblock')}
      </AppText>
    </TouchableOpacity>
  </View>
));

const BlockedUsersScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const [blockedUsers, setBlockedUsers] = useState(BLOCKED_USERS_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handlePrevious = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleUnblockPress = useCallback((user) => {
    setSelectedUser(user);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedUser(null);
  }, []);

  const handleConfirmUnblock = useCallback(() => {
    if (selectedUser) {
      setBlockedUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    }
    setModalVisible(false);
    setSelectedUser(null);
  }, [selectedUser]);

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(({ item }) => (
    <BlockedUserItem
      item={item}
      onUnblock={handleUnblockPress}
      styles={styles}
      colors={colors}
      t={t}
    />
  ), [handleUnblockPress, styles, colors, t]);

  return (
    <SafeContainer edges={['top']} style={styles.container}>

      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('blockedUsers.title')} showBack titleAlign="left" transparent={true} onBackPress={handlePrevious} />


      {/* Blocked users list or empty state */}
      {blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title={t('blockedUsers.emptyTitle')}
          description={t('blockedUsers.emptyDescription')}
        />
      )}

      {/* Unblock confirmation modal */}
      <AppModal
        visible={modalVisible}
        onClose={handleCloseModal}
        position="center"
        showHandle={false}
        showCloseButton={false}
      >

        <TouchableOpacity
          onPress={handleCloseModal}
          style={styles.modalCloseButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppText variant="buttonSmall" color={colors.textSecondary}>
            ✕
          </AppText>
        </TouchableOpacity>

        <View style={styles.modalBody}>
          <Image
            source={selectedUser?.avatar}
            style={styles.modalAvatar}
            resizeMode="cover"
          />

          <AppText variant="h3" color={colors.textPrimary} style={styles.modalTitle}>
            {t('blockedUsers.unblockTitle', { name: selectedUser?.name || '' })}
          </AppText>

          <AppText variant="body" color={colors.textSecondary} style={styles.modalDescription}>
            {t('blockedUsers.unblockDescription')}
          </AppText>

          <View style={styles.modalButtons}>
            <Button
              title={t('blockedUsers.cancel')}
              onPress={handleCloseModal}
              variant="gray"
              style={styles.modalButtonCancel}
            />
            <Button
              title={t('blockedUsers.unblock')}
              onPress={handleConfirmUnblock}
              variant="primary"
              style={styles.modalButtonConfirm}
            />
          </View>
        </View>
      </AppModal>
    </SafeContainer>
  );
};

export default memo(BlockedUsersScreen);
