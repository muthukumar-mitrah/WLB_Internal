/**
 * ContactUsScreen — help & contact form
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme';
import { AppText, Button, InputBox, SafeContainer, AppModal, ToastService } from '../../../components/common';
import { validateEmail, validateName, validateRequired } from '../../../utils/validation';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

const CATEGORIES = [
  'General Inquiry',
  'Technical Support',
  'Billing',
  'Feedback',
  'Bug Report',
];

const SelectField = memo(
  ({ label, value, onSelect, placeholder, options, error, colors, styles }) => {
    const [open, setOpen] = useState(false);

    return (
      <View style={styles.selectContainer}>
        {label && (
          <AppText
            variant="label"
            color={colors.textSecondary}
            style={styles.marginBottom6}>
            {label}
          </AppText>
        )}
        <TouchableOpacity
          onPress={() => setOpen(true)}
          activeOpacity={0.7}
          style={[
            styles.selectWrapper,
            { borderColor: error ? colors.error : colors.inputBorder },
          ]}>
          <AppText
            variant="body"
            color={value ? colors.textPrimary : colors.inputPlaceholder}
            style={styles.selectText}>
            {value || placeholder}
          </AppText>
          <Ionicons name="chevron-down" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
        {error ? (
          <AppText
            variant="caption"
            color={colors.error}
            style={styles.selectError}>
            {error}
          </AppText>
        ) : null}
        <AppModal
          visible={open}
          onClose={() => setOpen(false)}
          title={label}
          position="bottom"
        >
          <View style={styles.paddingBottom16}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionRow,
                  index === options.length - 1 && styles.optionRowLast,
                ]}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}>
                <AppText
                  variant="body"
                  color={
                    option === value ? colors.primary : colors.textPrimary
                  }>
                  {option}
                </AppText>
                {option === value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </AppModal>
      </View>
    );
  },
);

const ContactInfoItem = memo(
  ({ iconName, children, showChevron, onPress, colors, styles }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={styles.contactItemRow}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={20} color={colors.primary} />
      </View>
      <View style={styles.contactItemContent}>{children}</View>
      {showChevron && (
        <View style={styles.contactItemChevron}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textTertiary}
          />
        </View>
      )}
    </TouchableOpacity>
  ),
);

const ContactUsScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius, shadows, iconSize } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows }),
    [colors, spacing, borderRadius, shadows],
  );

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback(() => {
    const newErrors = {};

    const firstNameResult = validateName(firstName);
    if (!firstNameResult.valid) {
      newErrors.firstName = t(firstNameResult.message);
    }

    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      newErrors.email = t(emailResult.message);
    }

    const messageResult = validateRequired(message);
    if (!messageResult.valid) {
      newErrors.message = t(messageResult.message);
    }

    return newErrors;
  }, [firstName, email, message, t]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Simulate API success with standard Toast message
      ToastService.show({
        type: 'success',
        message: t('contactUs.submitSuccess'),
      });
      // Reset form
      setFirstName('');
      setEmail('');
      setCategory('');
      setMessage('');
      setSubmitted(false);
    }
  }, [validate, t]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleEmailPress = useCallback(() => {
    Linking.openURL(`mailto:${t('contactUs.emailSupportAddress')}`);
  }, [t]);

  const makeChangeHandler = useCallback(
    (setter, field) => value => {
      setter(value);
      if (submitted) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [submitted],
  );

  return (
    <SafeContainer
      edges={['top', 'bottom']}
      backgroundColor={colors.background}
      scroll={false}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={iconSize.md}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <AppText variant="title" color={colors.textPrimary}>
          {t('contactUs.title')}
        </AppText>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppText
            variant="h2"
            color={colors.textPrimary}
            style={styles.introHeading}>
            {t('contactUs.heading')}
          </AppText>
          <AppText
            variant="subtitle"
            color={colors.textSecondary}
            style={styles.introSubheading}>
            {t('contactUs.subheading')}
          </AppText>
          <View style={styles.card}>
            <InputBox
              label={t('contactUs.firstName')}
              required={true}
              placeholder={t('contactUs.firstNamePlaceholder')}
              value={firstName}
              onChangeText={makeChangeHandler(setFirstName, 'firstName')}
              error={errors.firstName}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              containerStyle={styles.inputContainer}
            />
            <InputBox
              label={t('contactUs.email')}
                required={true}
              placeholder={t('contactUs.emailPlaceholder')}
              value={email}
              onChangeText={makeChangeHandler(setEmail, 'email')}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              containerStyle={styles.inputContainer}
            />
            <SelectField
              label={t('contactUs.category')}
              value={category}
              onSelect={setCategory}
              placeholder={t('contactUs.categoryPlaceholder')}
              options={CATEGORIES}
              colors={colors}
              styles={styles}
            />
            <InputBox
              label={t('contactUs.message')}
              required={true}
              placeholder={t('contactUs.messagePlaceholder')}
              value={message}
              onChangeText={makeChangeHandler(setMessage, 'message')}
              error={errors.message}
              multiline
              numberOfLines={5}
              autoCapitalize="sentences"
              autoCorrect={false}
              containerStyle={styles.messageInputContainer}
              inputStyle={styles.messageInput}
            />
            <Button
              title={t('contactUs.submitMessage')}
              onPress={handleSubmit}
              variant="primary"
              size="lg"
              style={styles.submitBtn}
              disabled={!firstName || !email || !message}
            />
          </View>
          <View style={styles.card}>
            <AppText
              variant="title"
              color={colors.textSecondary}
              style={styles.contactInfoTitle}>
              {t('contactUs.contactInfo')}
            </AppText>
            <ContactInfoItem
              iconName="location-outline"
              showChevron={false}
              colors={colors}
              styles={styles}>
              <AppText
                variant="bodyMedium"
                color={colors.textPrimary}
                style={styles.contactItemTitle}>
                {t('contactUs.locationTitle')}
              </AppText>
              <AppText variant="label" color={colors.textSecondary}>
                {t('contactUs.locationAddress')}
              </AppText>
            </ContactInfoItem>
            <View style={styles.contactItemDivider} />
            <ContactInfoItem
              iconName="mail-outline"
              showChevron
              onPress={handleEmailPress}
              colors={colors}
              styles={styles}>
              <AppText
                variant="bodyMedium"
                color={colors.textPrimary}
                style={styles.contactItemTitle}>
                {t('contactUs.emailSupportTitle')}
              </AppText>
              <AppText variant="label" color={colors.primary}>
                {t('contactUs.emailSupportAddress')}
              </AppText>
            </ContactInfoItem>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

export default memo(ContactUsScreen);
