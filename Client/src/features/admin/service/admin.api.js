import api from "../../shared/service/api.js";

/**
 * Fetch all orders for admin.
 */
export async function getAdminOrders(status = "") {
  const params = status ? { status } : {};
  return api.get("/admin/orders", { params });
}

/**
 * Update order status (pending -> processing -> shipped -> delivered -> cancelled).
 */
export async function updateOrderStatus(orderId, orderStatus, reason = "") {
  return api.put(`/admin/orders/${orderId}/status`, { orderStatus, reason });
}

/**
 * Cancel an order as admin.
 */
export async function cancelOrderAsAdmin(orderId, reason) {
  return api.put(`/admin/orders/${orderId}/cancel`, { reason });
}

/**
 * Create a new product.
 * Uses multipart/form-data for image uploads.
 */
export async function createProductAdmin(formData) {
  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Update an existing product.
 */
export async function updateProductAdmin(productId, formData) {
  return api.put(`/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Delete a product by ID.
 */
export async function deleteProductAdmin(productId) {
  return api.delete(`/products/${productId}`);
}
