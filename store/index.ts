import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import parcelReducer from "./slices/parcelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parcels: parcelReducer,
  },
});

// Type definitions for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
