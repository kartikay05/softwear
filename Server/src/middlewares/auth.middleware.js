import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

/**
 * Middleware to authenticate any logged-in user.
 * Validates JWT token from cookies or authorization header.
 */
export async function authenticatedUser(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication token is missing" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        } catch (jwtErr) {
            return res.status(401).json({ 
                success: false, 
                message: jwtErr.name === "TokenExpiredError" ? "Token expired" : "Invalid token" 
            });
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error during authentication middleware:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * Middleware to restrict access to Sellers or Admins only.
 */
export async function authenticatedSeller(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication token is missing" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        } catch (jwtErr) {
            return res.status(401).json({ 
                success: false, 
                message: jwtErr.name === "TokenExpiredError" ? "Token expired" : "Invalid token" 
            });
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        if (user.role !== "Seller" && user.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Access forbidden: Seller role required" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error during seller authentication middleware:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}