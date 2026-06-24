import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        image: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            trim: true,
        },
        street: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        pincode: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator(items) {
                    return items.length > 0;
                },
                message: "Order must contain at least one item",
            },
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },
        paymentInfo: {
            method: {
                type: String,
                enum: ["cod", "razorpay"],
                default: "cod",
            },
            razorpayOrderId: {
                type: String,
                default: "",
            },
            razorpayPaymentId: {
                type: String,
                default: "",
            },
            status: {
                type: String,
                enum: ["pending", "paid", "failed", "refunded"],
                default: "pending",
            },
        },
        couponApplied: {
            code: {
                type: String,
                default: "",
            },
            couponId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coupon",
                default: null,
            },
        },
        discount: {
            type: Number,
            min: 0,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        orderStatus: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
            index: true,
        },
        cancellation: {
            reason: {
                type: String,
                default: "",
                trim: true,
            },
            cancelledBy: {
                type: String,
                enum: ["user", "admin", ""],
                default: "",
            },
            cancelledAt: {
                type: Date,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
