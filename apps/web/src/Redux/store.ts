import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import appReducer from "./app/appReducer";
import portalReducer from "./portal/portalReducer";

export const store = configureStore({
  reducer: {
    app: appReducer,
    portal: portalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
