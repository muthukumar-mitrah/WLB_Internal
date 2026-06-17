import React, { useState, useMemo } from 'react';
import { View, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

import { SafeContainer, Header, AppText, Button, ToastService } from '../../../components/common';
import { useTheme } from '../../../theme';
import { createStyles } from './styles';
import { ROUTES } from '../../../constants';
import { APP_IMAGES } from '../../../constants/images';

const AISettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Safe default buddy object if params are missing
  const buddy = route.params?.buddy || { name: 'AI Buddy' };

  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  // Form State
  const [memoryMode, setMemoryMode] = useState('keep'); // 'keep' | 'erase'
  const [suggestLikes, setSuggestLikes] = useState(true);
  const [suggestComments, setSuggestComments] = useState(true);

  const handleSaveChanges = () => {
    // In a real app, save via service here
    ToastService.show({ type: 'success', text1: 'Settings saved successfully' });
    
    // Navigate away or back to main flow after saving. For now, pop to top or home
    navigation.navigate(ROUTES.MAIN); 
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const title = t('aiBuddy.settings.title', { name: buddy.name, defaultValue: `${buddy.name} AI Settings` });
  const subtitle = t('aiBuddy.settings.subtitle', { name: buddy.name, defaultValue: `Control how ${buddy.name} remembers your activity and supports your interactions.` });

  return (
    <SafeContainer edges={['top', 'bottom']}>
      <Header title="" onBackPress={handleCancel} />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        <AppText variant="h2" color={colors.textPrimary}>{title}</AppText>
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.subtitle}>
          {subtitle}
        </AppText>

        {/* Memory Section */}
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.sectionTitle}>
          {t('aiBuddy.settings.memory', 'Memory')}
        </AppText>

        <TouchableOpacity
          activeOpacity={0.8}
          style={memoryMode === 'keep' ? styles.memoryOptionSelected : styles.memoryOptionDefault}
          onPress={() => setMemoryMode('keep')}
        >
          <View style={styles.memoryIconContainer}>
            <Image 
              source={APP_IMAGES.aiBuddyChat}
              style={[styles.icon, { tintColor: memoryMode === 'keep' ? colors.primary : colors.textPrimary }]} 
            />
          </View>
          <View style={styles.memoryTextContainer}>
            <AppText 
              variant="bodyMedium" 
              style={memoryMode === 'keep' ? styles.memoryTitleSelected : styles.memoryTitleDefault}
              color={memoryMode !== 'keep' ? colors.textPrimary : undefined}
            >
              {t('aiBuddy.settings.keepHistory', 'Keep chat history for 30 days')}
            </AppText>
            <AppText 
              variant="caption" 
              style={memoryMode === 'keep' ? styles.memoryDescSelected : styles.memoryDescDefault}
              color={memoryMode !== 'keep' ? colors.textSecondary : undefined}
            >
              {t('aiBuddy.settings.keepHistoryDesc', { name: buddy.name, defaultValue: `${buddy.name} can use recent conversations to provide more personalized support` })}
            </AppText>
          </View>
          {memoryMode === 'keep' && (
            <Image source={APP_IMAGES.checkCircle} style={[styles.icon, { tintColor: colors.primary }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={memoryMode === 'erase' ? styles.memoryOptionSelected : styles.memoryOptionDefault}
          onPress={() => setMemoryMode('erase')}
        >
          <View style={styles.memoryIconContainer}>
            <Image 
              source={APP_IMAGES.trash} 
              style={[styles.icon, { tintColor: memoryMode === 'erase' ? colors.primary : colors.textPrimary }]} 
            />
          </View>
          <View style={styles.memoryTextContainer}>
            <AppText 
              variant="bodyMedium" 
              style={memoryMode === 'erase' ? styles.memoryTitleSelected : styles.memoryTitleDefault}
              color={memoryMode !== 'erase' ? colors.textPrimary : undefined}
            >
              {t('aiBuddy.settings.eraseHistory', 'Erase all AI history')}
            </AppText>
            <AppText 
              variant="caption" 
              style={memoryMode === 'erase' ? styles.memoryDescSelected : styles.memoryDescDefault}
              color={memoryMode !== 'erase' ? colors.textSecondary : undefined}
            >
              {t('aiBuddy.settings.eraseHistoryDesc', 'Remove saved AI conversation history.')}
            </AppText>
          </View>
          {memoryMode === 'erase' && (
            <Image source={APP_IMAGES.checkCircle} style={[styles.icon, { tintColor: colors.primary }]} />
          )}
        </TouchableOpacity>


        {/* AI Buddy Action Section */}
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.sectionTitle}>
          {t('aiBuddy.settings.action', 'AI Buddy Action')}
        </AppText>

        <View style={styles.actionCard}>
          <View style={styles.actionItem}>
            <View style={styles.actionIconWrapper}>
              <Image source={APP_IMAGES.likeIcon} style={[styles.smallIcon, { tintColor: colors.primary }]} />
            </View>
            <View style={styles.actionTextContainer}>
              <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.actionTitle}>
                {t('aiBuddy.settings.suggestLikes', 'Suggest likes')}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary} style={styles.actionDesc}>
                {t('aiBuddy.settings.suggestLikesDesc', { name: buddy.name, defaultValue: `${buddy.name} can suggest when a post may be worth supporting` })}
              </AppText>
            </View>
            <Switch
              value={suggestLikes}
              onValueChange={setSuggestLikes}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.divider} />

          <View style={styles.actionItem}>
            <View style={styles.actionIconWrapper}>
              <Image source={APP_IMAGES.commentIcon} style={[styles.smallIcon, { tintColor: colors.primary }]} />
            </View>
            <View style={styles.actionTextContainer}>
              <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.actionTitle}>
                {t('aiBuddy.settings.suggestComments', 'Suggest comments')}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary} style={styles.actionDesc}>
                {t('aiBuddy.settings.suggestCommentsDesc', { name: buddy.name, defaultValue: `${buddy.name} can help draft supportive replies, but you choose what to post.` })}
              </AppText>
            </View>
            <Switch
              value={suggestComments}
              onValueChange={setSuggestComments}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('aiBuddy.settings.saveChanges', 'Save Changes')}
            variant="primary"
            onPress={handleSaveChanges}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title={t('aiBuddy.settings.cancel', 'Cancel')}
            variant="gray"
            onPress={handleCancel}
          />
          <Button
            title={t('aiBuddy.settings.viewDisclaimer', 'View AI Disclaimer')}
            variant="ghost"
            textStyle={styles.disclaimerText}
            style={styles.disclaimerBtn}
            onPress={() => {}}
          />
        </View>

      </ScrollView>
    </SafeContainer>
  );
};

export default AISettingsScreen;
