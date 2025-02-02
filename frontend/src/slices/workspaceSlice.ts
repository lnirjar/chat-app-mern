import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MemberRole } from "@/lib/constants";

export interface Workspace {
  _id: string;
  name: string;
  role: MemberRole;
}

type InitialState = {
  allWorkspaces: Workspace[];
  currentWorkspace: Workspace | null;
};

const initialState: InitialState = {
  allWorkspaces: [],
  currentWorkspace: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setAllWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      const workspaces = action.payload;
      state.allWorkspaces = workspaces;
      if (workspaces.length !== 0) {
        state.currentWorkspace = workspaces[0];
      } else {
        state.currentWorkspace = null;
      }
    },
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      const existingWorkspace = state.allWorkspaces.find(
        (workspace) => workspace._id === action.payload._id,
      );
      const workspace = action.payload;
      if (!existingWorkspace) {
        state.allWorkspaces.push(workspace);
      }
      state.currentWorkspace = workspace;
    },
    removeWorkspace: (state, action: PayloadAction<Workspace>) => {
      const filteredWorkspaces = state.allWorkspaces.filter(
        (workspace) => workspace._id !== action.payload._id,
      );

      state.allWorkspaces = filteredWorkspaces;

      if (filteredWorkspaces.length === 0) {
        state.currentWorkspace = null;
      } else if (action.payload._id === state.currentWorkspace?._id) {
        state.currentWorkspace = filteredWorkspaces[0];
      }
    },
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      const workspace = action.payload;
      state.currentWorkspace = workspace;
    },
  },
});

export default workspaceSlice.reducer;
export const workspaceActions = workspaceSlice.actions;
