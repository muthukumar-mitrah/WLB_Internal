/**
 * SafeContainer — safe area wrapper with optional KeyboardAvoidingView
 */
import React, {memo} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';

const SafeContainer = ({
  children,
  scroll = false,
  avoidKeyboard = false,
  edges = ['top', 'bottom'],
  backgroundColor,
  style,
  contentContainerStyle,
  ...rest
}) => {
  const {colors} = useTheme();
  const bg = backgroundColor || colors.background;

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      style={[styles.flex, { backgroundColor: bg}]}
      {...rest}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, {backgroundColor: bg}, style]} {...rest}>
      {children}
    </View>
  );

  const wrapped = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: bg}, style]}
      edges={edges}>
      {wrapped}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default memo(SafeContainer);
