import React, { createContext, useContext, useState, useCallback } from 'react';
import { notificationMockData } from '../constants/mockData';
import { ToastService } from '../components/common/Toast';
import {useTranslation} from 'react-i18next';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(notificationMockData);
  const {t} = useTranslation();

  // Mark a single notification as read (used for common tap actions)
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  }, []);

  // Accept a buddy request — sets isRead + status, hides action buttons
  const acceptBuddyRequest = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id
          ? { ...notif, isRead: true, status: 'accepted' }
          : notif
      )
    );
    ToastService.show({
      type: 'success',
      message: t(
        'home.notifications.toasts.buddyAccept',
        'Buddy request accepted successfully.'
      ),
    });
  }, []);

  // Delete a notification — removes it from the list entirely
  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    ToastService.show({
      type: 'success',
      message: t(
        'home.notifications.toasts.buddyDelete',
        'Buddy request deleted successfully.'
      ),
    });
  }, []);

  // Accept a group join request — sets isRead + status, hides action buttons
  const joinGroupRequest = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id
          ? { ...notif, isRead: true, status: 'joined' }
          : notif
      )
    );
    ToastService.show({
      type: 'success',
      message: t(
        'home.notifications.toasts.joinSuccess',
        'Joined successfully.'
      ),
    });
  }, []);

  // Mark every notification as read (used by the "Mark all as read" menu action)
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        acceptBuddyRequest,
        deleteNotification,
        joinGroupRequest,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
