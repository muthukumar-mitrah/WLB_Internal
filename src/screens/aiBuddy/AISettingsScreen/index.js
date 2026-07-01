import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { SafeContainer, Header, AppText, Button, AppSwitch, ToastService } from '../../../components/common';
import { useTheme } from '../../../theme';
import { createStyles } from './styles';
import AiBuddyDisclaimerModal from '../../../components/home/AiBuddyDisclaimerModal';

const AISettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  // Safe default buddy object if params are missing
  const buddy = route.params?.buddy || { name: 'Robi' };

  const { colors, spacing, borderRadius, iconSize, isDark } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing, borderRadius, isDark }), [colors, spacing, borderRadius, isDark]);

  // Form State
  const [memoryMode, setMemoryMode] = useState('keep'); // 'keep' | 'erase'
  const [suggestLikes, setSuggestLikes] = useState(true);
  const [suggestComments, setSuggestComments] = useState(true);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Save the settings
    ToastService.show({
      title: t('common.success'),
      message: t('aiBuddy.settings.savedSuccessfully'),
      type: 'success',
    });
    navigation.goBack();
  };

  const title = t('aiBuddy.settings.title', { name: buddy.name,});
  const subtitle = t('aiBuddy.settings.subtitle', { name: buddy.name, });

  return (
    <SafeContainer edges={['top', 'bottom']}>
      <Header title="" transparent={true} onBackPress={handleCancel} />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

        <AppText variant="h2" color={colors.textPrimary} style={styles.title}>{title}</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          {subtitle}
        </AppText>

        {/* Memory Section */}
        <AppText variant="subtitleMedium" color={colors.textSecondary} style={styles.sectionTitle}>
          {t('aiBuddy.settings.memory')}
        </AppText>

        <TouchableOpacity
          activeOpacity={0.8}
          style={memoryMode === 'keep' ? styles.memoryOptionSelected : styles.memoryOptionDefault}
          onPress={() => setMemoryMode('keep')}
        >
          <View style={styles.memoryIconContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={iconSize.lg}
              color={memoryMode === 'keep' ? colors.primary : colors.textPrimary}
            />
          </View>
          <View style={styles.memoryTextContainer}>
            <AppText
              variant="body"
              style={memoryMode === 'keep' ? styles.memoryTitleSelected : styles.memoryTitleDefault}
              color={memoryMode !== 'keep' ? colors.textPrimary : undefined}
            >
              {t('aiBuddy.settings.keepHistory')}
            </AppText>
            <AppText
              variant="caption"
              style={memoryMode === 'keep' ? styles.memoryDescSelected : styles.memoryDescDefault}
              color={memoryMode !== 'keep' ? colors.textSecondary : undefined}
            >
              {t('aiBuddy.settings.keepHistoryDesc', { name: buddy.name })}
            </AppText>
          </View>
          <Ionicons
            name="checkmark-circle"
            size={iconSize.lg}
            color={colors.primary}
            style={[
              styles.checkmarkIcon,
              memoryMode === 'keep' ? styles.checkmarkVisible : styles.checkmarkHidden,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={memoryMode === 'erase' ? styles.memoryOptionSelected : styles.memoryOptionDefault}
          onPress={() => setMemoryMode('erase')}
        >
          <View style={styles.memoryIconContainer}>
            <Ionicons
              name="trash-outline"
              size={iconSize.lg}
              color={memoryMode === 'erase' ? colors.primary : colors.textPrimary}
            />
          </View>
          <View style={styles.memoryTextContainer}>
            <AppText
              variant="body"
              style={memoryMode === 'erase' ? styles.memoryTitleSelected : styles.memoryTitleDefault}
              color={memoryMode !== 'erase' ? colors.textPrimary : undefined}
            >
              {t('aiBuddy.settings.eraseHistory')}
            </AppText>
            <AppText
              variant="caption"
              style={memoryMode === 'erase' ? styles.memoryDescSelected : styles.memoryDescDefault}
              color={memoryMode !== 'erase' ? colors.textSecondary : undefined}
            >
              {t('aiBuddy.settings.eraseHistoryDesc')}
            </AppText>
          </View>
          <Ionicons
            name="checkmark-circle"
            size={iconSize.lg}
            color={colors.primary}
            style={[
              styles.checkmarkIcon,
              memoryMode === 'erase' ? styles.checkmarkVisible : styles.checkmarkHidden,
            ]}
          />
        </TouchableOpacity>


        {/* AI Buddy Action Section */}
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.sectionTitle}>
          {t('aiBuddy.settings.action')}
        </AppText>

        <View style={styles.actionCard}>
          <View style={styles.actionItem}>
            <View style={styles.actionIconWrapper}>
              <Ionicons name="heart-outline" size={iconSize.md} color={colors.primary} />
            </View>
            <View style={styles.actionTextContainer}>
              <AppText variant="h5" color={colors.textPrimary} style={styles.actionTitle}>
                {t('aiBuddy.settings.suggestLikes')}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary} style={styles.actionDesc}>
                {t('aiBuddy.settings.suggestLikesDesc', { name: buddy.name })}
              </AppText>
            </View>
            <AppSwitch
              value={suggestLikes}
              onValueChange={setSuggestLikes}
              size="sm"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.actionItem}>
            <View style={styles.actionIconWrapper}>
              <Ionicons name="chatbubble-outline" size={iconSize.md} color={colors.primary} />
            </View>
            <View style={styles.actionTextContainer}>
              <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.actionTitle}>
                {t('aiBuddy.settings.suggestComments')}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary} style={styles.actionDesc}>
                {t('aiBuddy.settings.suggestCommentsDesc', { name: buddy.name })}
              </AppText>
            </View>
            <AppSwitch
              value={suggestComments}
              onValueChange={setSuggestComments}
              size="sm"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('aiBuddy.settings.saveChanges')}
            variant="primary"
            onPress={handleSave}
            textStyle={styles.buttonText}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title={t('aiBuddy.settings.cancel')}
            variant="gray"
            onPress={handleCancel}
            textStyle={styles.buttonText}
          />
          <Button
            title={t('aiBuddy.settings.viewDisclaimer')}
            variant="ghost"
            textStyle={styles.disclaimerText}
            style={styles.disclaimerBtn}
            onPress={() => setDisclaimerVisible(true)}
          />
        </View>
      </ScrollView>

      <AiBuddyDisclaimerModal
        visible={disclaimerVisible}
        onClose={() => setDisclaimerVisible(false)}
        onContinue={() => setDisclaimerVisible(false)}
        onAiSettings={() => setDisclaimerVisible(false)}
      />
    </SafeContainer>
  );
};

export default AISettingsScreen;
