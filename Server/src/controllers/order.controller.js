import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import sendResponse from "../utils/sendResponse.js";
import { sendOrderCancellationEmail } from "../services/email.service.js";

function getProductImage(product) {
    return product.images?.[0]?.url || "";
}

async function buildOrderItemsFromCart(cart) {
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
        const product = await productModel.findById(cartItem.productId);

        if (!product) {
            throw new ApiError(404, "One or more cart products no longer exist");
        }

        if (cartItem.quantity > product.stock) {
            throw new ApiError(400, `Only ${product.stock} units available for ${product.name}`);
        }

        const price = product.discountPrice ?? product.price;
        subtotal += price * cartItem.quantity;

        orderItems.push({
            productId: product._id,
            name: product.name,
            price,
            quantity: cartItem.quantity,
            image: getProductImage(product),
        });
    }

    return { orderItems, subtotal };
}

async function decrementProductStock(items) {
    await Promise.all(
        items.map((item) =>
            productModel.findByIdAndUpdate(item.productId, {
                $inc: {
                    stock: -item.quantity,
                    sold: item.quantity,
                },
            })
        )
    );
}

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

export async function createOrder(req, res, next) {
    try {
        const cart = await cartModel.findOne({ userId: req.user._id });

        if (!cart || cart.items.length === 0) {
            return next(new ApiError(400, "Cart is empty"));
        }

        const { orderItems, subtotal } = await buildOrderItemsFromCart(cart);
        const discount = Number(req.body.discount) || 0;

        if (discount > subtotal) {
            return next(new ApiError(400, "Discount cannot be greater than order subtotal"));
        }

        const order = await orderModel.create({
            userId: req.user._id,
            items: orderItems,
            shippingAddress: req.body.shippingAddress,
            discount,
            totalAmount: subtotal - discount,
        });

        await decrementProductStock(orderItems);

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        return sendResponse(res, 201, "Order created successfully", { order });
    } catch (error) {
        next(error);
    }
}

export async function getMyOrders(req, res, next) {
    try {
        const features = new ApiFeatures(
            orderModel.find({ userId: req.user._id }),
            req.query
        )
            .sort("-createdAt")
            .paginate(10);

        const orders = await features.query;
        const totalOrders = await orderModel.countDocuments({ userId: req.user._id });

        return sendResponse(res, 200, "Orders fetched successfully", {
            orders,
            pagination: {
                ...features.pagination,
                totalOrders,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getOrderDetails(req, res, next) {
    try {
        const order = await orderModel.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        return sendResponse(res, 200, "Order fetched successfully", { order });
    } catch (error) {
        next(error);
    }
}

export async function cancelOrder(req, res, next) {
    try {
        const order = await orderModel.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        if (!["pending", "processing"].includes(order.orderStatus)) {
            return next(new ApiError(400, "Only pending or processing orders can be cancelled"));
        }

        order.orderStatus = "cancelled";
        order.cancellation = {
            reason: req.body.reason || "Cancelled by user",
            cancelledBy: "user",
            cancelledAt: new Date(),
        };
        await order.save();

        await restoreProductStock(order.items);

        const populatedOrder = await order.populate("userId", "name email");
        await sendOrderCancellationEmail(populatedOrder.userId, populatedOrder);

        return sendResponse(res, 200, "Order cancelled successfully", { order });
    } catch (error) {
        next(error);
    }
}
