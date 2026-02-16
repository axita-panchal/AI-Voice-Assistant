import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Workspace = {
  id: string;
  name: string;
};

interface WorkspaceState {
  activeWorkspace: Workspace | null;
}

const initialState: WorkspaceState = {
  activeWorkspace: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.activeWorkspace = action.payload;
    },
    clearWorkspace: (state) => {
      state.activeWorkspace = null;
    },
  },
});

export const { setActiveWorkspace, clearWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
