import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import appReducer from "./app/appReducer";
import portalReducer from "./portal/portalReducer";
import workspaceReducer from "./portal/workspaceReducer";
import contractReducer from "./portal/contractReducer";
import compilerReducer from "./portal/compilerReducer";
import nodesReducer from "./network/nodesReducer";
import accountReducer from "./portal/accountReducer";

export const store = configureStore({
  reducer: {
    app: appReducer,
    portal: portalReducer,
    workspace: workspaceReducer,
    contract: contractReducer,
    compiler: compilerReducer,
    nodes: nodesReducer,
    accounts: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
