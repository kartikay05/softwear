import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminOrders, updateOrderStatus, cancelOrderAsAdmin, createProductAdmin, updateProductAdmin, deleteProductAdmin } from "../service/admin.api.js";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchAdminOrdersThunk = createAsyncThunk(
  "admin/fetchOrders",
  async (status, { rejectWithValue }) => {
    try {
      const response = await getAdminOrders(status);
      if (response && response.success) {
        return response.data.orders;
      }
      return rejectWithValue(response.message || "Failed to fetch admin orders");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error fetching admin orders";
      return rejectWithValue(msg);
    }
  }
);

export const updateAdminOrderStatusThunk = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, orderStatus, reason }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatus(orderId, orderStatus, reason);
      if (response && response.success) {
        return response.data.order;
      }
      return rejectWithValue(response.message || "Failed to update order status");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error updating order status";
      return rejectWithValue(msg);
    }
  }
);

export const createProductAdminThunk = createAsyncThunk(
  "admin/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createProductAdmin(formData);
      if (response && response.success) {
        return response.data.product;
      }
      return rejectWithValue(response.message || "Failed to create product");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error creating product";
      return rejectWithValue(msg);
    }
  }
);

export const updateProductAdminThunk = createAsyncThunk(
  "admin/updateProduct",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProductAdmin(productId, formData);
      if (response && response.success) {
        return response.data.product;
      }
      return rejectWithValue(response.message || "Failed to update product");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error updating product";
      return rejectWithValue(msg);
    }
  }
);

export const deleteProductAdminThunk = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await deleteProductAdmin(productId);
      if (response && response.success) {
        return productId;
      }
      return rejectWithValue(response.message || "Failed to delete product");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error deleting product";
      return rejectWithValue(msg);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchAdminOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateAdminOrderStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((o) => o._id === action.payload._id ? action.payload : o);
      })
      .addCase(updateAdminOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createProductAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductAdminThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProductAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProductAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAdminThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProductAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProductAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAdminThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProductAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
