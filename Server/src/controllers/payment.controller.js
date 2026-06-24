import orderModel from "../models/order.model.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";
import {
    createRazorpayOrder,
    isRazorpayConfigured,
    verifyRazorpaySignature,
} from "../services/payment.service.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";

function canUserAccessOrder(order, user) {
    return order.userId.toString() === user._id.toString();
}

async function populateOrderUser(order) {
    return order.populate("userId", "name email");
}

async function confirmCodOrder(order) {
    order.paymentInfo.method = "cod";
    order.paymentInfo.status = "pending";
    order.orderStatus = "processing";
    await order.save();

    const populatedOrder = await populateOrderUser(order);
    await sendOrderConfirmationEmail(populatedOrder.userId, populatedOrder);

    return populatedOrder;
}

export async function createPaymentOrder(req, res, next) {
    try {
        const { orderId, paymentMethod = "cod" } = req.body;
        const allowCodFallback = req.body.allowCodFallback !== false;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        if (!canUserAccessOrder(order, req.user)) {
            return next(new ApiError(403, "You cannot pay for this order"));
        }

        if (order.orderStatus === "cancelled") {
            return next(new ApiError(400, "Cancelled orders cannot be paid"));
        }

        if (paymentMethod === "cod") {
            const confirmedOrder = await confirmCodOrder(order);
            return sendResponse(res, 200, "Cash on delivery order confirmed", {
                order: confirmedOrder,
                paymentMethod: "cod",
            });
        }

        if (!isRazorpayConfigured()) {
            if (!allowCodFallback) {
                return next(new ApiError(503, "Razorpay is not configured"));
            }

            const confirmedOrder = await confirmCodOrder(order);
            return sendResponse(res, 200, "Razorpay unavailable, order confirmed with cash on delivery", {
                order: confirmedOrder,
                paymentMethod: "cod",
                fallback: true,
            });
        }

        try {
            const razorpayOrder = await createRazorpayOrder({
                amount: order.totalAmount,
                currency: "INR",
                receipt: `order_${order._id}`,
                notes: {
                    orderId: order._id.toString(),
                    userId: req.user._id.toString(),
                },
            });

            order.paymentInfo.method = "razorpay";
            order.paymentInfo.razorpayOrderId = razorpayOrder.id;
            order.paymentInfo.status = "pending";
            await order.save();

            return sendResponse(res, 200, "Razorpay order created successfully", {
                order,
                razorpayOrder,
                keyId: process.env.RAZORPAY_KEY_ID,
                paymentMethod: "razorpay",
            });
        } catch (error) {
            if (!allowCodFallback) {
                return next(error);
            }

            const confirmedOrder = await confirmCodOrder(order);
            return sendResponse(res, 200, "Razorpay failed, order confirmed with cash on delivery", {
                order: confirmedOrder,
                paymentMethod: "cod",
                fallback: true,
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function verifyPayment(req, res, next) {
    try {
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        if (!canUserAccessOrder(order, req.user)) {
            return next(new ApiError(403, "You cannot verify this order payment"));
        }

        if (order.paymentInfo.razorpayOrderId !== razorpayOrderId) {
            return next(new ApiError(400, "Razorpay order ID does not match this order"));
        }

        const isValid = verifyRazorpaySignature({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });

        if (!isValid) {
            order.paymentInfo.status = "failed";
            await order.save();
            return next(new ApiError(400, "Invalid Razorpay payment signature"));
        }

        order.paymentInfo.method = "razorpay";
        order.paymentInfo.status = "paid";
        order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
        order.orderStatus = "processing";
        await order.save();

        const populatedOrder = await populateOrderUser(order);
        await sendOrderConfirmationEmail(populatedOrder.userId, populatedOrder);

        return sendResponse(res, 200, "Payment verified successfully", {
            order: populatedOrder,
        });
    } catch (error) {
        next(error);
    }
}

export async function paymentWebhook(req, res) {
    return res.status(200).json({
        success: true,
        message: "Webhook endpoint registered. Raw signature handling will be hardened before production.",
    });
}

export async function refundPayment(req, res, next) {
    try {
        const order = await orderModel.findById(req.params.orderId);

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        order.paymentInfo.status = "refunded";
        await order.save();

        return sendResponse(res, 200, "Refund marked successfully", { order });
    } catch (error) {
        next(error);
    }
}
