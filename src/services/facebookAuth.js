import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

const FB_PERMISSIONS = ['public_profile', 'email'];

const fetchFacebookProfile = () =>
  new Promise((resolve, reject) => {
    const request = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: { string: 'id,name,email,picture.type(large)' },
        },
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    new GraphRequestManager().addRequest(request).start();
  });

/**
 * Trigger Facebook OAuth login and return structured user data.
 *
 * Returns:
 *   { success: true,  accessToken, user: { id, name, email, photo } }
 *   { success: false, cancelled: true }
 *   { success: false, error: string }
 */
export const signInWithFacebook = async () => {
  try {
    LoginManager.logOut();
    const result = await LoginManager.logInWithPermissions(FB_PERMISSIONS);

    if (result.isCancelled) {
      return { success: false, cancelled: true };
    }

    const tokenData = await AccessToken.getCurrentAccessToken();
    if (!tokenData?.accessToken) {
      return { success: false, error: 'no_access_token' };
    }

    let profile = null;
    try {
      profile = await fetchFacebookProfile();
    } catch {
      // Graph API failed — continue with token only; email will be empty
    }

    return {
      success: true,
      accessToken: tokenData.accessToken,
      user: {
        id: profile?.id ?? tokenData.userID ?? '',
        name: profile?.name ?? '',
        email: profile?.email ?? '',
        photo: profile?.picture?.data?.url ?? '',
      },
    };
  } catch (error) {
    const msg = error?.message ?? '';
    if (
      msg.toLowerCase().includes('cancel') ||
      error?.code === 'ERR_REQUEST_CANCELLED'
    ) {
      return { success: false, cancelled: true };
    }
    return {
      success: false,
      error: msg || 'facebook_signin_failed',
    };
  }
};

/**
 * Clear the active Facebook session.
 * Safe to call even when no session is active.
 */
export const logoutFacebook = () => {
  try {
    LoginManager.logOut();
  } catch {
    // Silently ignore — session may already be cleared
  }
};
