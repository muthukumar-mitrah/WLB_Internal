import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../theme';
import { palette } from '../../theme/colors';
import { useProfile } from '../../context/ProfileContext';
import {
  SafeContainer,
  Header,
  AppText,
  Chart,
  ToastService,
} from '../../components/common';
import UpdateWeightBottomSheet from './components/UpdateWeightBottomSheet';
import createStyles from './styles';
import { APP_IMAGES } from '../../constants/images';

// Helper to calculate BMI
const calculateBmiValue = (weight, unit) => {
  const heightInches = 70.22; // default height approx 5'10" to align 194.3lbs to 27.7 BMI
  if (unit === 'Kg') {
    // Convert Kg to lbs first for simplified calculation
    const weightLbs = weight / 0.45359237;
    const bmi = (weightLbs * 703) / (heightInches * heightInches);
    return parseFloat(bmi.toFixed(1));
  } else {
    const bmi = (weight * 703) / (heightInches * heightInches);
    return parseFloat(bmi.toFixed(1));
  }
};

// Helper to find BMI range details
const getBmiRangeDetails = (bmi, t, colors) => {
  const infoColor = colors ? colors.info : palette.info;
  const successColor = colors ? colors.success : palette.success;
  const warningColor = colors ? colors.warning : palette.warning;
  const errorColor = colors ? colors.error : palette.error;

  const infoFill = colors ? colors.bmiShadowUnderweightDark : palette.info;
  const successFill = colors ? colors.bmiShadowNormalDark : palette.success;
  const warningFill = colors ? colors.bmiShadowOverweightDark : palette.warning;
  const errorFill = colors ? colors.bmiShadowObeseDark : palette.error;

  if (bmi < 18.5) {
    return {
      label: t('tracker.bmi.ranges.underweight', 'Underweight'),
      color: infoColor,
      fillColor: infoFill,
      percent: (bmi / 18.5) * 25,
    };
  } else if (bmi < 25.0) {
    return {
      label: t('tracker.bmi.ranges.normal', 'Normal'),
      color: successColor,
      fillColor: successFill,
      percent: 25 + ((bmi - 18.5) / 6.5) * 25,
    };
  } else if (bmi < 30.0) {
    return {
      label: t('tracker.bmi.ranges.overweight', 'Overweight'),
      color: warningColor,
      fillColor: warningFill,
      percent: 50 + ((bmi - 25.0) / 5.0) * 25,
    };
  } else {
    return {
      label: t('tracker.bmi.ranges.obese', 'Obese'),
      color: errorColor,
      fillColor: errorFill,
      percent: 75 + (Math.min(10.0, bmi - 30.0) / 10.0) * 25,
    };
  }
};

