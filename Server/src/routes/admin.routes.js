import { Router } from "express";
import {
    cancelAdminOrder,
    getAdminOrders,
    updateAdminOrderStatus,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import {
    adminCancelOrderValidator,
    updateOrderStatusValidator,
} from "../validator/admin.validator.js";

const adminRouter = Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/orders", getAdminOrders);
adminRouter.put("/orders/:id/status", updateOrderStatusValidator, updateAdminOrderStatus);
adminRouter.put("/orders/:id/cancel", adminCancelOrderValidator, cancelAdminOrder);

export default adminRouter;
