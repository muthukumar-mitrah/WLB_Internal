/**
 * styles.js — Shared survey screen styles
 */
import { Dimensions, StyleSheet } from 'react-native';
import { fontFamily } from '../../../theme/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export { SCREEN_WIDTH, SCREEN_HEIGHT };

// ─── 1. Common layout (spread into each screen's StyleSheet.create) ───────────
/**
 * Returns a PLAIN OBJECT (not a StyleSheet) so screens can spread it.
 * Call inside useMemo and wrap with StyleSheet.create together with
 * any screen-specific properties.
 */
export const createSurveyStyles = ({ colors, spacing }) => ({
  /* Root */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Top section — light-gray background */
  topSection: {
    height: SCREEN_HEIGHT * 0.55,
    backgroundColor: colors.backgroundSecondary,
  },

  /* Header row */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Illustration — fills remaining space inside topSection */
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },
  illustration: {
    width: SCREEN_WIDTH * 0.88,
    height: '100%', // fills the flex:1 illustrationArea
  },

  /* Bottom section — white content area */
  bottomSection: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
    flexGrow: 1,
  },

  /* Question text */
  question: {
    fontFamily: fontFamily.headingSemiBold,
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 20,
    bottom: 15
  },

  /* Bottom nav buttons */
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[5],
    paddingTop: spacing[6],
    gap: spacing[3],
    backgroundColor: colors.background,
  },
  halfBtn: { flex: 1 },
});

// ─── 2. Q1 — option row static styles ────────────────────────────────────────
export const createQ1OptionStyles = ({ colors }) => ({
  rowDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  rowSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#3685C6',
    backgroundColor: '#EBF3F9',
    marginBottom: 10,
  },
  label: { flex: 1 },
});

export const radioOptionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
  },
  label: { flex: 1, marginRight: 12 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── 3. Q2 — value-display extras ────────────────────────────────────────────
export const createQ2ExtraStyles = ({ colors, spacing }) => ({
  bottomSectionClip: {
    overflow: 'hidden',
  },
  sliderWrapper: {
    paddingHorizontal: spacing[3],
  },
  valueWrapper: {
    alignItems: 'center',
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  valueBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  valueNumber: { lineHeight: 44 },
  valueUnit: { marginBottom: 6, fontWeight: '600' },
  spacer: { flex: 1 },
});

// ─── 4. Q3 — options list layout + option-row static styles ──────────────────
export const createQ3ExtraStyles = ({ spacing }) => ({
  optionsRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  optionsList: { flex: 1, marginRight: 5 },
});

export const q3OptionStyles = StyleSheet.create({
  row: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
