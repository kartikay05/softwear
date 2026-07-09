import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getProductById } from "../service/product.api.js";

// Fetch initial wishlist from localStorage
const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const initialState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalProducts: 0,
  },
  filters: {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "",
    page: 1,
  },
  wishlist: storedWishlist,
};

export const fetchProductsThunk = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getProducts(params);
      if (response && response.success) {
        return response.data; // returns { products, pagination }
      }
      return rejectWithValue(response.message || "Failed to fetch products");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error fetching products";
      return rejectWithValue(msg);
    }
  }
);

export const fetchProductDetailsThunk = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProductById(id);
      if (response && response.success) {
        return response.data.product;
      }
      return rejectWithValue(response.message || "Failed to fetch product details");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error fetching product details";
      return rejectWithValue(msg);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const existsIndex = state.wishlist.findIndex((item) => item._id === product._id);
      if (existsIndex >= 0) {
        // Remove
        state.wishlist.splice(existsIndex, 1);
      } else {
        // Add
        state.wishlist.push(product);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product Details
      .addCase(fetchProductDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, toggleWishlist, clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
