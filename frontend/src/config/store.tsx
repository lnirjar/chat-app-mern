import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/slices/authSlice";
import workspaceReducer from "@/slices/workspaceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
