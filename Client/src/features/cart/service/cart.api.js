import api from "../../shared/service/api.js";

/**
 * Fetch the current user's cart.
 */
export async function getCart() {
  return api.get("/cart");
}

/**
 * Add a product to the cart.
 */
export async function addToCart(productId, quantity = 1) {
  return api.post("/cart/add", { productId, quantity });
}

/**
 * Update the quantity of a cart item.
 */
export async function updateCartItem(productId, quantity) {
  return api.put("/cart/update", { productId, quantity });
}

/**
 * Remove an item from the cart by its item subdocument ID.
 */
export async function removeCartItem(itemId) {
  return api.delete(`/cart/remove/${itemId}`);
}

/**
 * Clear the entire cart.
 */
export async function clearCart() {
  return api.delete("/cart/clear");
}
