import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { A_Workspace, WorkspaceClient } from "@repo/tealcraft-sdk";

export type PortalState = {
  workspaces: A_Workspace[];
};

const initialState: PortalState = {
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
    async (): Promise<A_Workspace[]> => {
      return new WorkspaceClient().findAll();
    },
  );

export const portalSlice = createSlice({
  name: "portal",
  initialState: {
    ...initialState,
  },
  reducers: {},
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

export default portalSlice.reducer;
