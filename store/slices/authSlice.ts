import { Shop } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string | null;
  phoneNumber: string | null;
  fullName: string | null;
  shops: Shop[];
}

const initialState: AuthState = {
  id: null,
  phoneNumber: null,
  fullName: null,
  shops: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        phoneNumber: string;
        fullName: string;
        shops: Shop[];
      }>
    ) => {
      state.id = action.payload.id;
      state.phoneNumber = action.payload.phoneNumber;
      state.fullName = action.payload.fullName;
      state.shops = action.payload.shops;
    },
    clearUser: (state) => {
      state.id = null;
      state.phoneNumber = null;
      state.fullName = null;
      state.shops = [];
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
