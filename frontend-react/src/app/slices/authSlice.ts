import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserResponse } from "../../utils/types";

export interface AuthState {
  user?: UserResponse;
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {} as AuthState,
  reducers: {
    setAuthState: (
      state: AuthState,
      action: PayloadAction<UserResponse | undefined>
    ) => {
      state.user = action.payload;
    },
  },
});
export const { setAuthState } = authSlice.actions;

export default authSlice.reducer;
