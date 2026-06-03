import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
}

export function generateRefreshToken(user) {
    return jwt.sign(
        { id: user._id },
        config.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
}

export function setRefreshTokenCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export function clearRefreshTokenCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    });
}
