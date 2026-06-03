import { body, param, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, "Validation error", errors.array()));
    }

    next();
}

export const addToCartValidator = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID"),
    body("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
    validateRequest,
];

export const updateCartItemValidator = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID"),
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
    validateRequest,
];

export const removeCartItemValidator = [
    param("itemId")
        .isMongoId()
        .withMessage("Invalid cart item ID"),
    validateRequest,
];
