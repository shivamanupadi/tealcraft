import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { A_Workspace, TealCraftCompiler } from "@repo/tealcraft-sdk";
import { API_COMPILER_URL } from "../../constants";

export type CompilerState = {
  version: string;
};

const initialState: CompilerState = {
  version: "",
};

export const loadVersion: AsyncThunk<string, A_Workspace, {}> =
  createAsyncThunk(
    "compiler/loadVersion",
    async (workspace: A_Workspace, thunkAPI): Promise<string> => {
      const { dispatch } = thunkAPI;
      dispatch(resetCompiler());
      return await new TealCraftCompiler().getCompilerVersion(workspace, {
        compilerUrl: API_COMPILER_URL,
      });
    },
  );

export const compilerSlice = createSlice({
  name: "workspace",
  initialState: {
    ...initialState,
  },
  reducers: {
    resetCompiler: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadVersion.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.version = action.payload;
      },
    );
  },
});

export const { resetCompiler } = compilerSlice.actions;
export default compilerSlice.reducer;
