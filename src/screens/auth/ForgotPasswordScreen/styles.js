/**
 * Forgot Password module — shared styles
 * Covers all screens: ForgotPassword, VerificationCode, ChangePassword, PasswordResetSuccess
 */
import { StyleSheet } from 'react-native';

// ─── Shared / Common Styles ──────────────────────────────────────────────────
const createCommonStyles = ({ colors, spacing, borderRadius }) => ({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  },
  backButtonWrapper: {
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  subheading: {
    textAlign: 'center',
    paddingHorizontal: spacing[1],
    lineHeight: 22,
    marginBottom: spacing[10],
  },
  continueBtn: {
    borderRadius: borderRadius.lg,
  },
});

// ─── Screen 1: Forgot Password ──────────────────────────────────────────────
const createForgotPasswordStyles = ({ spacing, borderRadius }) => ({
  emailSection: {
    width: '100%',
    marginBottom: spacing[2],
  },
  emailLabel: {
    marginBottom: spacing[2],
    fontWeight: '600',
  },
});

// ─── Screen 2: Verification Code ────────────────────────────────────────────
const createVerificationCodeStyles = ({ colors, spacing, borderRadius }) => ({
  emailIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing[6],
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    marginBottom: spacing[8],
    flexWrap: 'wrap',
  },
  otpContainer: {
    marginBottom: spacing[6],
    width: '100%',
    paddingLeft: spacing[1.5],
  },
  verificationContinueBtn: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing[4],
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
  },
  resendIcon: {
    marginRight: spacing[2],
  },
});

// ─── Screen 3: Change Password ──────────────────────────────────────────────
const createChangePasswordStyles = ({ spacing, borderRadius }) => ({
  changePasswordHeading: {
    marginBottom: spacing[2],
  },
  changePasswordSubheading: {
    lineHeight: 22,
    marginBottom: spacing[8],
  },
  inputSection: {
    width: '100%',
    marginBottom: spacing[2],
  },
  changePasswordContinueBtn: {
    borderRadius: borderRadius.lg,
    marginTop: spacing[2],
  },
  cancelRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
});

// ─── Screen 4: Password Reset Success ───────────────────────────────────────
const createPasswordResetSuccessStyles = ({ colors, spacing, borderRadius }) => ({
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing[10],
  },
  successIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.successSurface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing[6],
  },
  successIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Factory ────────────────────────────────────────────────────────────────
const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    // Common
    ...createCommonStyles({ colors, spacing, borderRadius }),
    // Forgot Password
    ...createForgotPasswordStyles({ spacing, borderRadius }),
    // Verification Code
    ...createVerificationCodeStyles({ colors, spacing, borderRadius }),
    // Change Password
    ...createChangePasswordStyles({ spacing, borderRadius }),
    // Password Reset Success
    ...createPasswordResetSuccessStyles({ colors, spacing, borderRadius }),
  });

export default createStyles;
