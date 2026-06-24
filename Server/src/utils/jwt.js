import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function issueAuthTokens(user, res) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  // Set both refresh and access token cookies
  setRefreshTokenCookie(res, refreshToken);
  // Also set a separate access token cookie (short‑lived)
  setAccessTokenCookie(res, accessToken);

  return accessToken;
}

export function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRY || "15m" }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY || "7d" }
  );
}

export function setAccessTokenCookie(res, token) {
  // Set HTTP‑only cookie for access token (short‑lived)
  // Use SameSite='none' with Secure in production for cross‑origin requests; fallback to 'lax' in dev
  const isProd = config.NODE_ENV === 'production';
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes default or config JWT_ACCESS_EXPIRY if defined
  });
}
export function setRefreshTokenCookie(res, token) {
  // Clear first to avoid stacking
  const isProd = config.NODE_ENV === 'production';
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd });
  // Use SameSite='none' with Secure in production for cross‑origin requests; fallback to 'lax' in dev
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: config.NODE_ENV === "production",
  });
}