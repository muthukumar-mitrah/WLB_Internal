import React, { memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../theme';
import { useTranslation } from '../../../../i18n/useTranslation';
import { fontFamily } from '../../../../theme/fonts';
import AppText from '../../../../components/common/AppText';
import Card from '../../../../components/common/Card';

export const ApprovalActionButtons = memo(({ onApprove, onDecline, id }) => {
  const { colors, borderRadius } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.buttonsRow}>
      <TouchableOpacity
        style={[styles.declineButton, { backgroundColor: colors.backgroundTertiary, borderRadius: borderRadius.lg }]}
        onPress={() => onDecline(id)}
        activeOpacity={0.8}
      >
        <AppText style={[styles.declineButtonText, { color: colors.textPrimary }]}>
          {t('groupDetails.userApproval.decline')}
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.approveButton, { backgroundColor: colors.primary, borderRadius: borderRadius.lg }]}
        onPress={() => onApprove(id)}
        activeOpacity={0.8}
      >
        <AppText style={[styles.approveButtonText, { color: colors.white }]}>
          {t('groupDetails.userApproval.approve')}
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const UserApprovalCard = ({
  item,
  onApprove,
  onDecline,
}) => {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();

  const getSubtitle = () => {
    const wantsToJoin = t('groupDetails.userApproval.wantsToJoin');
    if (item.invitedBy) {
      const invitedBy = t('groupDetails.userApproval.invitedBy', { name: item.invitedBy });
      return `${wantsToJoin} • ${invitedBy}`;
    }
    const mutualMembers = t('groupDetails.userApproval.mutualMembers', { count: item.mutualMembers || 0 });
    return `${wantsToJoin} • ${mutualMembers}`;
  };

  return (
    <Card style={styles.card} padding={spacing[4]} elevation={false}>
      <View style={styles.userInfoRow}>
        <View style={styles.avatarWrapper}>
          <Image
            source={item.profileImage ? { uri: item.profileImage } : require('../../../../assets/images/user.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
          {item.isOnline && (
            <View style={[styles.onlineIndicator, { borderColor: colors.cardBackground }]} />
          )}
        </View>

        <View style={styles.textContainer}>
          <AppText style={[styles.nameText, { color: colors.textPrimary }]}>
            {item.name}
          </AppText>
          <AppText style={[styles.subtitleText, { color: colors.textSecondary }]}>
            {getSubtitle()}
          </AppText>
        </View>
      </View>

      <View style={{ marginTop: spacing[4] }}>
        <ApprovalActionButtons
          id={item.id}
          onApprove={onApprove}
          onDecline={onDecline}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    backgroundColor: '#22C55E',
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
  },
  nameText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitleText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    marginTop: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  declineButton: {
    flex: 1,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  declineButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  approveButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default memo(UserApprovalCard);
