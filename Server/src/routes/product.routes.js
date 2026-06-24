import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductDetails,
    updateProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import { uploadProductImages } from "../middlewares/upload.middleware.js";
import {
    createProductValidator,
    productIdValidator,
    updateProductValidator,
} from "../validator/product.validator.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", productIdValidator, getProductDetails);
productRouter.post("/", verifyToken, isAdmin, uploadProductImages, createProductValidator, createProduct);
productRouter.put("/:id", verifyToken, isAdmin, uploadProductImages, updateProductValidator, updateProduct);
productRouter.delete("/:id", verifyToken, isAdmin, productIdValidator, deleteProduct);

export default productRouter;
