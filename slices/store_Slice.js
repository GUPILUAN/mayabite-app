import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  store_: null,
};

export const store_Slice = createSlice({
  name: "store_",
  initialState,
  reducers: {
    setStore_: (state, action) => {
      state.store_ = action.payload;
    },
  },
});

export const { setStore_ } = store_Slice.actions;
export const selectStore_ = (state) => state.store_.store_;
export default store_Slice.reducer;
