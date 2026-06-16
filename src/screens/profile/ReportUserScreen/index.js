import React, {memo, useMemo, useState, useCallback} from 'react';
import {View, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {
  Header,
  SafeContainer,
  Button,
  InputBox,
  AppText,
  Divider,
  AppImage,
} from '../../../components/common';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';
import {APP_IMAGES} from '../../../constants';
import { useProfile } from '../../../context/ProfileContext';

const ReportUserScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  const { allUsers, reportOptions } = useProfile();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState('');
  const [pretendingTarget, setPretendingTarget] = useState(''); // 'Me' | 'Someone else'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [reportReason, setReportReason] = useState('');

  const handleBack = useCallback(() => {
    if (step === 1) {
      navigation.goBack();
    } else if (step === 2 || step === '2B') {
      setStep(1);
      setReportReason('');
      setPretendingTarget('');
    } else if (step === 'search') {
      setStep(2);
    } else if (step === 'describe') {
      if (pretendingTarget === 'Someone else') {
        setStep(2);
      } else {
        setStep('2B');
      }
    } else if (step === 3) {
      setStep('search');
    } else if (step === 4) {
      navigation.goBack();
    }
  }, [step, navigation, pretendingTarget]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubmitDetails = useCallback(() => {
    // Someone Else flow goes directly from Describe to Thank You
    setStep(4);
  }, []);

  const handleSubmitReport = useCallback(() => {
    // Me flow goes from Submit Report screen to Thank You
    setStep(4);
  }, []);



  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allUsers.filter(p => p.name.toLowerCase().includes(query));
  }, [searchQuery, allUsers]);

  const renderCloseButton = useMemo(() => (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={handleClose}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
      <Icon name="close" size={22} color={colors.textPrimary} />
    </TouchableOpacity>
  ), [colors.textPrimary, handleClose, styles.closeButton]);

  const renderRowItem = (label, onPress) => (
    <TouchableOpacity key={label} style={styles.rowItem} onPress={onPress} activeOpacity={0.7}>
      <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.rowText}>
        {label}
      </AppText>
      <Icon name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const searchRightIcon = useMemo(() => (
    searchQuery ? (
      <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Icon name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    ) : (
      <Icon name="magnify" size={20} color={colors.textSecondary} />
    )
  ), [searchQuery, colors.textSecondary]);

  const getOptionTranslation = useCallback((option) => {
    switch (option) {
      case "I just don't like it": return t('profile.report.options.dontLikeIt');
      case "Bullying or unwanted contact": return t('profile.report.options.bullying');
      case "Suicide, self-injury or eating disorders": return t('profile.report.options.suicide');
      case "Violence, hate or exploitation": return t('profile.report.options.violence');
      case "Selling or promoting restricted items": return t('profile.report.options.restrictedItems');
      case "Nudity or sexual activity": return t('profile.report.options.nudity');
      case "Scam or fraud": return t('profile.report.options.scam');
      case "False information": return t('profile.report.options.falseInfo');
      default: return option;
    }
  }, [t]);

  const getPretendingTargetTranslation = useCallback((target) => {
    if (target === 'Me') return t('profile.report.options.me');
    if (target === 'Someone else') return t('profile.report.options.someoneElse');
    return target;
  }, [t]);


  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header
        title={t('profile.report.title')}
        showBack={step !== 4}
        onBackPress={handleBack}
        rightComponent={renderCloseButton}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* Step 1: Why are you reporting this profile? */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <AppText variant="title" color={colors.textPrimary} style={styles.heading}>
              {t('profile.report.steps.whyReporting')}
            </AppText>
            {renderRowItem(t('profile.report.options.pretendingSomeone'), () => {
              setReportReason(t('profile.report.options.pretendingSomeone'));
              setStep(2);
            })}
            <Divider thickness={1} />
            {renderRowItem(t('profile.report.options.somethingElse'), () => setStep('2B'))}
            <Divider thickness={1} />
          </View>
        )}

        {/* Step 2: Who are they pretending to be? */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <AppText variant="title" color={colors.textPrimary} style={styles.heading}>
              {t('profile.report.steps.whoPretending')}
            </AppText>
            {renderRowItem(t('profile.report.options.me'), () => {
              setPretendingTarget('Me');
              setStep('search');
            })}
            <Divider thickness={1} />
            {renderRowItem(t('profile.report.options.someoneElse'), () => {
              setPretendingTarget('Someone else');
              setSelectedProfile(null);
              setStep('describe');
            })}
            <Divider thickness={1} />
          </View>
        )}

        {/* Step 2B: What do you want to report this profile? */}
        {step === '2B' && (
          <View style={styles.stepContainer}>
            <AppText variant="title" color={colors.textPrimary} style={styles.heading}>
              {t('profile.report.steps.whatReporting')}
            </AppText>
            {reportOptions?.map((option, idx) => (
              <View key={option}>
                {renderRowItem(getOptionTranslation(option), () => {
                  setReportReason(option);
                  setPretendingTarget('');
                  setStep(4);
                })}
                {idx < reportOptions.length - 1 && <Divider thickness={1} />}
              </View>
            ))}
          </View>
        )}

        {/* Step 'search': Who is this profile pretending to be? */}
        {step === 'search' && (
          <View style={styles.stepContainer}>
            <AppText variant="title" color={colors.textPrimary} style={styles.heading}>
              {t('profile.report.steps.whoImpersonating')}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.subHeadingText}>
              {t('profile.report.steps.searchSubtitle')}
            </AppText>
            
            <View style={{marginBottom: spacing[1]}}>
              <InputBox
                placeholder={t('profile.report.steps.searchPlaceholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                rightIcon={searchRightIcon}
              />
            </View>
 
            <View style={styles.profileListContainer}>
              {filteredProfiles.map((p, idx) => (
                <View key={p.id}>
                  <TouchableOpacity
                    style={styles.profileRow}
                    onPress={() => {
                      setSelectedProfile(p);
                      setStep(3);
                    }}
                    activeOpacity={0.7}>
                    <AppImage
                      source={APP_IMAGES.userAvatar}
                      style={styles.profileAvatar}
                      imageStyle={styles.avatarImageInternal}
                      borderRadius={20}
                    />
                    <View style={styles.profileInfo}>
                      <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.profileName}>
                        {p.name}
                      </AppText>
                      <AppText variant="caption" color={colors.textSecondary}>
                        {p.location} · {p.followers} {p.followers === 1 ? t('profile.report.follower') : t('profile.report.followers')} · {p.buddies} {p.buddies === 1 ? t('profile.report.buddy') : t('profile.report.buddies')}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                  {idx < filteredProfiles.length - 1 && <Divider thickness={1} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Step 'describe': Describe the problem (Someone Else flow) */}
        {step === 'describe' && (
          <View style={styles.stepContainer}>
            <AppText variant="title" color={colors.textPrimary} style={styles.heading}>
              {t('profile.report.steps.describeTitle')}
            </AppText>
            
            <InputBox
              placeholder={t('profile.report.steps.describePlaceholder')}
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={6}
              inputStyle={styles.inputArea}
            />
          </View>
        )}

        {/* Step 3: You are about to submit the report (Me flow) */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <AppText variant="title" color={colors.textPrimary} style={styles.submitTitle}>
              {t('profile.report.steps.submitTitle')}
            </AppText>
            <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.submitSub}>
              We only remove accounts that go against our <AppText variant="bodyMedium" color={colors.primary} style={styles.standardsLink}>{t('profile.report.steps.communityStandards')}</AppText>.
            </AppText>

            <View style={styles.detailsSection}>
              <AppText variant="h3" color={colors.textPrimary} style={styles.detailsCardTitle}>
                {t('profile.report.details.title')}
              </AppText>

              <View style={styles.detailItem}>
                <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.detailLabel}>
                  {t('profile.report.details.whyReporting')}
                </AppText>
                <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.detailValue}>
                  {t('profile.report.options.pretendingSomeone')}
                </AppText>
              </View>

              <View style={styles.detailItem}>
                <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.detailLabel}>
                  {t('profile.report.details.whoPretending')}
                </AppText>
                <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.detailValue}>
                  {selectedProfile ? selectedProfile.name : getPretendingTargetTranslation(pretendingTarget)}
                </AppText>
              </View>
            </View>
          </View>
        )}



        {/* Step 4: Thank You screen */}
        {step === 4 && (
          <View style={styles.thankYouContainer}>
            <View style={[styles.successCircle, {backgroundColor: colors.backgroundSecondary}]}>
              <Icon name="check" size={32} color={colors.textPrimary} />
            </View>
            <AppText variant="h2" color={colors.textPrimary} style={styles.successTitle}>
              {t('profile.report.thankYou.title')}
            </AppText>
            <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.successSub}>
              {t('profile.report.thankYou.subtitle')}
            </AppText>
          </View>
        )}
      </ScrollView>

      {/* Button for Step 'describe', Step 3 & Step 4 */}
      {(step === 'describe' || step === 3 || step === 4) && (
        <View style={styles.buttonContainer}>
          <Button
            title={(step === 'describe' || step === 3) ? t('profile.report.buttons.submit') : t('profile.report.buttons.done')}
            onPress={step === 'describe' ? handleSubmitDetails : (step === 3 ? handleSubmitReport : handleClose)}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      )}
    </SafeContainer>
  );
};

export default memo(ReportUserScreen);
