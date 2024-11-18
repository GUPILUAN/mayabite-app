import { configureStore } from "@reduxjs/toolkit";
import store_Slice from "./slices/store_Slice";
import cartSlice from "./slices/cartSlice";
import productsSlice from "./slices/productsSlice";
import themeSclice from "./slices/themeSlice";
import settingsSlice from "./slices/settingsSlice";
import userSlice from "./slices/userSlice";
import orderActiveSlice from "./slices/orderActiveSlice";
import locationSlice from "./slices/locationSlice";

export const store = configureStore({
  reducer: {
    store_: store_Slice,
    cart: cartSlice,
    products: productsSlice,
    theme: themeSclice,
    settings: settingsSlice,
    user: userSlice,
    orderActive: orderActiveSlice,
    location: locationSlice,
  },
});
