import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  A_Contract,
  A_Workspace,
  ContractClient,
  WorkspaceClient,
} from "@repo/tealcraft-sdk";

export type WorkspaceState = {
  workspace?: A_Workspace;
  contracts: A_Contract[];
};

const initialState: WorkspaceState = {
  contracts: [],
};

export const loadContracts: AsyncThunk<A_Contract[], A_Workspace, {}> =
  createAsyncThunk(
    "workspace/loadContracts",
    async (workspace: A_Workspace): Promise<A_Contract[]> => {
      return new ContractClient().findByWorkspace(workspace.id);
    },
  );

export const loadWorkspace: AsyncThunk<A_Workspace | undefined, string, {}> =
  createAsyncThunk(
    "workspace/loadWorkspace",
    async (workspaceId: string, thunkAPI): Promise<A_Workspace | undefined> => {
      const { dispatch } = thunkAPI;
      const workspace = await new WorkspaceClient().get(workspaceId);
      if (workspace) {
        dispatch(loadContracts(workspace));
      }
      return workspace;
    },
  );

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    ...initialState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loadContracts.fulfilled,
      (state, action: PayloadAction<A_Contract[]>) => {
        if (action.payload) {
          state.contracts = action.payload;
        }
      },
    );

    builder.addCase(
      loadWorkspace.fulfilled,
      (state, action: PayloadAction<A_Workspace | undefined>) => {
        if (action.payload) {
          state.workspace = action.payload;
        }
      },
    );
  },
});

export default workspaceSlice.reducer;
