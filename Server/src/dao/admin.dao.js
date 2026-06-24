import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";

export function getDashboardStats() {
    return Promise.all([
        orderModel.aggregate([
            { $match: { "paymentInfo.status": { $in: ["paid", "pending"] }, orderStatus: { $ne: "cancelled" } } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } },
        ]),
        userModel.countDocuments({ role: "user" }),
        productModel.countDocuments({ stock: { $lt: 10 } }),
    ]);
}

export function getRevenueAnalytics({ from, to, groupFormat = "%Y-%m-%d" } = {}) {
    const match = { orderStatus: { $ne: "cancelled" } };

    if (from || to) {
        match.createdAt = {};
        if (from) match.createdAt.$gte = from;
        if (to) match.createdAt.$lte = to;
    }

    return orderModel.aggregate([
        { $match: match },
        {
            $group: {
                _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
}

export function getOrdersByStatus() {
    return orderModel.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
}

export function getTopSellingProducts(limit = 5) {
    return productModel.aggregate([
        { $sort: { sold: -1 } },
        { $limit: limit },
        { $project: { name: 1, brand: 1, category: 1, sold: 1, stock: 1 } },
    ]);
}
