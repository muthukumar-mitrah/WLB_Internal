/**
 * User slice
 */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import userService from '../../api/services/userService';
import {getApiErrorMessage} from '../../utils/apiErrorHandler';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await userService.getProfile();
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearProfile: state => {
      state.profile = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setProfile, clearProfile} = userSlice.actions;
export default userSlice.reducer;
