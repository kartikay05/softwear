import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import sendResponse from "../utils/sendResponse.js";
import { deleteFile, uploadFile } from "../services/storage.service.js";
import {
    countProducts,
    createProduct as createProductRecord,
    findProductById,
    findProducts,
} from "../dao/product.dao.js";

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
    let images = [];

    try {
        const payload = normalizeProductBody(req.body);
        images = await uploadProductImages(req.files);

        if (payload.discountPrice !== null && payload.discountPrice > payload.price) {
            throw new ApiError(400, "discountPrice cannot exceed price");
        }

        const product = await createProductRecord({
            ...payload,
            images,
        });

        return sendResponse(res, 201, "Product created successfully", { product });
    } catch (error) {
        if (images.length) await deleteProductImages(images);
        next(error);
    }
}

export async function getAllProducts(req, res, next) {
    try {
        const features = new ApiFeatures(findProducts(), req.query)
            .search(["name", "description", "brand"])
            .filter(["category", "brand", "isFeatured"])
            .sort();

        const totalProducts = await countProducts(features.query.getFilter());

        features.paginate(12);

        const products = await features.query;

        return sendResponse(res, 200, "Products fetched successfully", {
            products,
            pagination: {
                ...features.pagination,
                totalProducts,
                totalPages: Math.ceil(totalProducts / features.pagination.limit),
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getProductDetails(req, res, next) {
    try {
        const product = await findProductById(req.params.id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return sendResponse(res, 200, "Product fetched successfully", { product });
    } catch (error) {
        next(error);
    }
}

export async function updateProduct(req, res, next) {
    let replacementImages = [];

    try {
        const product = await findProductById(req.params.id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        const payload = normalizeProductBody(req.body);
        const previousImages = product.images.map((image) => image.toObject());

        if (req.files?.length) {
            replacementImages = await uploadProductImages(req.files);
            payload.images = replacementImages;
        }

        Object.assign(product, payload);

        if (product.discountPrice !== null && product.discountPrice > product.price) {
            throw new ApiError(400, "discountPrice cannot exceed price");
        }

        await product.save();

        if (replacementImages.length) {
            await deleteProductImages(previousImages);
        }

        return sendResponse(res, 200, "Product updated successfully", { product });
    } catch (error) {
        if (replacementImages.length) await deleteProductImages(replacementImages);
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const product = await findProductById(req.params.id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        const images = product.images.map((image) => image.toObject());
        await product.deleteOne();
        await deleteProductImages(images);

        return sendResponse(res, 200, "Product deleted successfully", { product });
    } catch (error) {
        next(error);
    }
}
