import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logout as apiLogout } from "../service/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      if (data && data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    isAuthenticated: !!user,
    error,
    setError,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
