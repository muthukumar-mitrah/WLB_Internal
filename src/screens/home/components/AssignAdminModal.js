import React, { memo, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { fontFamily } from '../../../theme/fonts';
import AppText from '../../../components/common/AppText';
import AppModal from '../../../components/common/AppModal';

const AssignAdminModal = ({ visible, onClose, onConfirmAssign }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();

  const handleConfirm = useCallback(() => {
    onConfirmAssign?.();
    onClose();
  }, [onConfirmAssign, onClose]);

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
        <AppText style={[styles.title, { color: colors.textPrimary }]}>
          {t('groupDetails.options.assignNewAdminBeforeLeaving')}
        </AppText>
        
        <AppText style={[styles.description, { color: colors.textSecondary }]}>
          {t('groupDetails.options.assignNewAdminDescription')}
        </AppText>

        {/* Buttons Row */}
        <View style={[styles.buttonsRow, { gap: spacing[3] }]}>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <AppText style={[styles.btnText, { color: colors.textSecondary }]}>
              {t('groupDetails.options.cancel')}
            </AppText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.btn, styles.actionBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={handleConfirm}
          >
            <AppText style={[styles.btnText, { color: colors.textInverse }]}>
              {t('groupDetails.options.assignAdmin')}
            </AppText>
          </TouchableOpacity>
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
    paddingBottom: 20,
    overflow: 'hidden',
  },
  modalContent: {
    paddingTop: 16,
    alignItems: 'center',
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
    fontSize: 14,
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
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  actionBtn: {},
  btnText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },
});

export default memo(AssignAdminModal);
