import { useSelector, useDispatch } from "react-redux";
import { logoutThunk, checkAuthThunk } from "../state/auth.slice.js";

/**
 * Custom React hook to retrieve Redux global authentication state and actions.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const logout = () => {
    return dispatch(logoutThunk()).unwrap();
  };

  const refreshProfile = () => {
    return dispatch(checkAuthThunk()).unwrap();
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout,
    refreshProfile,
  };
}
