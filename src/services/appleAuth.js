import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';

/**
 * Trigger Apple Sign In and return structured user data.
 *
 * Returns:
 *   { success: true, accessToken, identityToken, authorizationCode, user: { id, name, email, photo } }
 *   { success: false, cancelled: true }
 *   { success: false, error: string }
 *
 * IMPORTANT: Apple only returns name and email on the FIRST successful authorization.
 * On subsequent logins these fields will be empty strings — this is expected Apple behaviour.
 */
export const signInWithApple = async () => {
  if (!appleAuth.isSupported) {
    return { success: false, error: 'apple_auth_not_supported' };
  }

  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.NAME],
    });

    if (!response.identityToken) {
      return { success: false, error: 'no_identity_token' };
    }

    const credentialState = await appleAuth.getCredentialStateForUser(
      response.user,
    );
    if (credentialState !== appleAuth.State.AUTHORIZED) {
      return { success: false, error: 'credential_not_authorized' };
    }

    const firstName = response.fullName?.givenName ?? '';
    const lastName = response.fullName?.familyName ?? '';
    const name = [firstName, lastName].filter(Boolean).join(' ');

    return {
      success: true,
      accessToken: response.identityToken,
      identityToken: response.identityToken,
      authorizationCode: response.authorizationCode ?? '',
      user: {
        id: response.user ?? '',
        name,
        email: response.email ?? '',
        photo: '',
      },
    };
  } catch (error) {
    if (error?.code === appleAuth.Error.CANCELED) {
      return { success: false, cancelled: true };
    }
    if (error?.code === appleAuth.Error.FAILED) {
      return { success: false, error: 'apple_auth_failed' };
    }
    if (error?.code === appleAuth.Error.INVALID_RESPONSE) {
      return { success: false, error: 'invalid_response' };
    }
    if (error?.code === appleAuth.Error.NOT_HANDLED) {
      return { success: false, error: 'not_handled' };
    }
    if (error?.code === appleAuth.Error.UNKNOWN) {
      return { success: false, error: 'unknown_apple_error' };
    }
    return {
      success: false,
      error: error?.message || 'apple_signin_failed',
    };
  }
};

/**
 * Apple does not expose a programmatic JS-level sign-out API.
 * Session revocation is handled by iOS Settings → Apple ID → Password & Security → Apps Using Apple ID.
 * This function exists for architectural consistency with googleAuth and facebookAuth.
 */
export const logoutApple = () => {
  // No-op — intentional. Apple manages session state at the OS level.
};

/**
 * Returns true when Apple Sign In is available on the current device.
 * Always true for iOS 13+ (project minimum is iOS 15.1).
 * Always false on Android.
 */
export const isAppleAuthSupported = () => {
  return Platform.OS === 'ios' && appleAuth.isSupported;
};