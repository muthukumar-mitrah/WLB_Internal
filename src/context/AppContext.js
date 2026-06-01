/**
 * AppContext — replaces Redux user + ui slices
 * Provides: userProfile, globalLoading, toast
 * Actions: setUserProfile, clearUserProfile, showLoader, hideLoader, showToast, hideToast
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  userProfile: null,
  globalLoading: false,
  toast: null, // { type: 'success'|'error'|'info'|'warning', message: '' }
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const APP_ACTIONS = {
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  CLEAR_USER_PROFILE: 'CLEAR_USER_PROFILE',
  SHOW_LOADER: 'SHOW_LOADER',
  HIDE_LOADER: 'HIDE_LOADER',
  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',
};

const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_USER_PROFILE:
      return { ...state, userProfile: action.payload };
    case APP_ACTIONS.CLEAR_USER_PROFILE:
      return { ...state, userProfile: null };
    case APP_ACTIONS.SHOW_LOADER:
      return { ...state, globalLoading: true };
    case APP_ACTIONS.HIDE_LOADER:
      return { ...state, globalLoading: false };
    case APP_ACTIONS.SHOW_TOAST:
      return { ...state, toast: action.payload };
    case APP_ACTIONS.HIDE_TOAST:
      return { ...state, toast: null };
    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUserProfile = useCallback(profile => {
    dispatch({ type: APP_ACTIONS.SET_USER_PROFILE, payload: profile });
  }, []);

  const clearUserProfile = useCallback(() => {
    dispatch({ type: APP_ACTIONS.CLEAR_USER_PROFILE });
  }, []);

  const showLoader = useCallback(() => {
    dispatch({ type: APP_ACTIONS.SHOW_LOADER });
  }, []);

  const hideLoader = useCallback(() => {
    dispatch({ type: APP_ACTIONS.HIDE_LOADER });
  }, []);

  const showToast = useCallback((type, message) => {
    dispatch({ type: APP_ACTIONS.SHOW_TOAST, payload: { type, message } });
  }, []);

  const hideToast = useCallback(() => {
    dispatch({ type: APP_ACTIONS.HIDE_TOAST });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUserProfile,
        clearUserProfile,
        showLoader,
        hideLoader,
        showToast,
        hideToast,
      }}>
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside <AppProvider>');
  }
  return ctx;
};

export default AppContext;