const TrackProgressScreen = () => {
  const { t } = useTranslation();
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const { profile, updateProfile } = useProfile();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows, isDark }),
    [colors, spacing, borderRadius, shadows, isDark]
  );

  const [isUpdateSheetVisible, setIsUpdateSheetVisible] = useState(false);

  // Screen values
  const currentWeight = profile?.currentWeight || 194.3;
  const currentUnit = profile?.unit || 'lbs';
  const currentBmi = useMemo(() => calculateBmiValue(currentWeight, currentUnit), [currentWeight, currentUnit]);
  const bmiDetails = useMemo(() => getBmiRangeDetails(currentBmi, t, colors), [currentBmi, t, colors]);

  const segments = useMemo(() => [
    { key: 'underweight', label: t('tracker.bmi.ranges.underweight', 'Underweight'), style: styles.bmiSegmentUnderweight },
    { key: 'normal', label: t('tracker.bmi.ranges.normal', 'Normal'), style: styles.bmiSegmentNormal },
    { key: 'overweight', label: t('tracker.bmi.ranges.overweight', 'Overweight'), style: styles.bmiSegmentOverweight },
    { key: 'obese', label: t('tracker.bmi.ranges.obese', 'Obese'), style: styles.bmiSegmentObese },
  ], [t, styles]);

  const statusParts = useMemo(() => {
    const statusText = t('tracker.bmi.ranges.current', 'Currently: {{range}} range', { range: '||HIGHLIGHT||' });
    return statusText.split('||HIGHLIGHT||');
  }, [t]);

  // Tab selections
  const [weightTab, setWeightTab] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'
  const [bmiTab, setBmiTab] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'



  // Line Chart datasets
  const weightChartData = useMemo(() => {
    // Labels mapping
    let labels = [];
    let data = [];
    if (weightTab === 'daily') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      data = [194.8, 194.6, 194.5, 194.4, currentWeight];
    } else if (weightTab === 'weekly') {
      labels = ['W1', 'W2', 'W3', 'W4', 'W5'];
      data = [196.5, 195.8, 195.0, 194.5, currentWeight];
    } else {
      labels = ['May', 'Jun', 'Jul', 'Aug', 'Sep'];
      data = [204.0, 198.3, 195.3, 194.3, currentWeight];
    }

    // Convert to Kg if necessary
    if (currentUnit === 'Kg') {
      data = data.map(val => parseFloat((val * 0.45359237).toFixed(1)));
    }
    return { labels, data };
  }, [weightTab, currentWeight, currentUnit]);

  const bmiChartData = useMemo(() => {
    let labels = [];
    let data = [];
    if (bmiTab === 'daily') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      data = [27.8, 27.75, 27.72, 27.7, currentBmi];
    } else if (bmiTab === 'weekly') {
      labels = ['W1', 'W2', 'W3', 'W4', 'W5'];
      data = [28.0, 27.9, 27.8, 27.7, currentBmi];
    } else {
      labels = ['May', 'Jun', 'Jul', 'Aug', 'Sep'];
      data = [28.9, 28.1, 27.7, 27.6, currentBmi];
    }
    return { labels, data };
  }, [bmiTab, currentBmi]);

  // Sheet handlers
  const handleOpenUpdateSheet = useCallback(() => {
    console.log('enter on update sheet')
    setIsUpdateSheetVisible(true);
  }, []);

  const handleCloseUpdateSheet = useCallback(() => {
    setIsUpdateSheetVisible(false);
  }, []);

  const handleSaveWeightSubmit = useCallback(async (inputWeight, inputUnit) => {
    const parsedWeight = parseFloat(inputWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      ToastService.show({
        type: 'error',
        message: t('tracker.bottomSheet.invalidWeight', 'Please enter a valid weight.'),
      });
      return;
    }

    try {
      Keyboard.dismiss();
      await updateProfile({
        currentWeight: parsedWeight,
        unit: inputUnit,
      });

      ToastService.show({
        type: 'success',
        message: t('tracker.bottomSheet.successToast', 'Weight updated successfully.'),
      });
      setIsUpdateSheetVisible(false);
    } catch (error) {
      ToastService.show({
        type: 'error',
        message: t('tracker.bottomSheet.errorToast', 'Failed to update weight.'),
      });
    }
  }, [updateProfile, t]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header
        title={t('tracker.title')}
        showBack
        titleAlign="left"
        transparent={true}

      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Update Weight Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconWrapper}>
            <Image source={APP_IMAGES.unitWhiteIcon} style={styles.bannerIcon} />
          </View>
          <View style={styles.bannerTextContainer}>
            <AppText variant="body" style={styles.bannerTitle}>
              {t('tracker.updateWeightCard.title')}
            </AppText>
            <AppText variant="caption" style={styles.bannerSubtitle}>
              {t('tracker.updateWeightCard.subtitle')}
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={handleOpenUpdateSheet}
            activeOpacity={0.8}
          >
            <AppText style={styles.bannerButtonText}>
              {t('tracker.updateWeightCard.button', 'Update')}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* 1. Body Weight Card */}
        <View style={styles.trackerCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIconWrapper}>
              {/* <MCIcon name="scale-bathroom" size={18} color={colors.primary} /> */}
              <Image source={APP_IMAGES.unitIcon} style={styles.cardHeaderIcon} />
            </View>
            <View style={styles.cardHeaderTextContainer}>
              <View style={styles.cardTitleRow}>
                <AppText variant="body" color={colors.textPrimary} style={styles.cardTitle}>
                  {t('tracker.bodyWeight.title', 'Body Weight')}
                </AppText>
                <Ionicons name="information-circle-outline" size={16} color={colors.textTertiary} />
              </View>
              <AppText variant="caption" color={colors.textSecondary} >
                {t('tracker.bodyWeight.subtitle', 'Slow and steady wins the race.')}
              </AppText>
            </View>
            <View style={styles.badge}>
              <AppText variant="bodySmall" color={colors.primary} style={styles.badgeText}>
                {currentWeight} <AppText variant="caption" color={colors.primary} style={styles.bodyWeightBadgeUnit}>{currentUnit}</AppText>
              </AppText>
            </View>
          </View>

          {/* Line Chart */}
          <Chart
            labels={weightChartData.labels}
            data={weightChartData.data}
            lineColor={colors.primary}
            formatYLabel={(val) => `${parseFloat(val).toFixed(1)}`}
            style={styles.chartContainer}
            chartStyle={styles.monthlyChart}
          />

          {/* Segmented Period Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, weightTab === 'daily' && styles.tabBtnActive]}
              onPress={() => setWeightTab('daily')}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={weightTab === 'daily' ? styles.tabTextActive : styles.tabTextInactive}>
                {t('tracker.tabs.daily', 'Daily')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, weightTab === 'weekly' && styles.tabBtnActive]}
              onPress={() => setWeightTab('weekly')}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={weightTab === 'weekly' ? styles.tabTextActive : styles.tabTextInactive}>
                {t('tracker.tabs.weekly', 'Weekly')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, weightTab === 'monthly' && styles.tabBtnActive]}
              onPress={() => setWeightTab('monthly')}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={weightTab === 'monthly' ? styles.tabTextActive : styles.tabTextInactive}>
                {t('tracker.tabs.monthly', 'Monthly')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. BMI Card */}
        <View style={styles.trackerCard}>
          <View style={styles.cardHeader}>
            <View style={styles.bmiIconContainer}>
              {/* <MCIcon name="fire" size={18} color={colors.error} /> */}
              <Image source={APP_IMAGES.bmiIcon} style={styles.cardHeaderIcon} />
            </View>
            <View style={styles.cardHeaderTextContainer}>
              <View style={styles.cardTitleRow}>
                <AppText variant="body" color={colors.textPrimary} style={styles.cardTitle}>
                  {t('tracker.bmi.title', 'Body Mass Index')}
                </AppText>
                <Ionicons name="information-circle-outline" size={16} color={colors.textTertiary} />
              </View>
              <AppText variant="caption" color={colors.textSecondary} style={styles.cardSubtitle}>
                {t('tracker.bmi.subtitle', "It's not a diet. It's a lifestyle change.")}
              </AppText>
            </View>
            <View style={styles.bmiBadge}>
              <AppText variant="bodySmall" style={styles.bmiBadgeText}>
                {currentBmi} <AppText variant="caption" style={styles.bmiBadgeUnitText}>{t('tracker.bmi.badge', 'BMI')}</AppText>
              </AppText>
            </View>
          </View>

          {/* BMI Ranges Indicators */}
          <View style={styles.bmiRangeContainer}>
            <View style={styles.bmiRangeLabelsRow}>
              {segments.map((seg) => (
                <View key={seg.key} style={styles.bmiRangeLabelContainer}>
                  <AppText variant="caption" color={colors.textSecondary} style={styles.bmiRangeLabelText}>
                    {seg.label}
                  </AppText>
                </View>
              ))}
            </View>

            <View style={styles.bmiRangesBar}>
              {segments.map((seg) => (
                <View key={seg.key} style={[styles.bmiSegment, seg.style]} />
              ))}
              <View style={[
                styles.bmiIndicatorDot,
                {
                  left: `${bmiDetails.percent}%`,
                  backgroundColor: bmiDetails.color
                }
              ]} />
            </View>

            <AppText variant="caption" color={bmiDetails.color} style={styles.bmiStatusText}>
              {statusParts[0]}
              {t('tracker.bmi.ranges.currentValue', '{{range}}', { range: bmiDetails.label })}
              {statusParts[1]}
            </AppText>
          </View>

          {/* Line Chart */}
          <Chart
            labels={bmiChartData.labels}
            data={bmiChartData.data}
            lineColor={bmiDetails.color}
            fillColor={bmiDetails.fillColor}
            formatYLabel={(val) => `${parseFloat(val).toFixed(1)}`}
            style={styles.chartContainer}
            chartStyle={styles.monthlyChart}
          />

          {/* Segmented Period Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, bmiTab === 'daily' && styles.tabBtnActive]}
              onPress={() => setBmiTab('daily')}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={bmiTab === 'daily' ? styles.tabTextActive : styles.tabTextInactive}>
                {t('tracker.tabs.daily', 'Daily')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, bmiTab === 'weekly' && styles.tabBtnActive]}
              onPress={() => setBmiTab('weekly')}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={bmiTab === 'weekly' ? styles.tabTextActive : styles.tabTextInactive}>
                {t('tracker.tabs.weekly', 'Weekly')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, bmiTab === 'monthly' && styles.tabBtnActive]}
              onPress={() => setBmiTab('monthly')}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={bmiTab === 'monthly' ? styles.tabTextActive : styles.tabTextInactive}>
                {t('tracker.tabs.monthly', 'Monthly')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Reusable Weight Update Bottom Sheet */}
      <UpdateWeightBottomSheet
        visible={isUpdateSheetVisible}
        initialWeight={currentWeight}
        unit={currentUnit}
        onClose={handleCloseUpdateSheet}
        onSave={handleSaveWeightSubmit}
      />
    </SafeContainer>
  );
};

export default memo(TrackProgressScreen);
