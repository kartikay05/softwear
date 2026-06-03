import productModel from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import sendResponse from "../utils/sendResponse.js";
import { deleteFile, uploadFile } from "../services/storage.service.js";

function toNumber(value) {
    if (value === undefined || value === null || value === "") return value;
    return Number(value);
}

function normalizeProductBody(body) {
    const payload = {};
    const allowedFields = [
        "name",
        "description",
        "category",
        "brand",
        "isFeatured",
    ];

    allowedFields.forEach((field) => {
        if (body[field] !== undefined) payload[field] = body[field];
    });

    if (body.price !== undefined) payload.price = toNumber(body.price);
    if (body.discountPrice !== undefined) {
        payload.discountPrice = body.discountPrice === "" ? null : toNumber(body.discountPrice);
    }
    if (body.stock !== undefined) payload.stock = toNumber(body.stock);

    return payload;
}

async function uploadProductImages(files = []) {
    if (!files.length) return [];

    const uploadedImages = await Promise.all(
        files.map(async (file) => {
            const uploaded = await uploadFile({
                buffer: file.buffer,
                fileName: `${Date.now()}-${file.originalname}`,
                folder: "softwear/products",
            });

            return {
                url: uploaded.url,
                publicId: uploaded.fileId || uploaded.filePath || uploaded.name,
            };
        })
    );

    return uploadedImages;
}

async function deleteProductImages(images = []) {
    await Promise.allSettled(
        images
            .filter((image) => image.publicId)
            .map((image) => deleteFile(image.publicId))
    );
}

export async function createProduct(req, res, next) {
    try {
        const payload = normalizeProductBody(req.body);
        const images = await uploadProductImages(req.files);

        const product = await productModel.create({
            ...payload,
            images,
        });

        return sendResponse(res, 201, "Product created successfully", { product });
    } catch (error) {
        next(error);
    }
}

export async function getAllProducts(req, res, next) {
    try {
        const features = new ApiFeatures(productModel.find(), req.query)
            .search(["name", "description", "brand"])
            .filter(["category", "brand", "isFeatured"])
            .sort();

        const totalProducts = await productModel.countDocuments(features.query.getFilter());

        features.paginate(12);

        const products = await features.query;

        return sendResponse(res, 200, "Products fetched successfully", {
            products,
            pagination: {
                ...features.pagination,
                totalProducts,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getProductDetails(req, res, next) {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return sendResponse(res, 200, "Product fetched successfully", { product });
    } catch (error) {
        next(error);
    }
}

export async function updateProduct(req, res, next) {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        const payload = normalizeProductBody(req.body);

        if (req.files?.length) {
            await deleteProductImages(product.images);
            payload.images = await uploadProductImages(req.files);
        }

        Object.assign(product, payload);
        await product.save();

        return sendResponse(res, 200, "Product updated successfully", { product });
    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        await deleteProductImages(product.images);
        await product.deleteOne();

        return sendResponse(res, 200, "Product deleted successfully", { product });
    } catch (error) {
        next(error);
    }
}
