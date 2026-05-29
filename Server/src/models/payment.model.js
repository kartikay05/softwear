import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const paymentSchema = new mongoose.Schema({
    price: {
        type: priceSchema,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    razorpay: {
        orderId: String,
        signature: String,
        paymentId: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orderItems: {
        title: String,
        productId: mongoose.Schema.Types.ObjectId,
        variantId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        images: [{ url: String }],
        description: String,
        price: priceSchema
    }
}, { timestamps: true })

const paymentModel = mongoose.model("payment", paymentSchema);
export default paymentModel;