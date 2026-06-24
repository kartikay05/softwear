import { body, param, query, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, "Validation error", errors.array()));
    }

    next();
}

const priceValidator = (field, required = false) => {
    let validator = body(field);
    validator = required
        ? validator.notEmpty().withMessage(`${field} is required`)
        : validator.optional({ nullable: true, checkFalsy: true });

    return validator.isFloat({ min: 0 }).withMessage(`${field} must be a non-negative number`);
};

export const listProductsValidator = [
    query("search").optional().trim().isLength({ max: 100 }).withMessage("Search cannot exceed 100 characters"),
    query("category").optional().trim().isLength({ max: 80 }).withMessage("Category is too long"),
    query("brand").optional().trim().isLength({ max: 80 }).withMessage("Brand is too long"),
    query("isFeatured").optional().isBoolean().withMessage("isFeatured must be true or false").toBoolean(),
    query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice must be a non-negative number").toFloat(),
    query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice must be a non-negative number").toFloat(),
    query("maxPrice").custom((value, { req }) => {
        if (value !== undefined && req.query.minPrice !== undefined && value < req.query.minPrice) {
            throw new Error("maxPrice must be greater than or equal to minPrice");
        }
        return true;
    }),
    query("page").optional().isInt({ min: 1 }).withMessage("page must be at least 1").toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100").toInt(),
    query("sort")
        .optional()
        .isIn(["price", "-price", "createdAt", "-createdAt", "sold", "-sold", "ratings.average", "-ratings.average"])
        .withMessage("Invalid sort value"),
    validateRequest,
];

export const createProductValidator = [
    body("name").trim().notEmpty().withMessage("Product name is required").isLength({ max: 150 }).withMessage("Product name is too long"),
    body("description").trim().notEmpty().withMessage("Description is required").isLength({ max: 5000 }).withMessage("Description is too long"),
    priceValidator("price", true),
    priceValidator("discountPrice"),
    body("discountPrice").custom((value, { req }) => {
        if (value !== undefined && value !== "" && Number(value) > Number(req.body.price)) {
            throw new Error("discountPrice cannot exceed price");
        }
        return true;
    }),
    body("category").trim().notEmpty().withMessage("Category is required").isLength({ max: 80 }).withMessage("Category is too long"),
    body("brand").trim().notEmpty().withMessage("Brand is required").isLength({ max: 80 }).withMessage("Brand is too long"),
    body("stock").notEmpty().withMessage("Stock is required").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("isFeatured").optional().isBoolean().withMessage("isFeatured must be true or false").toBoolean(),
    validateRequest,
];

export const updateProductValidator = [
    param("id").isMongoId().withMessage("Invalid product ID"),
    body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty").isLength({ max: 150 }).withMessage("Product name is too long"),
    body("description").optional().trim().notEmpty().withMessage("Description cannot be empty").isLength({ max: 5000 }).withMessage("Description is too long"),
    body("price").optional().isFloat({ min: 0 }).withMessage("price must be a non-negative number"),
    body("discountPrice").optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage("discountPrice must be a non-negative number"),
    body("category").optional().trim().notEmpty().withMessage("Category cannot be empty").isLength({ max: 80 }).withMessage("Category is too long"),
    body("brand").optional().trim().notEmpty().withMessage("Brand cannot be empty").isLength({ max: 80 }).withMessage("Brand is too long"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("isFeatured").optional().isBoolean().withMessage("isFeatured must be true or false").toBoolean(),
    validateRequest,
];

export const productIdValidator = [
    param("id").isMongoId().withMessage("Invalid product ID"),
    validateRequest,
];
