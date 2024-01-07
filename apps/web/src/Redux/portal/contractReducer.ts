import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { A_Contract, ContractClient } from "@repo/tealcraft-sdk";

export type ContractCompileErrorPayload = {
  msg: string;
  stack: string;
};

export type ContractState = {
  contract?: A_Contract;
  source: string;
  compile: {
    success: boolean;
    inProgress: boolean;
    completed: boolean;
    result: any;
    error: ContractCompileErrorPayload;
  };
};

const initialState: ContractState = {
  source: "",
  compile: {
    success: false,
    inProgress: false,
    result: null,
    completed: false,
    error: {
      msg: "",
      stack: "",
    },
  },
};

export const loadContract: AsyncThunk<
  A_Contract | undefined,
  { workspaceId: string; contractId: string },
  {}
> = createAsyncThunk(
  "contract/loadContract",
  async (
    { workspaceId, contractId }: { workspaceId: string; contractId: string },
    thunkAPI,
  ): Promise<A_Contract | undefined> => {
    const { dispatch } = thunkAPI;
    dispatch(resetContract());
    const contract = await new ContractClient().getByWorkspace(
      workspaceId,
      contractId,
    );
    dispatch(setContractSource(contract?.source || ""));
    return contract;
  },
);

export const updateContractSource: AsyncThunk<
  void,
  { contractId: string; source: string },
  {}
> = createAsyncThunk(
  "contract/updateContractSource",
  async (
    {
      contractId,
      source,
    }: {
      contractId: string;
      source: string;
    },
    thunkAPI,
  ): Promise<void> => {
    const { dispatch } = thunkAPI;
    await new ContractClient().updateSource(contractId, source);
    dispatch(setContractSource(source));
  },
);

export const contractSlice = createSlice({
  name: "contract",
  initialState: {
    ...initialState,
  },
  reducers: {
    resetContract: () => initialState,
    setContractSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    },
    startCompile: (state) => {
      state.compile = {
        ...initialState.compile,
        inProgress: true,
      };
    },
    successCompile: (state, action: PayloadAction<any>) => {
      state.compile = {
        ...state.compile,
        inProgress: false,
        success: true,
        completed: true,
        result: action.payload,
      };
    },
    failureCompile: (
      state,
      action: PayloadAction<ContractCompileErrorPayload>,
    ) => {
      state.compile = {
        ...state.compile,
        inProgress: false,
        success: false,
        completed: true,
        error: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadContract.fulfilled,
      (state, action: PayloadAction<A_Contract | undefined>) => {
        state.contract = action.payload;
      },
    );
  },
});

export const {
  setContractSource,
  resetContract,
  successCompile,
  failureCompile,
  startCompile,
} = contractSlice.actions;
export default contractSlice.reducer;
