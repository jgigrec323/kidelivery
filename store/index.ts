import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import parcelReducer from "./slices/parcelSlice";
import orderReducer from "./slices/orderSlice";
import deliveryReducer from "./slices/deliverySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parcels: parcelReducer,
    orders: orderReducer,
    deliveries: deliveryReducer,
  },
});

// Type definitions for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
