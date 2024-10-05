import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromCart: (state, action) => {
      let newCart = [...state.items];
      let itemIndex = state.items.findIndex(
        (item) => item._id === action.payload.id
      );

      if (itemIndex >= 0) {
        newCart.splice(itemIndex, 1);
      } else {
        console.log("Can't");
      }

      state.items = newCart;
    },
    removeAllFromCart: (state, action) => {
      let newCart = state.items.filter(
        (item) => item._id !== action.payload.id
      );
      state.items = newCart;
    },
    emptyCart: (state, action) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, removeAllFromCart, emptyCart } =
  cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsById = createSelector(
  [selectCartItems, (state, id) => id], // Entradas: todos los items y el id
  (items, id) => items.filter((item) => item._id === id) // Resultado memoizado
);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => (total = total + item.price), 0);
export default cartSlice.reducer;
