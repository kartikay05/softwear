import { body, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function validateResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation error", errors.array()));
  }
  next();
}

export const registerValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("fullName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  body()
    .custom((value) => {
      if (value.name || value.fullName) return true;
      throw new Error("Name is required");
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validateResult,
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validateResult,
];
