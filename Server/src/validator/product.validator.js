import { body, validationResult } from 'express-validator'

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }

    next();
}

export const createProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").notEmpty().withMessage("Price amount is required").isNumeric().withMessage("Price amount must be a number"),
    body("priceCurrency").notEmpty().withMessage("Currency is required"),
    body("images").notEmpty().withMessage("Images are required"),
    body("variant").notEmpty().withMessage("Variant is required"),
    validateRequest
]

export const updateProductValidator = [
    body("title").optional().withMessage("Title is required"),
    body("description").optional().withMessage("Description is required"),
    body("price").optional().withMessage("Price is required"),
    body("images").optional().withMessage("Images are required"),
    body("variant").optional().withMessage("Variant is required"),
    validateRequest
]

export const deleteProductValidator = [
    body("id").notEmpty().withMessage("Product ID is required"),
    validateRequest
]