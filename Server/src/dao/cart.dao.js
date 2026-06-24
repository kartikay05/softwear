import cartModel from "../models/cart.model.js";

export function findCartByUserId(userId) {
    return cartModel.findOne({ userId });
}

export function createCart(userId) {
    return cartModel.create({ userId, items: [], totalPrice: 0 });
}

export async function findOrCreateCart(userId) {
    const cart = await findCartByUserId(userId);
    if (cart) return cart;

    return createCart(userId);
}

export function deleteCartByUserId(userId) {
    return cartModel.findOneAndDelete({ userId });
}
