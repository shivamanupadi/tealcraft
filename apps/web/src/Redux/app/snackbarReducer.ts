import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertColor } from "@mui/material";

const defaultDuration = 5000;

export type SnackbarPayload = {
  message: string;
  severity: AlertColor;
  duration?: number;
};

export type SnackbarState = {
  show: boolean;
  message: string;
  severity: AlertColor;
  duration: number;
};

const initialState: SnackbarState = {
  show: false,
  message: "",
  severity: "info",
  duration: defaultDuration,
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnack: (state, action: PayloadAction<SnackbarPayload>) => {
      state.show = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.duration = action.payload.duration || defaultDuration;
    },
    hideSnack: (state) => {
      state.show = false;
      state.message = "";
    },
  },
});

export const { showSnack, hideSnack } = snackbarSlice.actions;
export default snackbarSlice.reducer;
