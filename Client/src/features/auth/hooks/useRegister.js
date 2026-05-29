import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../state/auth.slice.js";

/**
 * Custom React hook for registering new Buyer or Seller accounts via Redux.
 */
export function useRegister() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const registerUser = async (userData) => {
    const { fullName, email, password, contact } = userData;

    // Client-side pre-flight validations
    if (!fullName || fullName.trim().length < 3) {
      throw new Error("Full name must be at least 3 characters long");
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Please enter a valid email address");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    if (!contact || !/^\d{10}$/.test(contact)) {
      throw new Error("Contact number must be exactly 10 digits");
    }

    return dispatch(registerThunk(userData)).unwrap();
  };

  return {
    register: registerUser,
    loading,
    error,
  };
}
