import React, { memo, useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from './AppText';
import AppModal from './AppModal';
import { useTranslation } from '../../i18n/useTranslation';
import { fontFamily } from '../../theme/fonts';

const buildPostOptions = (username, t) => [
  { key: 'save', icon: 'bookmark-outline', label: t('home.postOptions.save') },
  { key: 'message', icon: 'chatbubble-outline', label: t('home.postOptions.message', { username }) },
  { key: 'profile', icon: 'person-outline', label: t('home.postOptions.profile') },
  { key: 'hide', icon: 'eye-off-outline', label: t('home.postOptions.hide') },
  { key: 'report', icon: 'flag-outline', label: t('home.postOptions.report') },
  { key: 'block', icon: 'person-remove-outline', label: t('home.postOptions.block', { username }) },
];

const PostOptionsSheet = memo(({ visible, username, onClose, onSelect }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const options = useMemo(() => buildPostOptions(username, t), [username, t]);

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      position="bottom"
      showHandle={true}
      showCloseButton={false}
      closeOnOverlay={true}
      overlayColor="rgba(0,0,0,0.45)"
    >
      {options.map((opt, idx) => (
        <TouchableOpacity
          key={opt.key}
          style={styles.sheetRow}
          activeOpacity={0.65}
          onPress={() => {
            onSelect?.(opt.key);
            onClose();
          }}
        >
          <Icon
            name={opt.icon}
            size={22}
            color={colors.iconPrimary}
            style={styles.sheetRowIcon}
          />
          <AppText style={[styles.sheetRowLabel, { color: colors.textPrimary }]}>
            {opt.label}
          </AppText>
        </TouchableOpacity>
      ))}
    </AppModal>
  );
});

const styles = StyleSheet.create({
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  sheetRowIcon: {
    marginRight: 18,
    width: 24,
    textAlign: 'center',
  },
  sheetRowLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 20,
  },
});

export default PostOptionsSheet;
