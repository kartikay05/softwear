import axios from "axios";
import { store } from "../../../app/store.js";
import { setOAuthSuccess, logoutThunk } from "../../auth/state/auth.slice.js";

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/auth$/, "") 
  : "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle automatic token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/refresh-token")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint (sends and reads the httpOnly cookie)
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const responseData = response.data;
        if (responseData && responseData.success) {
          const { user, accessToken } = responseData.data;

          // Update store
          store.dispatch(setOAuthSuccess({ user, token: accessToken }));

          isRefreshing = false;
          processQueue(null, accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Force user logout and redirect
        store.dispatch(logoutThunk());
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
