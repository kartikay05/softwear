import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

/**
 * Middleware to authenticate any logged-in user.
 * Validates access token from the Authorization header.
 */
export async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null;

        if (!token) {
            return next(new ApiError(401, "Access token is missing"));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
        } catch (jwtErr) {
            return next(new ApiError(401, jwtErr.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token"));
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
