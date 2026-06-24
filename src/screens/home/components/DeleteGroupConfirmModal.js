import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { fontFamily, fontSize } from '../../../theme/fonts';
import AppText from '../../../components/common/AppText';
import AppModal from '../../../components/common/AppModal';
import Button from '../../../components/common/Button';
import { APP_IMAGES } from '../../../constants';

const DeleteGroupConfirmModal = ({ visible, onClose, onConfirmDelete }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();

  const handleConfirm = useCallback(() => {
    onConfirmDelete?.();
    onClose();
  }, [onConfirmDelete, onClose]);

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      position="center"
      showHandle={false}
      showCloseButton={true}
      closeOnOverlay={true}
      style={[
        styles.modalStyle,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius['3xl'],
        }
      ]}
    >
      <View style={styles.modalContent}>
        <View style={[styles.iconContainer]}>
          <Image source={APP_IMAGES.deleteGroup} style={styles.deleteIcon}/>
        </View>

        <AppText style={[styles.title, { color: colors.textPrimary }]}>
          {t('groupDetails.options.deleteGroupTitle')}
        </AppText>
        
        <AppText style={[styles.description, { color: colors.textSecondary }]}>
          {t('groupDetails.options.deleteGroupDescription')}
        </AppText>

        <View style={[styles.buttonsRow, { gap: spacing[3] }]}>
          <Button
            title={t('groupDetails.options.cancel')}
            onPress={onClose}
            variant="gray"
            fullWidth={false}
            style={styles.btn}
            textStyle={{fontSize: fontSize.sm}}
          />
          <Button
            title={t('groupDetails.options.deleteGroup')}
            onPress={handleConfirm}
            variant="primary"
            fullWidth={false}
            style={styles.btn}
            textStyle={{fontSize: fontSize.sm}}
          />
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    alignSelf: 'center',
    width: '90%',
    maxWidth: 343,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  modalContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 54,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  deleteIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  btn: {
    flex: 1
  },
});

export default memo(DeleteGroupConfirmModal);
