import ApiError from "../utils/apiError.js";

export function notFound(req, res, next) {
    next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal server error";
    let errors = error.errors || [];

    if (error.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${error.path}`;
    } else if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Database validation failed";
        errors = Object.values(error.errors).map((item) => ({
            field: item.path,
            message: item.message,
        }));
    } else if (error.code === 11000) {
        statusCode = 409;
        message = "A resource with the same unique value already exists";
    } else if (error.name === "MulterError") {
        statusCode = 400;
        message = error.code === "LIMIT_FILE_SIZE"
            ? "Each image must be 5 MB or smaller"
            : error.message;
    }

    if (process.env.NODE_ENV !== "test" && statusCode >= 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        errors,
    });
}
