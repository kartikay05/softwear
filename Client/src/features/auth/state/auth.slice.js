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
      const data = await apiLogin(email, password);
      if (data && data.success) {
        // Persist session to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        return data; // returns { success, message, user, token }
      }
      return rejectWithValue(data.message || "Failed to log in");
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
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
      const data = await apiRegister(userData);
      if (data && data.success) {
        // Persist session to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        return data; // returns { success, message, user, token }
      }
      return rejectWithValue(data.message || "Registration failed");
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
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
      const data = await getProfile();
      if (data && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        return data.user;
      }
      // If backend returns unsuccessful profile call, clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return rejectWithValue("Session expired or invalid");
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return rejectWithValue(err.message || "Session verification failed");
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
      return rejectWithValue(err.message || "Failed to log out cleanly");
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
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
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
      .addCase(checkAuthThunk.rejected, (state, action) => {
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
