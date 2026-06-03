import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: "text",
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
            default: null,
        },
        images: [productImageSchema],
        category: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        sold: {
            type: Number,
            min: 0,
            default: 0,
        },
        ratings: {
            average: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
            count: {
                type: Number,
                min: 0,
                default: 0,
            },
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ name: "text", description: "text", brand: "text" });

const productModel = mongoose.model("Product", productSchema);

export default productModel;
