import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import appReducer from "./app/appReducer";
import portalReducer from "./portal/portalReducer";
import snackbarReducer from "./app/snackbarReducer";
import exceptionReducer from "./app/exceptionReducer";

export const store = configureStore({
  reducer: {
    app: appReducer,
    portal: portalReducer,
    snackbar: snackbarReducer,
    exception: exceptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
