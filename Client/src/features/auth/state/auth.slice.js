import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile } from "../service/auth.api.js";

// Fetch initial state from localStorage if it exists
const storedUser = JSON.parse(localStorage.getItem("user")) || null;
const storedToken = localStorage.getItem("token") || null;

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

/**
 * Async Thunk for logging in a user
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiLogin(email, password);
      if (response && response.success) {
        const { user, accessToken } = response.data;
        // Persist session to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        if (accessToken) {
          localStorage.setItem("token", accessToken);
        }
        return { user, token: accessToken };
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
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiRegister(userData);
      if (response && response.success) {
        const { user, accessToken } = response.data;
        // Persist session to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        if (accessToken) {
          localStorage.setItem("token", accessToken);
        }
        return { user, token: accessToken };
      }
      return rejectWithValue(response.message || "Registration failed");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Network error";
      return rejectWithValue(msg);
    }
  }
);

/**
 * Async Thunk to verify current session cookie / token validity on app load
 */
export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      if (response && response.success) {
        const { user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      }
      // If backend returns unsuccessful profile call, clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return rejectWithValue("Session expired or invalid");
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      const msg = err.response?.data?.message || err.message || "Session verification failed";
      return rejectWithValue(msg);
    }
  }
);

/**
 * Async Thunk for logging out
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout();
      // Clear persistence layer
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return true;
    } catch (err) {
      // Clear persistence anyway to prevent client lockouts
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      const msg = err.response?.data?.message || err.message || "Failed to log out cleanly";
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous action to reset error states
    clearErrors: (state) => {
      state.error = null;
    },
    // Synchronous action to manually update state (e.g. from Google OAuth callbacks)
    setOAuthSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isAuthenticated = !!action.payload.user;
      state.loading = false;
      state.error = null;
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem("user");
      }
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      } else {
        localStorage.removeItem("token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login thunk lifecycle
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token || null;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // Register thunk lifecycle
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token || null;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // CheckAuth thunk lifecycle
      .addCase(checkAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Logout thunk lifecycle
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, setOAuthSuccess } = authSlice.actions;

export default authSlice.reducer;
