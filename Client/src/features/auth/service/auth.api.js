const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

/**
 * Common request wrapper to call the backend endpoints.
 * Handles credentials, headers, body serialization, and custom errors.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // credentials: "include" sends and receives HTTP-only cookies (JWT token)
  options.credentials = "include";

  if (options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  const response = await fetch(url, options);
  
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    // Extract error messages, handle express-validator array format or custom backend errors
    const errorMessage = data?.message ||
                         (data?.errors ? data.errors.map(err => err.msg).join(", ") : null) ||
                         `Request failed with status ${response.status}`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Authenticates user by their email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Object containing message and user details
 */
export async function login(email, password) {
  return request("/login", {
    method: "POST",
    body: { email, password },
  });
}

/**
 * Registers a new user account (Buyer or Seller).
 * @param {Object} userData - Registration fields: { fullName, email, password, contact, isSeller }
 * @returns {Promise<Object>} Object containing message and user details
 */
export async function register(userData) {
  return request("/register", {
    method: "POST",
    body: userData,
  });
}

/**
 * Redirects the browser to initiate Google OAuth 2.0 flow.
 */
export function googleLogin() {
  window.location.href = `${API_BASE_URL}/google`;
}

/**
 * Fetches the profile of the currently logged-in user.
 * @returns {Promise<Object>} User profile object
 */
export async function getProfile() {
  return request("/profile", {
    method: "GET",
  });
}

/**
 * Logs out the user by clearing backend JWT cookies.
 * @returns {Promise<Object>} Response message
 */
export async function logout() {
  return request("/logout", {
    method: "GET",
  });
}
