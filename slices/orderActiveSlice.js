import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderActive: {
    order: [],
  },
};

const orderActiveSlice = createSlice({
  name: "orderActive",
  initialState,
  reducers: {
    setOrderActive: (state, action) => {
      state.orderActive = action.payload;
    },
  },
});

export const { setOrderActive } = orderActiveSlice.actions;
export const selectOrderActive = (state) => state.orderActive.orderActive;
export default orderActiveSlice.reducer;
