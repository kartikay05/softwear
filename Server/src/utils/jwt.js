import jwt from "jsonwebtoken";
import config from "../config/config.js";

function getCookieOptions() {
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
  
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

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
  res.cookie("accessToken", token, {
    ...getCookieOptions(),
    maxAge: 15 * 60 * 1000,
  });
}

export function setRefreshTokenCookie(res, token) {
  res.cookie("refreshToken", token, {
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAccessTokenCookie(res) {
  res.clearCookie("accessToken", getCookieOptions());
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie("refreshToken", getCookieOptions());
}
