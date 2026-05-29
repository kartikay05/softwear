import { useState, useEffect } from "react";
import { googleLogin } from "../service/auth.api.js";

/**
 * Custom React hook to trigger Google OAuth 2.0 logins and process URL-based OAuth callback errors.
 */
export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Checks URL query parameters on load to catch and format OAuth-callback failures
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");

    if (oauthError) {
      if (oauthError === "NoUserFromGoogle") {
        setError("Failed to retrieve profile data from Google.");
      } else if (oauthError === "EmailRequired") {
        setError("Your Google account must have an associated email address.");
      } else if (oauthError === "OAuthFailed") {
        setError("Google authentication process failed.");
      } else {
        setError("Google login failed. Please try again.");
      }

      // Clean up the URL query parameter in the browser bar silently
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const triggerGoogleLogin = () => {
    setLoading(true);
    setError(null);
    try {
      googleLogin();
    } catch (err) {
      setError(err.message || "Failed to initiate Google Login");
      setLoading(false);
    }
  };

  return {
    loginWithGoogle: triggerGoogleLogin,
    loading,
    error,
    setError,
  };
}
