import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder, getMyOrders, getOrderById, cancelOrder, createPaymentSession, verifyPaymentSignature } from "../service/order.api.js";

const initialState = {
  orders: [],
  selectedOrder: null,
  currentOrder: null,
  loading: false,
  error: null,
  coupon: null, // Holds applied coupon locally { code, value, type }
};

export const createOrderThunk = createAsyncThunk(
  "orders/createOrder",
  async ({ shippingAddress, discount }, { rejectWithValue }) => {
    try {
      const response = await createOrder(shippingAddress, discount);
      if (response && response.success) {
        return response.data.order;
      }
      return rejectWithValue(response.message || "Failed to create order");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error creating order";
      return rejectWithValue(msg);
    }
  }
);

export const fetchMyOrdersThunk = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyOrders();
      if (response && response.success) {
        return response.data.orders;
      }
      return rejectWithValue(response.message || "Failed to fetch orders");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error fetching orders";
      return rejectWithValue(msg);
    }
  }
);

export const fetchOrderDetailsThunk = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getOrderById(id);
      if (response && response.success) {
        return response.data.order;
      }
      return rejectWithValue(response.message || "Failed to fetch order details");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error fetching order details";
      return rejectWithValue(msg);
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  "orders/cancelOrder",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await cancelOrder(id, reason);
      if (response && response.success) {
        return response.data.order;
      }
      return rejectWithValue(response.message || "Failed to cancel order");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error canceling order";
      return rejectWithValue(msg);
    }
  }
);

export const checkoutPaymentThunk = createAsyncThunk(
  "orders/checkoutPayment",
  async ({ orderId, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await createPaymentSession(orderId, paymentMethod);
      if (response && response.success) {
        return response.data; // returns order info, razorpayOrder details etc.
      }
      return rejectWithValue(response.message || "Failed to start payment session");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error during payment setup";
      return rejectWithValue(msg);
    }
  }
);

export const verifyPaymentThunk = createAsyncThunk(
  "orders/verifyPayment",
  async (paymentDetails, { rejectWithValue }) => {
    try {
      const response = await verifyPaymentSignature(paymentDetails);
      if (response && response.success) {
        return response.data.order;
      }
      return rejectWithValue(response.message || "Payment verification failed");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error verifying payment";
      return rejectWithValue(msg);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    applyCouponLocally: (state, action) => {
      const code = action.payload.trim().toUpperCase();
      const validCoupons = {
        "SOFTWEAR10": { code: "SOFTWEAR10", value: 10, type: "percentage" },
        "WELCOME20": { code: "WELCOME20", value: 20, type: "percentage" },
        "FLAT500": { code: "FLAT500", value: 500, type: "flat" },
      };
      
      if (validCoupons[code]) {
        state.coupon = validCoupons[code];
        state.error = null;
      } else {
        state.coupon = null;
        state.error = "Invalid coupon code";
      }
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.coupon = null; // Clear coupon after order placement
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Orders List
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order Details
      .addCase(fetchOrderDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Order
      .addCase(cancelOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Update selectedOrder if it matches
        if (state.selectedOrder && state.selectedOrder._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
        // Update order list
        state.orders = state.orders.map((o) => o._id === action.payload._id ? action.payload : o);
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Checkout Payment (starts COD or Razorpay order process)
      .addCase(checkoutPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutPaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(checkoutPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Razorpay Payment Signature
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        if (state.selectedOrder && state.selectedOrder._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
        state.orders = state.orders.map((o) => o._id === action.payload._id ? action.payload : o);
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { applyCouponLocally, removeCoupon, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
