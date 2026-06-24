import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.get("authorization");
    const bearerToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
    const token = bearerToken || req.cookies?.accessToken;

    if (!token) {
      return next(new ApiError(401, "Access token is missing"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    } catch (error) {
      const message = error.name === "TokenExpiredError"
        ? "Access token expired"
        : "Invalid access token";
      return next(new ApiError(401, message));
    }

    const user = await userModel.findById(decoded.id);
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
