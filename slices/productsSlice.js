import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../constants";

const initialState = {
  products: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (storeId) => {
    const response = await getProducts(storeId);
    return response;
  }
);

export const { setProducts } = productsSlice.actions;
export const selectProducts = (state) => state.products.products;
export default productsSlice.reducer;
