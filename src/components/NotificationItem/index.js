import React, { memo, useMemo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme';
import AppText from '../common/AppText';
import createStyles from './styles';
import { useTranslation } from '../../i18n/useTranslation';

const NotificationItem = ({
  notification,
  onPress,
  onAccept,
  onDelete,
  onJoin,
  onView,
}) => {
  const { colors, spacing, borderRadius, isDark } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing, borderRadius, isDark }), [colors, spacing, borderRadius, isDark]);
  const { t } = useTranslation();

  const { type, title, message, time, isRead, user, status } = notification;

  // Compute badge settings
  const badgeConfig = useMemo(() => {
    switch (type) {
      case 'buddyRequest':
        return {
          bg: '#7C3AED', // Purple
          icon: <MaterialIcons name="person" size={12} color="#FFF" />,
        };
      case 'like':
        return {
          bg: '#EF4444', // Red
          icon: <MaterialIcons name="favorite" size={11} color="#FFF" />,
        };
      case 'comment':
        return {
          bg: '#10B981', // Green
          icon: <MaterialIcons name="chat-bubble" size={11} color="#FFF" />,
        };
      case 'groupJoinRequest':
        return {
          bg: '#F59E0B', // Orange/Amber
          icon: <MaterialIcons name="group" size={12} color="#FFF" />,
        };
      case 'groupPost':
        return {
          bg: '#D97706', // Brownish Orange
          icon: <MaterialIcons name="group" size={12} color="#FFF" />,
        };
      default:
        return {
          bg: colors.primary,
          icon: <MaterialIcons name="notifications" size={12} color="#FFF" />,
        };
    }
  }, [type, colors]);

  // A notification is visually "read" once it has been acted on (status set)
  // OR when it was already read.
  const isActioned = Boolean(status);
  const itemStyle = [
    styles.container,
    (isRead || isActioned) ? styles.readBackground : styles.unreadBackground,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(notification)}
      style={itemStyle}
    >
      <View style={styles.headerRow}>
        {/* Avatar with Badge */}
        <View style={styles.avatarContainer}>
          <Image
            source={user?.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={[styles.badge, { backgroundColor: badgeConfig.bg }]}>
            {badgeConfig.icon}
          </View>
        </View>

        {/* Content Info */}
        <View style={styles.contentContainer}>
          <AppText variant="subtitle" style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="body" style={styles.message}>
            {message}
          </AppText>
          <AppText variant="caption" style={styles.time}>
            {time}
          </AppText>
        </View>
      </View>

      {/* Action Buttons — hidden once a status has been set */}
      {type === 'buddyRequest' && !status && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onAccept?.(notification.id)}
            style={[styles.button, styles.primaryButton]}
          >
            <AppText style={styles.primaryButtonText}>
              {t('home.notifications.buttons.accept', 'Accept')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onDelete?.(notification.id)}
            style={[styles.button, styles.secondaryButton]}
          >
            <AppText style={styles.secondaryButtonText}>
              {t('home.notifications.buttons.delete', 'Delete')}
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {type === 'groupJoinRequest' && !status && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onJoin?.(notification.id)}
            style={[styles.button, styles.primaryButton]}
          >
            <AppText style={styles.primaryButtonText}>
              {t('home.notifications.buttons.join', 'Join')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onView?.(notification)}
            style={[styles.button, styles.secondaryButton]}
          >
            <AppText style={styles.secondaryButtonText}>
              {t('home.notifications.buttons.view', 'View')}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(NotificationItem);
