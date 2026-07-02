import axios from "axios";
import { store } from "../../../app/store.js";
import { clearCredentials, refreshTokenThunk } from "../../auth/state/auth.slice.js";

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

// Request Interceptor: Attach token if available from Redux store
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
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
        // Dispatch refreshTokenThunk to get a new token
        const newAccessToken = await store.dispatch(refreshTokenThunk()).unwrap();
        
        isRefreshing = false;
        processQueue(null, newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Force user logout by clearing credentials (components handle redirect)
        store.dispatch(clearCredentials());
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
