import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type AppState = {};
const initialState: AppState = {};

export const initApp: AsyncThunk<void, void, {}> = createAsyncThunk(
  "app/initApp",
  async () => {},
);

export const appSlice = createSlice({
  name: "app",
  initialState: {
    ...initialState,
  },
  reducers: {},
});

export default appSlice.reducer;
