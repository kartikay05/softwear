import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js";
import productReducer from "../features/products/state/product.slice.js";
import cartReducer from "../features/cart/state/cart.slice.js";
import orderReducer from "../features/orders/state/order.slice.js";
import adminReducer from "../features/admin/state/admin.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    admin: adminReducer,
  },
});

export default store;
