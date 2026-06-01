/**
 * UI slice — global UI state (toast, loader, modals)
 */
import {createSlice} from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    globalLoading: false,
    toast: null, // { type: 'success'|'error'|'info'|'warning', message: '' }
  },
  reducers: {
    showGlobalLoader: state => {
      state.globalLoading = true;
    },
    hideGlobalLoader: state => {
      state.globalLoading = false;
    },
    showToast: (state, action) => {
      state.toast = action.payload; // { type, message }
    },
    hideToast: state => {
      state.toast = null;
    },
  },
});

export const {showGlobalLoader, hideGlobalLoader, showToast, hideToast} =
  uiSlice.actions;
export default uiSlice.reducer;
