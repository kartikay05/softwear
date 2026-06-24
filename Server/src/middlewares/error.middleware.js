import ApiError from "../utils/apiError.js";

export function notFound(req, res, next) {
    next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    if (process.env.NODE_ENV !== "test") {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        errors: error.errors || [],
    });
}
