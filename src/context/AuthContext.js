/**
 * AuthContext — replaces Redux auth slice
 * Provides: isAuthenticated, token, loading, error
 * Actions: signUpWithEmail, loginWithEmail, logout
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import authService from '../api/services/authService';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';
import { getApiErrorMessage } from '../utils/apiErrorHandler';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
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
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState };
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

  const signUpWithEmail = useCallback(async payload => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await authService.signUp(payload);
      if (data.token) {
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      }
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.token });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: getApiErrorMessage(error) });
    }
  }, []);

  const loginWithEmail = useCallback(async payload => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await authService.login(payload);
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      if (data.refresh_token) {
        await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
      }
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.token });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: getApiErrorMessage(error) });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch { /* ignore server errors on logout */ }
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
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
        logout,
        clearError,
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
