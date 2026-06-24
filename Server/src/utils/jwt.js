import jwt from "jsonwebtoken";
import config from "../config/config.js";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions(maxAge) {
  const isProduction = config.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge,
  };
}

export function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRY }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY }
  );
}

export function setAccessTokenCookie(res, token) {
  res.cookie("accessToken", token, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
}

export function setRefreshTokenCookie(res, token) {
  res.cookie("refreshToken", token, getCookieOptions(REFRESH_TOKEN_MAX_AGE));
}

export function clearAccessTokenCookie(res) {
  const { maxAge, ...options } = getCookieOptions(0);
  res.clearCookie("accessToken", options);
}

export function clearRefreshTokenCookie(res) {
  const { maxAge, ...options } = getCookieOptions(0);
  res.clearCookie("refreshToken", options);
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
