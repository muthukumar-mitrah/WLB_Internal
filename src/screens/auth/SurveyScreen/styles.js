/**
 * styles.js — Shared survey screen styles
 */
import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export { SCREEN_WIDTH, SCREEN_HEIGHT };

export const createSurveyStyles = ({ colors, spacing }) => ({
  /* Root */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header row */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  illustration: {
    width: SCREEN_WIDTH * 0.88,
    height: 310,
    alignSelf: 'center',
  },

  /* Bottom section — white content area */
  bottomSection: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    flexGrow: 1,
  },

  /* Question text */


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

  /* Post-match shared styles */
  postMatchBackBtn: {
    position: 'absolute',
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postMatchFooter: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[7],
    paddingTop: spacing[3],
    backgroundColor: colors.background,
  },
  postMatchCtaBtn: {
    width: '100%',
    borderRadius: 14,
  },
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
    backgroundColor:  colors.backgroundSecondary,
  },
  rowSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundTertiary,
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
    paddingHorizontal: spacing[5],
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
