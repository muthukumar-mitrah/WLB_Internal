/**
 * AuthContext — replaces Redux auth slice
 * Provides: isAuthenticated, token, loading, initializing, error
 * Actions: signUpWithEmail, loginWithEmail, completeAuthSession, logout
 */
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import authService from '../api/services/authService';
import { storage } from '../utils/storage';
import { STORAGE_KEYS, MOCK_AUTH } from '../constants';
import { useTranslation } from '../i18n/useTranslation';
import { getApiErrorMessage } from '../utils/apiErrorHandler';
import {
  signInWithGoogle as googleSignIn,
  logoutGoogle as googleLogout,
} from '../services/googleAuth';
import {
  signInWithFacebook as fbSignIn,
  logoutFacebook as fbLogout,
} from '../services/facebookAuth';
import {
  signInWithApple as appleSignIn,
  logoutApple as appleLogout,
} from '../services/appleAuth';
import { ToastService } from '../components/common/Toast'

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  initializing: true,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  RESTORE_SESSION: 'RESTORE_SESSION',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isAuthenticated: true,
        token: action.payload,
      };
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        initializing: false,
        isAuthenticated: Boolean(action.payload),
        token: action.payload || null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, initializing: false };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { t } = useTranslation();

  useEffect(() => {
    const restoreSession = async () => {
      const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      dispatch({ type: AUTH_ACTIONS.RESTORE_SESSION, payload: token });
    };
    restoreSession();
  }, []);

  const signUpWithEmail = useCallback(async payload => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await authService.signUp(payload);
      if (data.token) {
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.token });
      }
    } catch (error) {
      const errorMsg = await getApiErrorMessage(error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMsg });
    }
  }, []);

  const loginWithEmail = useCallback(async payload => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { email, password } = payload;
      const identifier = email?.trim().toLowerCase();

      // Temporary static login flow for development/testing.
      // Replace this block with the authService.login call once the API is ready.
      if (identifier === MOCK_AUTH.IDENTIFIER && password === MOCK_AUTH.PASSWORD) {
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, MOCK_AUTH.TOKEN);
        dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: MOCK_AUTH.TOKEN });
        return;
      }

      ToastService.show({
        type: 'error',
        message: t('auth.errors.invalidCredentials'),
      });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });

      // const { data } = await authService.login(payload);
      // if(data.token) {
      //   await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      //   dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.token });
      // }
      // if(data.refresh_token) {
      //   await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
      // }
    } catch (error) {
      const errorMsg = await getApiErrorMessage(error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMsg });
    }
  }, [t]);

  const completeAuthSession = useCallback(async (token = MOCK_AUTH.TOKEN) => {
    await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: token });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch { /* ignore server errors on logout */ }
    googleLogout();
    fbLogout();
    appleLogout();
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return await googleSignIn();
  }, []);

  const signInWithFacebook = useCallback(async () => {
    return await fbSignIn();
  }, []);

  const signInWithApple = useCallback(async () => {
    return await appleSignIn();
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUpWithEmail,
        loginWithEmail,
        completeAuthSession,
        logout,
        clearError,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};

export default AuthContext;
