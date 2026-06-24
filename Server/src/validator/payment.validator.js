import { body, param, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, "Validation error", errors.array()));
    }

    next();
}

export const createPaymentOrderValidator = [
    body("orderId").isMongoId().withMessage("Invalid order ID"),
    body("paymentMethod")
        .optional()
        .isIn(["cod", "razorpay"])
        .withMessage("paymentMethod must be cod or razorpay"),
    body("allowCodFallback")
        .optional()
        .isBoolean()
        .withMessage("allowCodFallback must be true or false")
        .toBoolean(),
    validateRequest,
];

export const verifyPaymentValidator = [
    body("orderId").isMongoId().withMessage("Invalid order ID"),
    body("razorpayOrderId").notEmpty().withMessage("Razorpay order ID is required"),
    body("razorpayPaymentId").notEmpty().withMessage("Razorpay payment ID is required"),
    body("razorpaySignature").notEmpty().withMessage("Razorpay signature is required"),
    validateRequest,
];

export const refundValidator = [
    param("orderId").isMongoId().withMessage("Invalid order ID"),
    validateRequest,
];
