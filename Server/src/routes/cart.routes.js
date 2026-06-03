import { Router } from "express";
import {
    addToCart,
    clearCart,
    getCart,
    removeCartItem,
    updateCartItem,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    addToCartValidator,
    removeCartItemValidator,
    updateCartItemValidator,
} from "../validator/cart.validator.js";

const cartRouter = Router();

cartRouter.use(verifyToken);

cartRouter.get("/", getCart);
cartRouter.post("/add", addToCartValidator, addToCart);
cartRouter.put("/update", updateCartItemValidator, updateCartItem);
cartRouter.delete("/remove/:itemId", removeCartItemValidator, removeCartItem);
cartRouter.delete("/clear", clearCart);

export default cartRouter;
