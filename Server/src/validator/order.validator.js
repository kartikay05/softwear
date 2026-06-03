import { body, param, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, "Validation error", errors.array()));
    }

    next();
}

export const createOrderValidator = [
    body("shippingAddress.street").trim().notEmpty().withMessage("Street is required"),
    body("shippingAddress.city").trim().notEmpty().withMessage("City is required"),
    body("shippingAddress.state").trim().notEmpty().withMessage("State is required"),
    body("shippingAddress.pincode").trim().notEmpty().withMessage("Pincode is required"),
    body("discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount must be a positive number"),
    validateRequest,
];

export const orderIdValidator = [
    param("id").isMongoId().withMessage("Invalid order ID"),
    validateRequest,
];
