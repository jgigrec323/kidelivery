import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Parcel, ParcelStatus } from "@/utils/types"; // Ensure Parcel type has createdAt

interface ParcelState {
  parcels: Parcel[];
  pendingCount: number;
  inTransitCount: number;
  deliveredCount: number;
  returnedCount: number;
  totalParcels: number;
}

const initialState: ParcelState = {
  parcels: [],
  pendingCount: 0,
  inTransitCount: 0,
  deliveredCount: 0,
  returnedCount: 0,
  totalParcels: 0,
};

const parcelSlice = createSlice({
  name: "parcels",
  initialState,
  reducers: {
    setParcels: (state, action: PayloadAction<Parcel[]>) => {
      state.parcels = action.payload;
      state.totalParcels = action.payload.length;
      state.pendingCount = 0;
      state.inTransitCount = 0;
      state.deliveredCount = 0;
      state.returnedCount = 0;

      action.payload.forEach((parcel) => {
        const status = parcel.status;
        if (status === "PENDING") {
          state.pendingCount += 1;
        } else if (status === "IN_TRANSIT") {
          state.inTransitCount += 1;
        } else if (status === "DELIVERED") {
          state.deliveredCount += 1;
        } else if (status === "RETURNED") {
          state.returnedCount += 1;
        }
      });
    },
    updateParcelStatus: (
      state,
      action: PayloadAction<{ id: string; status: ParcelStatus }>
    ) => {
      const { id, status } = action.payload;
      const parcel = state.parcels.find((parcel) => parcel.id === id);
      if (parcel) {
        parcel.status = status;
      }
    },
    clearParcels: (state) => {
      state.parcels = [];
      state.pendingCount = 0;
      state.inTransitCount = 0;
      state.deliveredCount = 0;
      state.returnedCount = 0;
      state.totalParcels = 0;
    },
  },
});

// Selectors

// 1. Selector for Parcel History (last 3 parcels of any status)
export const selectThreeMostRecentParcels = (state: {
  parcels: ParcelState;
}) => {
  // Since the parcels are already sorted in descending order from DB, just slice
  return state.parcels.parcels.slice(0, 3);
};

// 2. Selector for the most recent parcel with 'IN_TRANSIT' status
export const selectMostRecentInTransitParcel = (state: {
  parcels: ParcelState;
}) => {
  return state.parcels.parcels.find((parcel) => parcel.status === "IN_TRANSIT");
};

// 3. Selector for the 3 most recent 'DELIVERED' parcels
export const selectThreeMostRecentDeliveredParcels = (state: {
  parcels: ParcelState;
}) => {
  return state.parcels.parcels
    .filter((parcel) => parcel.status === "DELIVERED")
    .slice(0, 3);
};

export const { setParcels, updateParcelStatus, clearParcels } =
  parcelSlice.actions;
export default parcelSlice.reducer;
