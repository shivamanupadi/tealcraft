import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { A_Account, AccountClient, TealCraft } from "@repo/tealcraft-sdk";

export type AccountsState = {
  accounts: A_Account[];
  selectedAccount: A_Account | undefined;
};

const initialState: AccountsState = {
  accounts: [],
  selectedAccount: undefined,
};

export const loadAccounts: AsyncThunk<A_Account[], void, {}> = createAsyncThunk(
  "accounts/loadAccounts",
  async (_, thunkAPI): Promise<A_Account[]> => {
    const { dispatch } = thunkAPI;
    dispatch(loadSelectedAccount());
    return new AccountClient().findAll();
  },
);

export const loadSelectedAccount: AsyncThunk<A_Account | undefined, void, {}> =
  createAsyncThunk("accounts/loadSelectedAccount", async () => {
    const accountId = new TealCraft().getAccountId();
    if (accountId) {
      return await new AccountClient().get(accountId);
    }
  });

export const accountsSlice = createSlice({
  name: "accounts",
  initialState: {
    ...initialState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loadAccounts.fulfilled,
      (state, action: PayloadAction<A_Account[]>) => {
        if (action.payload) {
          state.accounts = action.payload;
        }
      },
    );
    builder.addCase(
      loadSelectedAccount.fulfilled,
      (state, action: PayloadAction<A_Account | undefined>) => {
        state.selectedAccount = action.payload || undefined;
      },
    );
  },
});

export default accountsSlice.reducer;
