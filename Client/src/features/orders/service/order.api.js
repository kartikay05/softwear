import api from "../../shared/service/api.js";

/**
 * Create a new order from current cart.
 */
export async function createOrder(shippingAddress, discount = 0) {
  return api.post("/orders", { shippingAddress, discount });
}

/**
 * Fetch all orders for the authenticated user.
 */
export async function getMyOrders() {
  return api.get("/orders/my-orders");
}

/**
 * Fetch a single order by ID.
 */
export async function getOrderById(id) {
  return api.get(`/orders/${id}`);
}

/**
 * Cancel a pending or processing order.
 */
export async function cancelOrder(id, reason) {
  return api.put(`/orders/${id}/cancel`, { reason });
}

/**
 * Initiate a payment checkout session.
 * Method can be "cod" or "razorpay".
 */
export async function createPaymentSession(orderId, paymentMethod = "cod") {
  return api.post("/payment/create-order", { orderId, paymentMethod });
}

/**
 * Verify Razorpay payment signature.
 */
export async function verifyPaymentSignature(paymentDetails) {
  return api.post("/payment/verify", paymentDetails);
}
