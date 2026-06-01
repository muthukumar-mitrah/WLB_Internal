/**
 * EmptyState — placeholder when list/content is empty
 */
import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import AppText from './AppText';
import Button from './Button';

const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const {colors, spacing} = useTheme();

  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={[styles.iconWrapper, {marginBottom: spacing[4]}]}>
          {icon}
        </View>
      )}

      <AppText
        variant="h3"
        color={colors.textPrimary}
        style={styles.title}>
        {title}
      </AppText>

      {description && (
        <AppText
          variant="body"
          color={colors.textSecondary}
          style={styles.description}>
          {description}
        </AppText>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          fullWidth={false}
          style={{marginTop: spacing[5], paddingHorizontal: spacing[8]}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
  },
});

export default memo(EmptyState);
