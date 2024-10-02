import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string | null;
  phoneNumber: string | null;
  fullName: string | null;
}

const initialState: AuthState = {
  id: null,
  phoneNumber: null,
  fullName: null,
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
      }>
    ) => {
      state.id = action.payload.id;
      state.phoneNumber = action.payload.phoneNumber;
      state.fullName = action.payload.fullName;
    },
    clearUser: (state) => {
      state.id = null;
      state.phoneNumber = null;
      state.fullName = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
