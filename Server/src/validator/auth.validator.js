import { body, validationResult } from "express-validator";

function validateResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const registerValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid contact number")
    .isNumeric()
    .withMessage("Contact must contain only numbers"),

  body("isSeller")
    .optional()
    .custom((value) => {
      if (
        value === true ||
        value === false ||
        value === "true" ||
        value === "false"
      ) {
        return true;
      }
      throw new Error("isSeller must be a boolean");
    })
    .toBoolean(),

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
