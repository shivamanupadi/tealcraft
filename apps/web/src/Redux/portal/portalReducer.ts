import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { A_Workspace, WorkspaceClient } from "@repo/tealcraft-sdk";

export type PortalState = {
  loadingWorkspaces: boolean;
  workspaces: A_Workspace[];
};

const initialState: PortalState = {
  loadingWorkspaces: false,
  workspaces: [],
};

export const initPortal: AsyncThunk<void, void, {}> = createAsyncThunk(
  "portal/initPortal",
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(loadWorkspaces());
  },
);

export const loadWorkspaces: AsyncThunk<A_Workspace[], void, {}> =
  createAsyncThunk(
    "portal/loadWorkspaces",
    async (_, thunkAPI): Promise<A_Workspace[]> => {
      const { dispatch } = thunkAPI;
      let workspaces: A_Workspace[] = [];

      try {
        dispatch(setWorkspacesLoading(true));
        workspaces = await new WorkspaceClient().findAll();
        dispatch(setWorkspacesLoading(false));
        return workspaces;
      } catch (e) {
        dispatch(setWorkspacesLoading(false));
      }

      return workspaces;
    },
  );

export const portalSlice = createSlice({
  name: "portal",
  initialState: {
    ...initialState,
  },
  reducers: {
    setWorkspacesLoading: (state, action: PayloadAction<boolean>) => {
      state.loadingWorkspaces = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadWorkspaces.fulfilled,
      (state, action: PayloadAction<A_Workspace[]>) => {
        if (action.payload) {
          state.workspaces = action.payload;
        }
      },
    );
  },
});

export const { setWorkspacesLoading } = portalSlice.actions;
export default portalSlice.reducer;
