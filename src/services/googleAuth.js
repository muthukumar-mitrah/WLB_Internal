import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

/**
 * Trigger Google OAuth login and return structured user data.
 *
 * Returns:
 *   { success: true, accessToken, idToken, serverAuthCode, user: { id, name, email, photo } }
 *   { success: false, cancelled: true }
 *   { success: false, error: string }
 */
export const signInWithGoogle = async () => {
  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }
    try { await GoogleSignin.signOut(); } catch (e) { /* ignore */ }

    const userInfo = await GoogleSignin.signIn();

    const idToken = userInfo.idToken ?? userInfo.serverAuthCode ?? '';
    const serverAuthCode = userInfo.serverAuthCode ?? null;
    const user = userInfo.user ?? null;

    if (!user) {
      return { success: false, error: 'no_user_info' };
    }

    return {
      success: true,
      accessToken: idToken,
      idToken,
      serverAuthCode,
      user: {
        id: user.id ?? '',
        name: user.name ?? '',
        email: user.email ?? '',
        photo: user.photo ?? '',
      },
    };
  } catch (error) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, cancelled: true };
    }
    if (error?.code === statusCodes.IN_PROGRESS) {
      return { success: false, error: 'in_progress' };
    }
    if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { success: false, error: 'play_services_not_available' };
    }
    return {
      success: false,
      error: error?.message || 'google_signin_failed',
    };
  }
};

/**
 * Clear the active Google session.
 * Safe to call even when no session is active.
 */
export const logoutGoogle = () => {
  GoogleSignin.signOut().catch(() => {
    // Silently ignore — session may already be cleared
  });
};
