import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Shared getRefreshCookieOptions helper
export function getRefreshCookieOptions() {
  const isProd = config.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };
}

export async function issueAuthTokens(user, res) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  
  setRefreshTokenCookie(res, refreshToken);

  // Return only accessToken, do not set in cookie
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

export function setRefreshTokenCookie(res, token) {
  const options = getRefreshCookieOptions();
  res.cookie("refreshToken", token, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearRefreshTokenCookie(res) {
  const options = getRefreshCookieOptions();
  res.clearCookie("refreshToken", options);
}