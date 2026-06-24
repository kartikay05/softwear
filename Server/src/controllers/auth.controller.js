import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import config from "../config/config.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";
import {
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  issueAuthTokens,
} from "../utils/jwt.js";

function serializeUser(user) {
  const role = user.role?.toLowerCase() === "admin" ? "admin" : "user";

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role,
    avatar: user.avatar,
    isBlocked: user.isBlocked,
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
      clearAccessTokenCookie(res);
      clearRefreshTokenCookie(res);
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
      return next(new ApiError(403, "Your account has been blocked"));
    }

    const accessToken = await issueAuthTokens(user, res);

    return sendResponse(res, 200, "Access token refreshed successfully", {
      user: serializeUser(user),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function googleCallback(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect(`${config.CLIENT_URL}/login?error=NoUserFromGoogle`);
    }

    const { id, displayName, emails, photos } = req.user;
    const email = emails?.[0]?.value;
    const photo = photos?.[0]?.value;

    if (!email) {
      return res.redirect(`${config.CLIENT_URL}/login?error=EmailRequired`);
    }

    let user = await userModel.findOne({ email }).select("+refreshToken");

    if (user) {
      if (user.isBlocked) {
        return res.redirect(`${config.CLIENT_URL}/login?error=AccountBlocked`);
      }

      user.googleId = user.googleId || id;
      user.avatar = photo || user.avatar;
      await user.save({ validateBeforeSave: false });
    } else {
      user = await userModel.create({
        email,
        googleId: id,
        name: displayName || "Google User",
        avatar: photo || undefined,
      });
    }

    await issueAuthTokens(user, res);
    const redirectUrl = new URL(config.CLIENT_URL);
    res.redirect(redirectUrl.toString());
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res) {
  res.set("Cache-Control", "no-store");
  return sendResponse(res, 200, "User profile fetched successfully", {
    user: serializeUser(req.user),
  });
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

    clearRefreshTokenCookie(res);
    clearAccessTokenCookie(res);
    return sendResponse(res, 200, "User logged out successfully");
  } catch (error) {
    next(error);
  }
}
