import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/utils/types";
import { RootState } from "..";

interface OrderState {
  orders: Order[];
  pendingCount: number;
  paidCount: number;
  cancelledCount: number;
  totalOrders: number;
}

const initialState: OrderState = {
  orders: [],
  pendingCount: 0,
  paidCount: 0,
  cancelledCount: 0,
  totalOrders: 0,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.totalOrders = action.payload.length;

      state.pendingCount = 0;
      state.paidCount = 0;
      state.cancelledCount = 0;

      action.payload.forEach((order) => {
        switch (order.status) {
          case "PENDING":
            state.pendingCount++;
            break;
          case "PAID":
            state.paidCount++;
            break;
          case "CANCELLED":
            state.cancelledCount++;
            break;
        }
      });
    },
    clearOrders: (state) => initialState,
  },
});

export const { setOrders, clearOrders } = orderSlice.actions;

export const selectAllOrders = (state: RootState) => state.orders.orders;

export default orderSlice.reducer;
