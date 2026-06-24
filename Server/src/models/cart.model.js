import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: true }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [cartItemSchema],
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

cartSchema.index({ userId: 1 }, { unique: true });

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
