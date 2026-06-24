import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../service/cart.api.js";

const initialState = {
  items: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

export const fetchCartThunk = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      if (response && response.success) {
        return response.data.cart;
      }
      return rejectWithValue(response.message || "Failed to fetch cart");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error fetching cart";
      return rejectWithValue(msg);
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await addToCart(productId, quantity);
      if (response && response.success) {
        return response.data.cart;
      }
      return rejectWithValue(response.message || "Failed to add to cart");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error adding to cart";
      return rejectWithValue(msg);
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateCartItem(productId, quantity);
      if (response && response.success) {
        return response.data.cart;
      }
      return rejectWithValue(response.message || "Failed to update item");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error updating item";
      return rejectWithValue(msg);
    }
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await removeCartItem(itemId);
      if (response && response.success) {
        return response.data.cart;
      }
      return rejectWithValue(response.message || "Failed to remove item");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error removing item";
      return rejectWithValue(msg);
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearCart();
      if (response && response.success) {
        return response.data.cart;
      }
      return rejectWithValue(response.message || "Failed to clear cart");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error clearing cart";
      return rejectWithValue(msg);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleCartFulfilled = (state, action) => {
      state.loading = false;
      state.items = action.payload.items || [];
      state.totalPrice = action.payload.totalPrice || 0;
      state.error = null;
    };

    builder
      // Fetch Cart
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, handleCartFulfilled)
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, handleCartFulfilled)
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Item
      .addCase(updateCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemThunk.fulfilled, handleCartFulfilled)
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Item
      .addCase(removeCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItemThunk.fulfilled, handleCartFulfilled)
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, handleCartFulfilled)
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
