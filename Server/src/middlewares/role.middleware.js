import ApiError from "../utils/apiError.js";

export function isAdmin(req, res, next) {
    if (!req.user || req.user.role?.toLowerCase() !== "admin") {
        return next(new ApiError(403, "Admin access required"));
    }

    next();
}
