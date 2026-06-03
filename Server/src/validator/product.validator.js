import { body, param, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, "Validation error", errors.array()));
    }

    next();
}

export const createProductValidator = [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("discountPrice")
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage("Discount price must be a positive number"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("brand").trim().notEmpty().withMessage("Brand is required"),
    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a positive integer"),
    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be true or false")
        .toBoolean(),
    validateRequest,
];

export const updateProductValidator = [
    param("id").isMongoId().withMessage("Invalid product ID"),
    body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
    body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("discountPrice")
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage("Discount price must be a positive number"),
    body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
    body("brand").optional().trim().notEmpty().withMessage("Brand cannot be empty"),
    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a positive integer"),
    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be true or false")
        .toBoolean(),
    validateRequest,
];

export const productIdValidator = [
    param("id").isMongoId().withMessage("Invalid product ID"),
    validateRequest,
];
