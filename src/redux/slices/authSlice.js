/**
 * Auth slice
 */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../api/services/authService';
import {storage} from '../../utils/storage';
import {STORAGE_KEYS} from '../../constants';
import {getApiErrorMessage} from '../../utils/apiErrorHandler';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (payload, {rejectWithValue}) => {
    try {
      const {data} = await authService.signUp(payload);
      if (data.token) {
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      }
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async (payload, {rejectWithValue}) => {
    try {
      const {data} = await authService.login(payload);
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      if (data.refresh_token) {
        await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
      }
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch {}
  await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // signUp
    builder
      .addCase(signUpWithEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // login
    builder
      .addCase(loginWithEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // logout
    builder.addCase(logout.fulfilled, state => {
      state.isAuthenticated = false;
      state.token = null;
    });
  },
});

export const {setToken, clearError} = authSlice.actions;
export default authSlice.reducer;
