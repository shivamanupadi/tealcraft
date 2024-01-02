import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showSnack } from "./snackbarReducer";

export const handleException: AsyncThunk<void, any, {}> = createAsyncThunk(
  "exception/handleException",
  async (e: any, thunkAPI) => {
    console.log(e);
    let message = "";
    if (e?.response?.data?.message) {
      message = e.response.data.message;
    }

    thunkAPI.dispatch(
      showSnack({
        severity: "error",
        message: message || e.message,
      }),
    );
  },
);

export const exceptionSlice = createSlice({
  name: "exception",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(handleException.fulfilled, () => {});
  },
});

export default exceptionSlice.reducer;
