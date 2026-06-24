import orderModel from "../models/order.model.js";

export function createOrder(payload) {
    return orderModel.create(payload);
}

export function findOrderById(orderId) {
    return orderModel.findById(orderId);
}

export function findUserOrderById(orderId, userId) {
    return orderModel.findOne({ _id: orderId, userId });
}

export function findOrders(filter = {}) {
    return orderModel.find(filter);
}

export function countOrders(filter = {}) {
    return orderModel.countDocuments(filter);
}

export function updateOrderById(orderId, update, options = { new: true }) {
    return orderModel.findByIdAndUpdate(orderId, update, options);
}
