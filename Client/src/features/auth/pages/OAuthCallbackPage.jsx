import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, fetchProfileThunk } from "../state/auth.slice";
import api from "../../shared/service/api";
import toast from "react-hot-toast";

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("No code provided in the URL.");
      toast.error("OAuth flow failed: Missing code");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await api.post("/auth/google/exchange", { code });
        if (response && response.success) {
          const accessToken = response.data.accessToken;
          // Dispatch setCredentials with token first so fetchProfile can use it
          dispatch(setCredentials({ user: null, accessToken }));
          
          // Then fetch profile details
          await dispatch(fetchProfileThunk()).unwrap();
          
          toast.success("Successfully logged in with Google!");
          // Use replaceState to clean up the URL
          window.history.replaceState({}, document.title, "/profile");
          navigate("/profile", { replace: true });
        } else {
          throw new Error("Failed to exchange code for token.");
        }
      } catch (err) {
        console.error("OAuth Error:", err);
        setError("Failed to complete Google authentication.");
        toast.error("Authentication failed. Please try logging in again.");
        setTimeout(() => navigate("/login?error=OAuthFailed"), 2000);
      }
    };

    exchangeCode();
  }, [searchParams, navigate, dispatch]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-gray-600">Completing Google authentication...</p>
    </div>
  );
};

export default OAuthCallbackPage;
