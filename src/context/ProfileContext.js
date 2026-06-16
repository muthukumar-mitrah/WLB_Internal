/**
 * ProfileContext — manages the current user's profile state
 * Provides: profile, loading, error
 * Actions: fetchProfile, updateProfile, updateProfileLocal, clearProfile, clearError
 */
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';
import { getApiErrorMessage } from '../utils/apiErrorHandler';
import profileService from '../api/services/profileService';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  profile: null,
  allUsers: [],
  tabs: [],
  reportOptions: [],
  loading: false,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const PROFILE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PROFILE: 'SET_PROFILE',
  SET_ALL_USERS: 'SET_ALL_USERS',
  SET_TABS: 'SET_TABS',
  SET_REPORT_OPTIONS: 'SET_REPORT_OPTIONS',
  CLEAR_PROFILE: 'CLEAR_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const profileReducer = (state, action) => {
  switch (action.type) {
    case PROFILE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case PROFILE_ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    case PROFILE_ACTIONS.SET_PROFILE:
      return {
        ...state,
        loading: false,
        error: null,
        profile: { ...state.profile, ...action.payload },
      };
    case PROFILE_ACTIONS.SET_ALL_USERS:
      return { ...state, loading: false, error: null, allUsers: action.payload };
    case PROFILE_ACTIONS.SET_TABS:
      return { ...state, loading: false, error: null, tabs: action.payload };
    case PROFILE_ACTIONS.SET_REPORT_OPTIONS:
      return { ...state, loading: false, error: null, reportOptions: action.payload };
    case PROFILE_ACTIONS.CLEAR_PROFILE:
      return { ...initialState };
    case PROFILE_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const ProfileContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Initialize profile from storage
  useEffect(() => {
    const initProfile = async () => {
      try {
        const storedProfile = await storage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (storedProfile) {
          dispatch({ type: PROFILE_ACTIONS.SET_PROFILE, payload: JSON.parse(storedProfile) });
        }
      } catch (err) {
        // Ignore storage read errors
      }
    };
    initProfile();
    
    // Automatically load all mock data
    fetchProfile();
    fetchAllUsers();
    fetchStaticData();
  }, [fetchProfile, fetchAllUsers, fetchStaticData]);

  const fetchProfile = useCallback(async () => {
    dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await profileService.getProfile();
      
      if (data) {
        await storage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(data));
        dispatch({ type: PROFILE_ACTIONS.SET_PROFILE, payload: data });
      }
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: getApiErrorMessage(error) });
    }
  }, []);


  const fetchAllUsers = useCallback(async () => {
    dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await profileService.getUsers();
      if (data) dispatch({ type: PROFILE_ACTIONS.SET_ALL_USERS, payload: data });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: getApiErrorMessage(error) });
    }
  }, []);

  const fetchStaticData = useCallback(async () => {
    try {
      const [tabsRes, reportRes] = await Promise.all([
        profileService.getProfileTabs(),
        profileService.getReportOptions(),
      ]);
      dispatch({ type: PROFILE_ACTIONS.SET_TABS, payload: tabsRes.data });
      dispatch({ type: PROFILE_ACTIONS.SET_REPORT_OPTIONS, payload: reportRes.data });
    } catch (error) {
      // Ignore static data errors or handle appropriately
      console.warn("Failed to load static profile data", error);
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await profileService.updateProfile(payload);
      
      // Merge new data with existing state
      const updatedData = { ...state.profile, ...payload, ...(data || {}) };
      await storage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedData));
      
      dispatch({ type: PROFILE_ACTIONS.SET_PROFILE, payload: updatedData });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: getApiErrorMessage(error) });
      throw error; // Re-throw if caller wants to handle it
    }
  }, [state.profile]);

  const updateProfileLocal = useCallback(async (payload) => {
    // Only update context and storage, no API call
    const updatedData = { ...state.profile, ...payload };
    await storage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedData));
    dispatch({ type: PROFILE_ACTIONS.SET_PROFILE, payload: updatedData });
  }, [state.profile]);

  const clearProfile = useCallback(async () => {
    await storage.removeItem(STORAGE_KEYS.USER_PROFILE);
    dispatch({ type: PROFILE_ACTIONS.CLEAR_PROFILE });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        ...state,
        fetchProfile,
        fetchAllUsers,
        updateProfile,
        updateProfileLocal,
        clearProfile,
        clearError,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used inside <ProfileProvider>');
  }
  return ctx;
};

export default ProfileContext;
