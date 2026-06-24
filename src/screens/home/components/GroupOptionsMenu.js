import React, { memo, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../theme';
import { APP_IMAGES } from '../../../constants';
import { fontFamily } from '../../../theme/fonts';
import AppText from '../../../components/common/AppText';
import AppModal from '../../../components/common/AppModal';
import { useTranslation } from '../../../i18n/useTranslation';
import { palette } from '../../../theme/colors';

const GroupOptionsMenu = ({ visible, onClose, isAdmin, isMember, isJoined, onSelect }) => {
  const { colors, borderRadius, spacing, isDark } = useTheme();
  const { t } = useTranslation();

  const options = useMemo(() => {
    const list = [];
    if (isAdmin) {
      list.push(
        {
          key: 'editGroup',
          label: t('groupDetails.options.editGroup'),
          icon: 'pencil-outline',
          iconType: 'vector',
        },
        {
          key: 'shareGroup',
          label: t('groupDetails.options.shareGroup'),
          icon: APP_IMAGES.shareGroup,
        },
        {
          key: 'copyLink',
          label: t('groupDetails.options.copyLink'),
          icon: APP_IMAGES.copyLinkIcon,
        },
        {
          key: 'muteNotifications',
          label: t('groupDetails.options.muteNotifications'),
          icon: APP_IMAGES.notificationIcon,
        },
        {
          key: 'deleteGroup',
          label: t('groupDetails.options.deleteGroup'),
          icon: APP_IMAGES.deleteIcon,
          destructive: true,
        },
        {
          key: 'leaveGroup',
          label: t('groupDetails.options.leaveGroup'),
          icon: APP_IMAGES.leaveGroup,
          destructive: true,
        }
      );
    } else if (isMember || isJoined) {
      list.push(
        {
          key: 'muteNotifications',
          label: t('groupDetails.options.muteNotifications'),
          icon: APP_IMAGES.notificationIcon,
        },
        {
          key: 'shareGroup',
          label: t('groupDetails.options.shareGroup'),
          icon: APP_IMAGES.shareGroup,
        },
        {
          key: 'copyLink',
          label: t('groupDetails.options.copyLink'),
          icon: APP_IMAGES.copyLinkIcon,
        },
        {
          key: 'leaveGroup',
          label: t('groupDetails.options.leaveGroup'),
          icon: APP_IMAGES.leaveGroup,
          destructive: true,
        }
      );
    } else {
      list.push(
        {
          key: 'shareGroup',
          label: t('groupDetails.options.shareGroup'),
          icon: APP_IMAGES.shareGroup,
        },
        {
          key: 'copyLink',
          label: t('groupDetails.options.copyLink'),
          icon: APP_IMAGES.copyLinkIcon,
        }
      );
    }
    return list;
  }, [isAdmin, isMember, isJoined, t]);

  const nonDestructiveOptions = useMemo(() => options.filter(o => !o.destructive), [options]);
  const destructiveOptions = useMemo(() => options.filter(o => o.destructive), [options]);

  const renderOptionRow = (opt) => {
    const isDestructive = opt.destructive;
    const textColor = isDestructive ? colors.error : colors.textPrimary;
    const iconColor = isDestructive ? colors.error : colors.iconPrimary;

    return (
      <TouchableOpacity
        key={opt.key}
        style={styles.sheetRow}
        activeOpacity={0.65}
        onPress={() => {
          onSelect?.(opt.key);
          onClose();
        }}
      >
        <View style={styles.sheetRowIconWrapper}>
          {opt.iconType === 'vector' ? (
            <Icon
              name={opt.icon}
              size={20}
              color={iconColor}
            />
          ) : (
            <Image
              source={opt.icon}
              style={[styles.sheetRowIcon, { tintColor: iconColor }]}
              resizeMode="contain"
            />
          )}
        </View>
        <AppText style={[styles.sheetRowLabel, { color: textColor }]}>
          {opt.label}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      position="center"
      showHandle={false}
      showCloseButton={false}
      closeOnOverlay={true}
      overlayColor="transparent"
      style={[
        styles.popupMenu,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.textPrimary,
          borderTopLeftRadius: borderRadius['2xl'],
          borderTopRightRadius: borderRadius['2xl'],
          borderRadius: borderRadius['2xl'],
          paddingBottom: spacing[2],
        }
      ]}
    >
      <View style={styles.menuContainer}>
        {nonDestructiveOptions.map(renderOptionRow)}
        
        {destructiveOptions.length > 0 && (
          <>
            <View style={[styles.divider, { backgroundColor: isDark ? palette.gray700 : colors.divider }]} />
            {destructiveOptions.map(renderOptionRow)}
          </>
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  popupMenu: {
    position: 'absolute',
    top: 80,
    right: 16,
    width: 220,
    alignSelf: undefined,
    elevation: 8,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    paddingHorizontal: 0,
  },
  menuContainer: {
    paddingVertical: 8,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
  },
  sheetRowIconWrapper: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetRowIcon: {
    width: 20,
    height: 20,
  },
  sheetRowLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 6,
  },
});

export default memo(GroupOptionsMenu);
