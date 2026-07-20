import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService.js';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../../utils/localStorage.js';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password, role }, thunkAPI) => {
  try {
    const data = await authService.login(email, password, role);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const loadProfile = createAsyncThunk('auth/loadProfile', async (_, thunkAPI) => {
  try {
    const data = await authService.getProfile();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const initialState = {
  user: getLocalStorage('user', null),
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      setLocalStorage('user', action.payload.user);
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      removeLocalStorage('user');
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requiresOtp) {
          state.isAuthenticated = false;
          return;
        }
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        setLocalStorage('user', action.payload.user);
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        removeLocalStorage('user');
        localStorage.removeItem('accessToken');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        removeLocalStorage('user');
        localStorage.removeItem('accessToken');
      })
      // Profile
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.user = action.payload.profile || action.payload.user || action.payload.admin || action.payload.student || action.payload.faculty;
        setLocalStorage('user', state.user);
      });
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
