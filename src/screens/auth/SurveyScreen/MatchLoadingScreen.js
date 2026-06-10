/**
 * MatchLoadingScreen
 *
 * Shows a Robi animation, rotating status labels,
 * and a skeleton card while the match API resolves.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { useTheme } from '../../../theme';
import { AppText, SafeContainer } from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import { createSurveyStyles } from './styles';

const STAGE_KEYS = [
  'matchLoading.stage1',
  'matchLoading.stage2',
  'matchLoading.stage3',
  'matchLoading.stage4',
];
const MAX_STAGES = STAGE_KEYS.length;
const STAGE_DURATION_MS = 1000;

const mockFetchMatch = () =>
  new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          id: '1',
          name: 'David J.',
          tag: 'Gentle Accountability',
          matchPercent: 96,
        }),
      3000,
    ),
  );

const useShimmer = () => {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [shimmer]);
  return shimmer;
};

const SkeletonBlock = ({ shimmer, style, colors }) => {
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });
  return <Animated.View style={[{ backgroundColor: colors.gray300, borderRadius: 8, opacity }, style]} />;
};

const SkeletonCard = ({ shimmer, colors, skStyles }) => (
  <View style={skStyles.card}>
    <View style={skStyles.topRow}>
      <SkeletonBlock shimmer={shimmer} style={skStyles.avatar} colors={colors} />
      <View style={skStyles.nameCol}>
        <SkeletonBlock shimmer={shimmer} style={skStyles.nameLine} colors={colors} />
        <SkeletonBlock shimmer={shimmer} style={skStyles.subLine} colors={colors} />
      </View>
    </View>
    <View style={[skStyles.divider, { backgroundColor: colors.divider }]} />
    <SkeletonBlock shimmer={shimmer} style={[skStyles.line, { width: '90%' }]} colors={colors} />
    {[0.55, 0.45, 0.50].map((w, i) => (
      <View key={i} style={skStyles.bulletRow}>
        <SkeletonBlock shimmer={shimmer} style={skStyles.bullet} colors={colors} />
        <SkeletonBlock shimmer={shimmer} style={[skStyles.lineSm, { width: `${w * 100}%` }]} colors={colors} />
      </View>
    ))}
    <SkeletonBlock shimmer={shimmer} style={skStyles.bottomBar} colors={colors} />
  </View>
);

const useFadeIn = trigger => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [trigger, opacity]);
  return opacity;
};

const MatchLoadingScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { t } = useTranslation();
  const shimmer = useShimmer();

  const baseStyles = useMemo(
    () => StyleSheet.create({ ...createSurveyStyles({ colors, spacing }) }),
    [colors, spacing],
  );
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);
  const skStyles = useMemo(() => createSkeletonStyles({ colors }), [colors]);

  const [stageIndex, setStageIndex] = useState(0);
  const labelOpacity = useFadeIn(stageIndex);

  const [videoReady, setVideoReady] = useState(false);
  const videoOpacity = useRef(new Animated.Value(0)).current;

  const handleVideoLoad = useCallback(() => {
    setVideoReady(true);
    Animated.timing(videoOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [videoOpacity]);

  const apiResolvedRef = useRef(false);
  const apiDataRef = useRef(null);
  const currentStageRef = useRef(0);
  const navigatedRef = useRef(false);

  const doNavigate = useCallback(
    data => {
      if(navigatedRef.current) return;
      navigatedRef.current = true;
      navigation.replace(ROUTES.MATCH_RESULT, { matchData: data });
    },
    [navigation],
  );

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    const tickInterval = setInterval(() => {
      if(!isMounted || navigatedRef.current) return;

      const elapsedMs = Date.now() - startTime;
      const elapsedSeconds = Math.floor(elapsedMs / STAGE_DURATION_MS);
      const nextStage = currentStageRef.current + 1;

      if(nextStage < MAX_STAGES) {
        currentStageRef.current = nextStage;
        setStageIndex(nextStage);
      }
      if(apiResolvedRef.current) {
        const stagesDue = Math.min(elapsedSeconds, MAX_STAGES);
        if(currentStageRef.current >= stagesDue - 1) {
          clearInterval(tickInterval);
          doNavigate(apiDataRef.current);
        }
      }
    }, STAGE_DURATION_MS);

    mockFetchMatch().then(data => {
      if(!isMounted || navigatedRef.current) return;
      apiResolvedRef.current = true;
      apiDataRef.current = data;

      const elapsedMs = Date.now() - startTime;
      const elapsedSeconds = Math.floor(elapsedMs / STAGE_DURATION_MS);
      const stagesDue = Math.min(elapsedSeconds, MAX_STAGES);

      if(currentStageRef.current >= stagesDue - 1) {
        clearInterval(tickInterval);
        doNavigate(data);
      }
    });

    return () => {
      isMounted = false;
      clearInterval(tickInterval);
    };
  }, [doNavigate]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <View style={[baseStyles.header, { justifyContent: 'flex-start' }]}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={baseStyles.backBtn}>
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <View style={styles.illustrationWrapper}>
        <Animated.View style={{ opacity: videoOpacity }}>
          <Video
            source={require('../../../assets/videos/loading_buddy_match.mp4')}
            style={styles.video}
            repeat
            muted
            resizeMode="contain"
            onLoad={handleVideoLoad}
            seek={0.1}
          />
        </Animated.View>
      </View>
      <Animated.View style={[styles.labelBlock, { opacity: labelOpacity }]}>
        <AppText variant="h3" color={colors.textPrimary} style={styles.heading}>
          {t(STAGE_KEYS[stageIndex])}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subheading}>
          {t('matchLoading.subtitle')}
        </AppText>
      </Animated.View>
      <View style={styles.cardWrapper}>
        <SkeletonCard shimmer={shimmer} colors={colors} skStyles={skStyles} />
      </View>
    </SafeContainer>
  );
};

const createSkeletonStyles = ({ colors }) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      ...(__getShadow()),
    },
    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar: { width: 52, height: 52, borderRadius: 10, marginRight: 14 },
    nameCol: { flex: 1, gap: 8 },
    nameLine: { height: 14, width: '60%', borderRadius: 6 },
    subLine: { height: 12, width: '80%', borderRadius: 6 },
    divider: { height: 1, marginBottom: 14 },
    line: { height: 12, borderRadius: 6, marginBottom: 10 },
    bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    bullet: { width: 8, height: 8, borderRadius: 4 },
    lineSm: { height: 11, borderRadius: 6 },
    bottomBar: { height: 42, borderRadius: 10, marginTop: 14, width: '100%' },
  });

const __getShadow = () =>
  Platform.OS === 'android'
    ? { elevation: 3 }
    : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 };

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    illustrationWrapper: {
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 12,
    },
    video: {
      width: 280,
      height: 280,
    },
    labelBlock: {
      alignItems: 'center',
      paddingHorizontal: spacing[6],
    },
    heading: {
      textAlign: 'center',
      marginBottom: 8,
    },
    subheading: {
      textAlign: 'center',
      marginBottom: 28,
    },
    cardWrapper: {
      flex: 1,
      paddingHorizontal: spacing[5],
    },
  });

export default MatchLoadingScreen;
