import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Delivery } from "@/utils/types";
import { RootState } from "..";

interface DeliveryState {
  deliveries: Delivery[];
  pendingCount: number;
  inTransitCount: number;
  completedCount: number;
  cancelledCount: number;
  totalDeliveries: number;
}

const initialState: DeliveryState = {
  deliveries: [],
  pendingCount: 0,
  inTransitCount: 0,
  completedCount: 0,
  cancelledCount: 0,
  totalDeliveries: 0,
};

const deliverySlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    setDeliveries: (state, action: PayloadAction<Delivery[]>) => {
      state.deliveries = action.payload;
      state.totalDeliveries = action.payload.length;

      state.pendingCount = 0;
      state.inTransitCount = 0;
      state.completedCount = 0;
      state.cancelledCount = 0;

      action.payload.forEach((delivery) => {
        switch (delivery.status) {
          case "PENDING":
            state.pendingCount++;
            break;
          case "IN_TRANSIT":
            state.inTransitCount++;
            break;
          case "COMPLETED":
            state.completedCount++;
            break;
          case "CANCELLED":
            state.cancelledCount++;
            break;
        }
      });
    },
    clearDeliveries: (state) => initialState,
  },
});

export const { setDeliveries, clearDeliveries } = deliverySlice.actions;

export const selectAllDeliveries = (state: RootState) =>
  state.deliveries.deliveries;

export default deliverySlice.reducer;
