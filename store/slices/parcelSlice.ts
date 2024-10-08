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
    // Set all parcels and update counts
    setParcels: (state, action: PayloadAction<Parcel[]>) => {
      state.parcels = action.payload;
      state.totalParcels = action.payload.length;
      state.pendingCount = 0;
      state.inTransitCount = 0;
      state.deliveredCount = 0;
      state.returnedCount = 0;

      // Update parcel counts by status
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

    // Update the status of a specific parcel
    updateParcelStatus: (
      state,
      action: PayloadAction<{ id: string; status: ParcelStatus }>
    ) => {
      const { id, status } = action.payload;
      const parcel = state.parcels.find((parcel) => parcel.id === id);
      if (parcel) {
        // Update counts if status changes
        if (parcel.status !== status) {
          // Decrement the old status count
          if (parcel.status === "PENDING") state.pendingCount -= 1;
          if (parcel.status === "IN_TRANSIT") state.inTransitCount -= 1;
          if (parcel.status === "DELIVERED") state.deliveredCount -= 1;
          if (parcel.status === "RETURNED") state.returnedCount -= 1;

          // Increment the new status count
          if (status === "PENDING") state.pendingCount += 1;
          if (status === "IN_TRANSIT") state.inTransitCount += 1;
          if (status === "DELIVERED") state.deliveredCount += 1;
          if (status === "RETURNED") state.returnedCount += 1;
        }

        parcel.status = status; // Update the status
      }
    },

    // Clear all parcels
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
  return state.parcels.parcels
    .filter((parcel) => parcel.status === "IN_TRANSIT")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
};

// 3. Selector for the 3 most recent 'DELIVERED' parcels
export const selectThreeMostRecentDeliveredParcels = (state: {
  parcels: ParcelState;
}) => {
  return state.parcels.parcels
    .filter((parcel) => parcel.status === "DELIVERED")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);
};

export const { setParcels, updateParcelStatus, clearParcels } =
  parcelSlice.actions;
export default parcelSlice.reducer;
