import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile } from "../service/auth.api.js";
import api from "../../shared/service/api.js";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true, // true by default because we check auth on mount
  error: null,
};

/**
 * Async Thunk for logging in a user
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials.email, credentials.password);
      if (response && response.success) {
        const { user, accessToken } = response.data;
        dispatch(setCredentials({ user, accessToken }));
        return { user, accessToken };
      }
      return rejectWithValue(response.message || "Failed to log in");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Network error";
      return rejectWithValue(msg);
    }
  }
);

/**
 * Async Thunk for registering a new user
 */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRegister(userData);
      if (response && response.success) {
        const { user, accessToken } = response.data;
        dispatch(setCredentials({ user, accessToken }));
        return { user, accessToken };
      }
      return rejectWithValue(response.message || "Registration failed");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Network error";
      return rejectWithValue(msg);
    }
  }
);

/**
 * Async Thunk to fetch user profile
 */
export const fetchProfileThunk = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await getProfile();
      if (response && response.success) {
        const { user } = response.data;
        const currentToken = getState().auth.accessToken;
        dispatch(setCredentials({ user, accessToken: currentToken }));
        return user;
      }
      dispatch(clearCredentials());
      return rejectWithValue("Failed to fetch profile");
    } catch (err) {
      dispatch(clearCredentials());
      const msg = err.response?.data?.message || err.message || "Session verification failed";
      return rejectWithValue(msg);
    }
  }
);

/**
 * Async Thunk for refresh token
 */
export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh-token");

      if (response?.success && response.data?.accessToken) {
        const token = response.data.accessToken;
        dispatch(setAccessToken(token));
        return token;
      }
      dispatch(clearCredentials());
      return rejectWithValue("Refresh failed");
    } catch {
      dispatch(clearCredentials());
      return rejectWithValue("Refresh failed");
    }
  }
);

/**
 * Async Thunk for logging out
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await apiLogout();
      dispatch(clearCredentials());
      return true;
    } catch (err) {
      dispatch(clearCredentials());
      const msg = err.response?.data?.message || err.message || "Failed to log out cleanly";
      return rejectWithValue(msg);
    }
  }
);

export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(refreshTokenThunk()).unwrap();
      await dispatch(fetchProfileThunk()).unwrap();
      return true;
    } catch {
      return rejectWithValue("Auth check failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Backwards compatibility for existing components, points to clearErrors
    clearErrors: (state) => {
      state.error = null;
    },
    setOAuthSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken || action.payload.token || null;
      state.isAuthenticated = !!action.payload.user;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCredentials, setAccessToken, clearCredentials, setAuthLoading, setAuthError, clearErrors, setOAuthSuccess } = authSlice.actions;

export default authSlice.reducer;
