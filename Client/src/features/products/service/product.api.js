import api from "../../shared/service/api.js";

/**
 * Fetch all products with search, sorting, pagination, and filter queries.
 */
export async function getProducts(params = {}) {
  return api.get("/products", { params });
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(id) {
  return api.get(`/products/${id}`);
}
