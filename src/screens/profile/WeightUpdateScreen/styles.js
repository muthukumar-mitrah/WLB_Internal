import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const PAGE_PADDING = 20; // spacing[5]
const CARD_WIDTH = SCREEN_WIDTH - 2 * PAGE_PADDING;

const createStyles = ({colors, spacing, borderRadius, shadows}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: PAGE_PADDING,
      paddingBottom: spacing[8],
      paddingTop: spacing[4],
    },
    weightFieldContainer: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.primarySurface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[4],
      height: 52,
      justifyContent: 'center',
      marginBottom: spacing[5],
    },
    weightFieldInput: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '500',
      padding: 0,
      textAlign: 'left',
    },
    privacyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing[3],
      marginBottom: spacing[6],
    },
    privacyTexts: {
      flex: 1,
    },
    privacyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    privacyValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sliderCard: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.xl,
      paddingVertical: spacing[5],
      paddingHorizontal: spacing[4],
      alignItems: 'center',
      marginBottom: spacing[6],
      marginTop: spacing[2],
      ...shadows.xs,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 20,
      padding: 2,
      width: 110,
      height: 38,
      alignSelf: 'center',
      alignItems: 'center',
      marginBottom: spacing[4],
    },
    toggleButton: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 18,
    },
    toggleButtonActive: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: '#93C5FD',
      ...shadows.xs,
    },
    toggleText: {
      fontSize: 14,
      fontWeight: '600',
    },
    weightDisplayRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      marginBottom: spacing[5],
    },
    weightDisplayText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    weightDisplayUnit: {
      fontSize: 16,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    rulerContainer: {
      width: CARD_WIDTH - spacing[4],
      height: 90,
      position: 'relative',
      overflow: 'hidden',
    },
    rulerScrollView: {
      height: '100%',
    },
    rulerContent: {
      alignItems: 'flex-start',
    },
    pointerContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '50%',
      width: 2,
      marginLeft: -1,
      alignItems: 'center',
      zIndex: 10,
    },
    pointerDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      position: 'absolute',
      top: 16,
    },
    pointerLine: {
      width: 2,
      height: 48,
      backgroundColor: colors.primary,
      position: 'absolute',
      top: 20,
    },
    tickContainer: {
      width: 10,
      height: 75,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    tickLine: {
      width: 1.5,
      backgroundColor: colors.border,
      borderRadius: 1,
    },
    minorTick: {
      height: 16,
      marginTop: 20,
    },
    majorTick: {
      height: 32,
      marginTop: 20,
    },
    tickLabel: {
      position: 'absolute',
      top: 56,
      fontSize: 12,
      fontWeight: '500',
      color: colors.textTertiary,
      textAlign: 'center',
      width: 40,
      marginLeft: -20,
      left: 5,
    },
    spacer: {
      flex: 1,
    },
    buttonContainer: {
      width: '100%',
    },
  });

export default createStyles;
export {CARD_WIDTH};
