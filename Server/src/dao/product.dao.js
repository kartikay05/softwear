import productModel from "../models/product.model.js";

export function createProduct(payload) {
    return productModel.create(payload);
}

export function findProducts(filter = {}) {
    return productModel.find(filter);
}

export function countProducts(filter = {}) {
    return productModel.countDocuments(filter);
}

export function findProductById(productId) {
    return productModel.findById(productId);
}

export function updateProductById(productId, update, options = { new: true }) {
    return productModel.findByIdAndUpdate(productId, update, options);
}

export function decrementProductStock(productId, quantity) {
    return productModel.findByIdAndUpdate(productId, {
        $inc: {
            stock: -quantity,
            sold: quantity,
        },
    });
}

export function restoreProductStock(productId, quantity) {
    return productModel.findByIdAndUpdate(productId, {
        $inc: {
            stock: quantity,
            sold: -quantity,
        },
    });
}
