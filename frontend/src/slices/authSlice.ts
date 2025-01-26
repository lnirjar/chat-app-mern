import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  avatar: string;
  username: string;
  email: string;
  lastPasswordChange: string;
}

type InitialState = {
  user: User | null;
};

const initialState: InitialState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        console.error("Cannot update user: user is null");
      }
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
