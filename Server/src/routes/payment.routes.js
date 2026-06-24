import { Router } from "express";
import {
    createPaymentOrder,
    paymentWebhook,
    refundPayment,
    verifyPayment,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import {
    createPaymentOrderValidator,
    refundValidator,
    verifyPaymentValidator,
} from "../validator/payment.validator.js";

const paymentRouter = Router();

paymentRouter.post("/create-order", verifyToken, createPaymentOrderValidator, createPaymentOrder);
paymentRouter.post("/verify", verifyToken, verifyPaymentValidator, verifyPayment);
paymentRouter.post("/webhook", paymentWebhook);
paymentRouter.post("/refund/:orderId", verifyToken, isAdmin, refundValidator, refundPayment);

export default paymentRouter;
