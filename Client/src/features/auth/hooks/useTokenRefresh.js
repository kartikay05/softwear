import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthThunk, logoutThunk } from '../state/auth.slice.js';

/**
 * useTokenRefresh — Silently re-validates the user session by calling the
 * backend's /api/auth/profile endpoint on a configurable interval.
 *
 * This works with HTTP-only cookies (no token in localStorage is required).
 * The server will reject the cookie if the JWT has expired, which triggers
 * an automatic logout on the client.
 *
 * @param {number} intervalMs - How often to refresh (default: 5 minutes)
 */
export function useTokenRefresh(intervalMs = 5 * 60 * 1000) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refresh = async () => {
      try {
        await dispatch(checkAuthThunk()).unwrap();
      } catch (err) {
        // Token has expired or is invalid — force a clean logout
        console.warn('[useTokenRefresh] Session expired, logging out.');
        dispatch(logoutThunk());
      }
    };

    // Run immediately on mount, then on each interval
    refresh();
    intervalRef.current = setInterval(refresh, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [isAuthenticated, dispatch, intervalMs]);
}
