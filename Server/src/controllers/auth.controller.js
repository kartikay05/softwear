import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/user.model.js";
import config from "../config/config.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";
import {
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  issueAuthTokens,
  generateAccessToken,
  setAccessTokenCookie,
} from "../utils/jwt.js";

// In-memory store for OAuth codes (Use Redis in production horizontally scaled environments)
const oauthCodesStore = new Map();

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role?.toLowerCase() === "admin" ? "admin" : "user",
    avatar: user.avatar,
    isBlocked: user.isBlocked,
    isVerified: user.isVerified,
  };
}

export async function register(req, res, next) {
  try {
    const { name, fullName, email, password } = req.body;
    const displayName = name || fullName;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new ApiError(409, "User with this email already exists"));
    }

    const user = await userModel.create({
      name: displayName,
      email,
      password, 
    });

    const accessToken = await issueAuthTokens(user, res);

    return sendResponse(res, 201, "User registered successfully", {
      user: serializeUser(user),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password +refreshToken");
    if (!user) {
      return next(new ApiError(400, "Invalid email or password"));
    }

    if (user.isBlocked) {
      return next(new ApiError(403, "Your account has been blocked"));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ApiError(400, "Invalid email or password"));
    }

    const accessToken = await issueAuthTokens(user, res);

    return sendResponse(res, 200, "User logged in successfully", {
      user: serializeUser(user),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return next(new ApiError(401, "Refresh token is missing"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);
    } catch (error) {
      clearAccessTokenCookie(res);
      clearRefreshTokenCookie(res);
      return next(new ApiError(401, "Invalid or expired refresh token"));
    }

    const user = await userModel.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      clearAccessTokenCookie(res);
      clearRefreshTokenCookie(res);
      return next(new ApiError(401, "Refresh token is invalid"));
    }

    if (user.isBlocked) {
      clearAccessTokenCookie(res);
      clearRefreshTokenCookie(res);
      return next(new ApiError(403, "Your account has been blocked"));
    }

    const accessToken = generateAccessToken(user);
    setAccessTokenCookie(res, accessToken);

    return sendResponse(res, 200, "Access token refreshed successfully", {
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function googleCallback(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect(`${config.CLIENT_URL}/login?error=AuthFailed`);
    }

    const accessToken = await issueAuthTokens(req.user, res);
    
    // Generate one-time code
    const code = crypto.randomBytes(32).toString('hex');
    oauthCodesStore.set(code, {
      accessToken,
      expiresAt: Date.now() + 60 * 1000 // 60 seconds expiry
    });

    // Cleanup expired codes periodically
    for (const [key, val] of oauthCodesStore.entries()) {
      if (val.expiresAt < Date.now()) oauthCodesStore.delete(key);
    }

    res.redirect(`${config.CLIENT_URL}/auth/callback?code=${code}`);
  } catch (error) {
    next(error);
  }
}

export async function exchangeOAuthCode(req, res, next) {
  try {
    const { code } = req.body;
    if (!code) {
      return next(new ApiError(400, "Code is required"));
    }

    const storeEntry = oauthCodesStore.get(code);
    if (!storeEntry || storeEntry.expiresAt < Date.now()) {
      if (storeEntry) oauthCodesStore.delete(code);
      return next(new ApiError(401, "Invalid or expired code"));
    }

    // Single use
    oauthCodesStore.delete(code);

    return sendResponse(res, 200, "OAuth token exchanged successfully", {
      accessToken: storeEntry.accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    // req.user.id from middleware
    const user = await userModel.findById(req.user.id).select("-password -refreshToken");
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    res.set("Cache-Control", "no-store");

    return sendResponse(res, 200, "User profile fetched successfully", {
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await userModel.findOneAndUpdate(
        { refreshToken: token },
        { $unset: { refreshToken: 1 } }
      );
    }

    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);
    return sendResponse(res, 200, "User logged out successfully");
  } catch (error) {
    next(error);
  }
}
