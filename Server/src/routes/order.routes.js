import { Router } from "express";
import {
    cancelOrder,
    createOrder,
    getMyOrders,
    getOrderDetails,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { cancelOrderValidator, createOrderValidator, orderIdValidator } from "../validator/order.validator.js";

const orderRouter = Router();

orderRouter.use(verifyToken);

orderRouter.post("/", createOrderValidator, createOrder);
orderRouter.get("/my-orders", getMyOrders);
orderRouter.get("/:id", orderIdValidator, getOrderDetails);
orderRouter.put("/:id/cancel", cancelOrderValidator, cancelOrder);

export default orderRouter;
