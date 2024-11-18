import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export const selectLocation = (state) => state.location.location;
export default locationSlice.reducer;
