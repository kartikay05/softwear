import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const bearerMatch = authHeader?.match(/^Bearer\s+(.+)$/i);
    const token = bearerMatch?.[1] || req.cookies?.accessToken;

    if (!token) {
      return next(new ApiError(401, "Access token is missing"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    } catch (jwtErr) {
      return next(
        new ApiError(
          401,
          jwtErr.name === "TokenExpiredError"
            ? "Access token expired"
            : "Invalid access token"
        )
      );
    }

    // ✅ Only hit DB if you need live isBlocked check — skip if low-risk routes
    const user = await userModel.findById(decoded.id).select("-refreshToken");
    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    if (user.isBlocked) {
      return next(new ApiError(403, "Your account has been blocked"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export const authenticatedUser = verifyToken;
