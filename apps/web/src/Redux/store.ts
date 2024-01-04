import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import appReducer from "./app/appReducer";
import portalReducer from "./portal/portalReducer";
import workspaceReducer from "./portal/workspaceReducer";
import contractReducer from "./portal/contractReducer";

export const store = configureStore({
  reducer: {
    app: appReducer,
    portal: portalReducer,
    workspace: workspaceReducer,
    contract: contractReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
