/**
 * MatchLoadingScreen
 *
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
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

// ─── Stage labels (one displayed per second) ──────────────────────────────────
const STAGES = [
  'Give me a second…',
  'Comparing goals…',
  'Checking compatibility…',
  'Finding your best match…',
];
const MAX_STAGES = STAGES.length; // 4
const STAGE_DURATION_MS = 1000;

// ─── Simulated API call ───────────────────────────────────────────────────────
// Replace with the real API call when ready.
// Change this delay to test different timing branches:
//   2000 → shows 2 stages   3000 → 3 stages   4000 → 4 stages   5000 → holds
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

// ─── Skeleton shimmer ─────────────────────────────────────────────────────────
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

const SkeletonBlock = ({ shimmer, style }) => {
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });
  return <Animated.View style={[{ backgroundColor: '#D1D5DB', borderRadius: 8, opacity }, style]} />;
};

const SkeletonCard = ({ shimmer }) => (
  <View style={skeletonStyles.card}>
    <View style={skeletonStyles.topRow}>
      <SkeletonBlock shimmer={shimmer} style={skeletonStyles.avatar} />
      <View style={skeletonStyles.nameCol}>
        <SkeletonBlock shimmer={shimmer} style={skeletonStyles.nameLine} />
        <SkeletonBlock shimmer={shimmer} style={skeletonStyles.subLine} />
      </View>
    </View>
    <View style={skeletonStyles.divider} />
    <SkeletonBlock shimmer={shimmer} style={[skeletonStyles.line, { width: '90%' }]} />
    {[0.55, 0.45, 0.50].map((w, i) => (
      <View key={i} style={skeletonStyles.bulletRow}>
        <SkeletonBlock shimmer={shimmer} style={skeletonStyles.bullet} />
        <SkeletonBlock shimmer={shimmer} style={[skeletonStyles.lineSm, { width: `${w * 100}%` }]} />
      </View>
    ))}
    <SkeletonBlock shimmer={shimmer} style={skeletonStyles.bottomBar} />
  </View>
);

// ─── Stage label fade-in ──────────────────────────────────────────────────────
const useFadeIn = trigger => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [trigger, opacity]);
  return opacity;
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const MatchLoadingScreen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const shimmer = useShimmer();

  const [stageIndex, setStageIndex] = useState(0);
  const labelOpacity = useFadeIn(stageIndex);

  // refs — readable synchronously inside setInterval callbacks
  const apiResolvedRef = useRef(false);
  const apiDataRef = useRef(null);
  const currentStageRef = useRef(0); // tracks the stage currently displayed
  const navigatedRef = useRef(false);

  const doNavigate = useCallback(
    data => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      navigation.replace(ROUTES.MATCH_RESULT, { matchData: data });
    },
    [navigation],
  );

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    // ── Tick every 1 s ────────────────────────────────────────────────────────
    const tickInterval = setInterval(() => {
      if (!isMounted || navigatedRef.current) return;

      const elapsedMs = Date.now() - startTime;
      const elapsedSeconds = Math.floor(elapsedMs / STAGE_DURATION_MS); // how many full seconds have passed
      const nextStage = currentStageRef.current + 1;

      if (nextStage < MAX_STAGES) {
        // Advance to the next stage
        currentStageRef.current = nextStage;
        setStageIndex(nextStage);
      }
      // else: we are already at the last stage — keep displaying it

      // ── Navigation check ──────────────────────────────────────────────────
      // Navigate if the API has resolved AND we have displayed the correct
      // number of stages for the elapsed time.
      //
      // "Correct number of stages" = elapsedSeconds (1-based), i.e. index = elapsedSeconds - 1.
      // We navigate as soon as the currently shown stage index catches up to
      // what the elapsed time dictates AND the API is done.
      if (apiResolvedRef.current) {
        const stagesDue = Math.min(elapsedSeconds, MAX_STAGES); // 1-based count
        if (currentStageRef.current >= stagesDue - 1) {
          clearInterval(tickInterval);
          doNavigate(apiDataRef.current);
        }
      }
    }, STAGE_DURATION_MS);

    // ── API call ──────────────────────────────────────────────────────────────
    mockFetchMatch().then(data => {
      if (!isMounted || navigatedRef.current) return;
      apiResolvedRef.current = true;
      apiDataRef.current = data;

      // Check immediately: if we are already past the number of stages that
      // correspond to the elapsed time, navigate now (handles fast responses
      // that resolve between ticks, or after all stages are already shown).
      const elapsedMs = Date.now() - startTime;
      const elapsedSeconds = Math.floor(elapsedMs / STAGE_DURATION_MS);
      const stagesDue = Math.min(elapsedSeconds, MAX_STAGES);

      if (currentStageRef.current >= stagesDue - 1) {
        clearInterval(tickInterval);
        doNavigate(data);
      }
      // Otherwise, the next tick will see apiResolved === true and navigate.
    });

    return () => {
      isMounted = false;
      clearInterval(tickInterval);
    };
  }, [doNavigate]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* ── Back button ── */}
      <View style={[styles.header, { paddingHorizontal: spacing[4], paddingTop: spacing[3] }]}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}>
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Animated GIF illustration ── */}
      <View style={styles.illustrationWrapper}>
        <Video
          source={require('../../../assets/videos/loading_buddy_match.mp4')}
          style={styles.video}
          repeat
          muted
          resizeMode="contain"
        />
      </View>

      {/* ── Animated stage label ── */}
      <Animated.View style={[styles.labelBlock, { opacity: labelOpacity, paddingHorizontal: spacing[6] }]}>
        <AppText variant="h3" color={colors.textPrimary} style={styles.heading}>
          {STAGES[stageIndex]}
        </AppText>
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.subheading}>
          I'm finding someone who gets you.
        </AppText>
      </Animated.View>

      {/* ── Skeleton card ── */}
      <View style={[styles.cardWrapper, { paddingHorizontal: spacing[5] }]}>
        <SkeletonCard shimmer={shimmer} />
      </View>
    </SafeContainer>
  );
};

// ─── Skeleton styles ──────────────────────────────────────────────────────────
const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 52, height: 52, borderRadius: 10, marginRight: 14 },
  nameCol: { flex: 1, gap: 8 },
  nameLine: { height: 14, width: '60%', borderRadius: 6 },
  subLine: { height: 12, width: '80%', borderRadius: 6 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 14 },
  line: { height: 12, borderRadius: 6, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  bullet: { width: 8, height: 8, borderRadius: 4 },
  lineSm: { height: 11, borderRadius: 6 },
  bottomBar: { height: 42, borderRadius: 10, marginTop: 14, width: '100%' },
});

// ─── Screen styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  illustrationWrapper: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
  video: { width: 400, height: 400 },
  labelBlock: { alignItems: 'center' },
  heading: { fontWeight: '700', fontSize: 22, textAlign: 'center', marginBottom: 8 },
  subheading: { textAlign: 'center', fontSize: 14, marginBottom: 28 },
  cardWrapper: { flex: 1 },
});

export default MatchLoadingScreen;
