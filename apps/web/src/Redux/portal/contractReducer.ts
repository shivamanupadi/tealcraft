import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { A_Contract, ContractClient } from "@repo/tealcraft-sdk";

export type ContractState = {
  contract?: A_Contract;
};

const initialState: ContractState = {};

export const loadContract: AsyncThunk<A_Contract | undefined, string, {}> =
  createAsyncThunk(
    "contract/loadContract",
    async (contractId: string): Promise<A_Contract | undefined> => {
      return await new ContractClient().get(contractId);
    },
  );

export const contractSlice = createSlice({
  name: "contract",
  initialState: {
    ...initialState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loadContract.fulfilled,
      (state, action: PayloadAction<A_Contract | undefined>) => {
        if (action.payload) {
          state.contract = action.payload;
        }
      },
    );
  },
});

export default contractSlice.reducer;
