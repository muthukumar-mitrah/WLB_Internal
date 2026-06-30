import React, { memo, useState, useMemo, useCallback } from 'react';
import { View, SectionList, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../theme';
import { Header, SafeContainer, EmptyState, ToastService, AppModal, AppText, Tabs } from '../../../components/common';
import NotificationItem from '../../../components/NotificationItem';
import { useNotification } from '../../../context/NotificationContext';
import { ROUTES, NOTIFICATION_TABS } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

const NotificationsScreen = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing, borderRadius }), [colors, spacing, borderRadius]);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('All');
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    notifications,
    markAsRead,
    acceptBuddyRequest,
    deleteNotification,
    joinGroupRequest,
    markAllAsRead,
  } = useNotification();

  // Filter notifications based on tab
  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'Unread':
        return notifications.filter((n) => !n.isRead);
      case 'Buddies':
        return notifications.filter((n) => n.type === 'buddyRequest');
      case 'All':
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  // Group notifications into Today / Earlier sections
  const sections = useMemo(() => {
    const today = filteredNotifications.filter((n) => n.section === 'Today');
    const earlier = filteredNotifications.filter((n) => n.section === 'Earlier');

    const list = [];
    if (today.length > 0) {
      list.push({
        title: t('home.notifications.sections.today', 'Today'),
        data: today,
      });
    }
    if (earlier.length > 0) {
      list.push({
        title: t('home.notifications.sections.earlier', 'Earlier'),
        data: earlier,
      });
    }
    return list;
  }, [filteredNotifications, t]);

  const handleNotificationPress = useCallback((item) => {
    // 1. Mark as read immediately
    markAsRead(item.id);

    // 2. Perform type-based action or navigation placeholder
    if (item.type === 'groupJoinRequest' || item.type === 'groupPost') {
      // Navigate to group details (using route or placeholder toast)
      try {
        navigation.navigate(ROUTES.GROUP_DETAILS, { groupId: '1' });
      } catch (e) {
        ToastService.show({
          type: 'info',
          message: t('home.notifications.toasts.comingSoon', 'Coming Soon'),
        });
      }
    } else {
      // Like / Comment / Common -> Show Coming Soon toast for post details
      ToastService.show({
        type: 'info',
        message: t('home.notifications.toasts.comingSoon', 'Coming Soon'),
      });
    }
  }, [markAsRead, navigation, t]);

  const handleViewDetails = useCallback((item) => {
    markAsRead(item.id);
    try {
      navigation.navigate(ROUTES.GROUP_DETAILS, { groupId: '1' });
    } catch (e) {
      ToastService.show({
        type: 'info',
        message: t('home.notifications.toasts.comingSoon', 'Coming Soon'),
      });
    }
  }, [markAsRead, navigation, t]);

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <AppText variant="subtitle" style={styles.sectionHeaderText}>
        {title}
      </AppText>
    </View>
  ), [styles]);

  const renderItem = useCallback(({ item }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
      onAccept={acceptBuddyRequest}
      onDelete={deleteNotification}
      onJoin={joinGroupRequest}
      onView={handleViewDetails}
    />
  ), [handleNotificationPress, acceptBuddyRequest, deleteNotification, joinGroupRequest, handleViewDetails]);

  const renderHeaderRight = () => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Menu Options"
      onPress={() => setMenuVisible(true)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <MaterialCommunityIcons
        name="dots-vertical"
        size={24}
        color={colors.textPrimary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.safeArea}>
      {/* Header */}
      <Header
        title={t('home.notifications.title', 'Notifications')}
        titleAlign="left"
        showBack={true}
        rightComponent={renderHeaderRight()}
      />

      {/* Tabs */}
      <Tabs
        tabs={NOTIFICATION_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* Notifications List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={
              <MaterialIcons
                name="notifications-none"
                size={48}
                color={colors.textTertiary}
              />
            }
            title={t('home.notifications.emptyTitle', 'No notifications yet')}
            description={t(
              'home.notifications.emptyDescription',
              'You will see updates, buddy requests, and activity alerts here.'
            )}
            style={styles.emptyState}
          />
        }
      />

      {/* Context Menu Modal */}
      <AppModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position="center"
        showHandle={false}
        showCloseButton={false}
        closeOnOverlay={true}
        overlayColor="rgba(0,0,0,0.3)"
        style={styles.popupMenu}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            markAllAsRead();
            setMenuVisible(false);
            ToastService.show({
              type: 'success',
              message: t('home.notifications.toasts.allMarkedRead', 'All notifications marked as read.'),
            });
          }}
        >
          <MaterialCommunityIcons
            name="check-all"
            size={20}
            color={colors.textPrimary}
            style={styles.menuIcon}
          />
          <AppText variant="bodyMedium" style={styles.menuText}>
            Mark all as read
          </AppText>
        </TouchableOpacity>
      </AppModal>
    </SafeContainer>
  );
};

export default memo(NotificationsScreen);
