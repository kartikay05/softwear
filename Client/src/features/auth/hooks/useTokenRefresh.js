import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthThunk, logoutThunk } from '../state/auth.slice.js';

/**
 * useTokenRefresh — Silently re-validates the user session on a fixed interval.
 *
 * Works with HTTP-only cookies. Does NOT fire immediately on mount because
 * App.jsx already runs checkAuthThunk() on startup. Firing immediately would
 * race with a freshly-set cookie and cause a spurious logout on production.
 *
 * @param {number} intervalMs - How often to refresh (default: 14 minutes,
 *                              slightly under the 15m access-token expiry)
 */
export function useTokenRefresh(intervalMs = 14 * 60 * 1000) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any previous interval whenever authentication state changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isAuthenticated) return;

    // Only run on the interval — never immediately on mount.
    // App.jsx's useEffect already calls checkAuthThunk() on startup.
    intervalRef.current = setInterval(async () => {
      try {
        await dispatch(checkAuthThunk()).unwrap();
      } catch {
        console.warn('[useTokenRefresh] Session expired, logging out.');
        dispatch(logoutThunk());
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isAuthenticated, dispatch, intervalMs]);
}
