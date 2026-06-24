import api from "../../shared/service/api.js";

/**
 * Authenticates user by their email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Response containing user and token
 */
export async function login(email, password) {
  return api.post("/auth/login", { email, password });
}

/**
 * Registers a new user account.
 * @param {Object} userData - Registration fields: { name, email, password }
 * @returns {Promise<Object>} Response containing user and token
 */
export async function register(userData) {
  return api.post("/auth/register", userData);
}

/**
 * Redirects the browser to initiate Google OAuth 2.0 flow.
 */
export function googleLogin() {
  const API_BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/auth$/, "") 
    : "http://localhost:5000/api";
  window.location.href = `${API_BASE_URL}/auth/google`;
}

/**
 * Fetches the profile of the currently logged-in user.
 * @returns {Promise<Object>} User profile object
 */
export async function getProfile() {
  return api.get("/auth/profile");
}

/**
 * Logs out the user.
 * @returns {Promise<Object>} Response message
 */
export async function logout() {
  return api.post("/auth/logout");
}
