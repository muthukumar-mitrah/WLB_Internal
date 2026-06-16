/**
 * AppModal — bottom sheet / centered modal wrapper
 */
import React, { memo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from './AppText';

const AppModal = ({
  visible = false,
  onClose,
  title,
  children,
  position = 'bottom',
  showHandle = true,
  showCloseButton = true,
  closeOnOverlay = true,
  overlayColor = 'rgba(0,0,0,0.5)',
  style,
  contentStyle,
}) => {
  const { colors, borderRadius, spacing, shadows } = useTheme();

  const isBottom = position === 'bottom';

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottom ? 'slide' : 'fade'}
      statusBarTranslucent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Overlay */}
        <TouchableOpacity
          style={[styles.overlay, { backgroundColor: overlayColor }]}
          activeOpacity={1}
          onPress={closeOnOverlay ? onClose : undefined}
        />
        <View
          style={[
            styles.container,
            isBottom ? styles.bottomContainer : styles.centerContainer,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: isBottom ? borderRadius['3xl'] : borderRadius['2xl'],
              borderTopRightRadius: isBottom ? borderRadius['3xl'] : borderRadius['2xl'],
              borderRadius: isBottom ? undefined : borderRadius['2xl'],
              paddingHorizontal: spacing[5],
              paddingBottom: spacing[8],
            },
            shadows.modal,
            style,
          ]}>
          {showHandle && isBottom && (
            <View
              style={[
                styles.handle,
                { backgroundColor: colors.border, marginTop: spacing[2], marginBottom: spacing[1] },
              ]}
            />
          )}
          {(title || showCloseButton) && (
            <View style={[styles.header, { paddingTop: spacing[3], paddingBottom: spacing[2] }]}>
              {title ? (
                <AppText variant="title" color={colors.textPrimary}>
                  {title}
                </AppText>
              ) : <View />}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={[styles.closeBtn, { backgroundColor: colors.backgroundTertiary }]}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={contentStyle}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000080'
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    width: '100%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  centerContainer: {
    alignSelf: 'center',
    width: '90%',
    marginBottom: 80,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AppModal);
