import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../state/auth.slice.js";

/**
 * Custom React hook for login authentication using Redux Toolkit thunks.
 */
export function useLogin() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const loginUser = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    return dispatch(loginThunk({ email, password })).unwrap();
  };

  return {
    login: loginUser,
    loading,
    error,
  };
}
