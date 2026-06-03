import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";

async function getOrCreateCart(userId) {
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
        cart = await cartModel.create({ userId, items: [], totalPrice: 0 });
    }

    return cart;
}

async function recalculateCart(cart) {
    let totalPrice = 0;
    const nextItems = [];

    for (const item of cart.items) {
        const product = await productModel.findById(item.productId);

        if (!product) continue;

        const effectivePrice = product.discountPrice ?? product.price;
        const safeQuantity = Math.min(item.quantity, product.stock);

        if (safeQuantity < 1) continue;

        item.quantity = safeQuantity;
        item.price = effectivePrice;
        totalPrice += effectivePrice * safeQuantity;
        nextItems.push(item);
    }

    cart.items = nextItems;
    cart.totalPrice = totalPrice;
    await cart.save();

    return cart.populate("items.productId", "name price discountPrice images category brand stock");
}

export async function getCart(req, res, next) {
    try {
        const cart = await getOrCreateCart(req.user._id);
        const populatedCart = await recalculateCart(cart);

        return sendResponse(res, 200, "Cart fetched successfully", { cart: populatedCart });
    } catch (error) {
        next(error);
    }
}

export async function addToCart(req, res, next) {
    try {
        const { productId } = req.body;
        const quantity = Number(req.body.quantity) || 1;

        const product = await productModel.findById(productId);
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        if (product.stock < 1) {
            return next(new ApiError(400, "Product is out of stock"));
        }

        const cart = await getOrCreateCart(req.user._id);
        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const nextQuantity = currentQuantity + quantity;

        if (nextQuantity > product.stock) {
            return next(new ApiError(400, `Only ${product.stock} items available in stock`));
        }

        const effectivePrice = product.discountPrice ?? product.price;

        if (existingItem) {
            existingItem.quantity = nextQuantity;
            existingItem.price = effectivePrice;
        } else {
            cart.items.push({
                productId,
                quantity,
                price: effectivePrice,
            });
        }

        const populatedCart = await recalculateCart(cart);
        return sendResponse(res, 200, "Product added to cart successfully", { cart: populatedCart });
    } catch (error) {
        next(error);
    }
}

export async function updateCartItem(req, res, next) {
    try {
        const { productId } = req.body;
        const quantity = Number(req.body.quantity);

        const product = await productModel.findById(productId);
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        if (quantity > product.stock) {
            return next(new ApiError(400, `Only ${product.stock} items available in stock`));
        }

        const cart = await cartModel.findOne({ userId: req.user._id });
        if (!cart) {
            return next(new ApiError(404, "Cart not found"));
        }

        const item = cart.items.find((cartItem) => cartItem.productId.toString() === productId);
        if (!item) {
            return next(new ApiError(404, "Cart item not found"));
        }

        item.quantity = quantity;
        item.price = product.discountPrice ?? product.price;

        const populatedCart = await recalculateCart(cart);
        return sendResponse(res, 200, "Cart item updated successfully", { cart: populatedCart });
    } catch (error) {
        next(error);
    }
}

export async function removeCartItem(req, res, next) {
    try {
        const cart = await cartModel.findOne({ userId: req.user._id });
        if (!cart) {
            return next(new ApiError(404, "Cart not found"));
        }

        const item = cart.items.id(req.params.itemId);
        if (!item) {
            return next(new ApiError(404, "Cart item not found"));
        }

        item.deleteOne();
        const populatedCart = await recalculateCart(cart);

        return sendResponse(res, 200, "Cart item removed successfully", { cart: populatedCart });
    } catch (error) {
        next(error);
    }
}

export async function clearCart(req, res, next) {
    try {
        const cart = await getOrCreateCart(req.user._id);
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        return sendResponse(res, 200, "Cart cleared successfully", { cart });
    } catch (error) {
        next(error);
    }
}
