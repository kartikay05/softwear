import {body, param, validationResult} from 'express-validator';

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }
    next();
}

export const addToCartValidator = [
    body("productId").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Invalid Product ID"),
    body("variantId").optional().isMongoId().withMessage("Invalid Variant ID"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1"),
    validateRequest
]

export const removeFromCartValidator = [
    body("productId").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Invalid Product ID"),
    body("variantId").optional().isMongoId().withMessage("Invalid Variant ID"),
    validateRequest
]

export const incrementCartItemValidator = [
    body("productId").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Invalid Product ID"),
    body("variantId").optional().isMongoId().withMessage("Invalid Variant ID"),
    validateRequest
]

export const decrementCartItemValidator = [
    body("productId").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Invalid Product ID"),
    body("variantId").optional().isMongoId().withMessage("Invalid Variant ID"),
    validateRequest
]