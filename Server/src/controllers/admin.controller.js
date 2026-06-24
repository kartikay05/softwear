import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";
import { sendOrderCancellationEmail, sendOrderConfirmationEmail } from "../services/email.service.js";

async function restoreProductStock(items) {
    await Promise.all(
        items.map((item) =>
            productModel.findByIdAndUpdate(item.productId, {
                $inc: {
                    stock: item.quantity,
                    sold: -item.quantity,
                },
            })
        )
    );
}

export async function getAdminOrders(req, res, next) {
    try {
        const filter = {};
        if (req.query.status) {
            filter.orderStatus = req.query.status;
        }

        const orders = await orderModel
            .find(filter)
            .populate("userId", "name email")
            .sort("-createdAt");

        return sendResponse(res, 200, "Admin orders fetched successfully", { orders });
    } catch (error) {
        next(error);
    }
}

export async function updateAdminOrderStatus(req, res, next) {
    try {
        const order = await orderModel.findById(req.params.id).populate("userId", "name email");

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        const previousStatus = order.orderStatus;
        const nextStatus = req.body.orderStatus;

        if (previousStatus === "cancelled") {
            return next(new ApiError(400, "Cancelled orders cannot be updated"));
        }

        if (nextStatus === "cancelled") {
            order.orderStatus = "cancelled";
            order.cancellation = {
                reason: req.body.reason || "Cancelled by admin",
                cancelledBy: "admin",
                cancelledAt: new Date(),
            };
            await order.save();
            await restoreProductStock(order.items);
            await sendOrderCancellationEmail(order.userId, order);

            return sendResponse(res, 200, "Order cancelled successfully", { order });
        }

        order.orderStatus = nextStatus;
        await order.save();

        if (nextStatus === "processing" && previousStatus === "pending") {
            await sendOrderConfirmationEmail(order.userId, order);
        }

        return sendResponse(res, 200, "Order status updated successfully", { order });
    } catch (error) {
        next(error);
    }
}

export async function cancelAdminOrder(req, res, next) {
    req.body.orderStatus = "cancelled";
    return updateAdminOrderStatus(req, res, next);
}
