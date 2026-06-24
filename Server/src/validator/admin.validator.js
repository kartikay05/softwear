import { body, param, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, "Validation error", errors.array()));
    }

    next();
}

export const adminOrderIdValidator = [
    param("id").isMongoId().withMessage("Invalid order ID"),
    validateRequest,
];

export const updateOrderStatusValidator = [
    param("id").isMongoId().withMessage("Invalid order ID"),
    body("orderStatus")
        .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
        .withMessage("Invalid order status"),
    body("reason")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Reason cannot exceed 500 characters"),
    validateRequest,
];

export const adminCancelOrderValidator = [
    param("id").isMongoId().withMessage("Invalid order ID"),
    body("reason")
        .trim()
        .notEmpty()
        .withMessage("Cancellation reason is required")
        .isLength({ max: 500 })
        .withMessage("Cancellation reason cannot exceed 500 characters"),
    validateRequest,
];
