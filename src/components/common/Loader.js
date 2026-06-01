/**
 * Loader — full screen or inline activity indicator
 */
import React, {memo} from 'react';
import {
  View,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../theme';
import AppText from './AppText';

const Loader = ({
  visible = true,
  fullScreen = false,
  overlay = false,
  message,
  size = 'large',
  color,
  style,
}) => {
  const {colors, spacing} = useTheme();
  const indicatorColor = color || colors.primary;

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayCard, {backgroundColor: colors.surface}]}>
            <ActivityIndicator size={size} color={indicatorColor} />
            {message && (
              <AppText
                variant="bodyMedium"
                color={colors.textSecondary}
                style={{marginTop: spacing[3]}}>
                {message}
              </AppText>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, {backgroundColor: colors.background}]}>
        <ActivityIndicator size={size} color={indicatorColor} />
        {message && (
          <AppText
            variant="bodyMedium"
            color={colors.textSecondary}
            style={{marginTop: spacing[3]}}>
            {message}
          </AppText>
        )}
      </View>
    );
  }

  return visible ? (
    <View style={[styles.inline, style]}>
      <ActivityIndicator size={size} color={indicatorColor} />
      {message && (
        <AppText
          variant="caption"
          color={colors.textSecondary}
          style={{marginLeft: spacing[2]}}>
          {message}
        </AppText>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});

export default memo(Loader);
