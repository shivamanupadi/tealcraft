import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactElement } from "react";
import Portal from "../../Portal/Portal";
import Workspace from "../../Components/Workspace/Workspace";
import Contract from "../../Components/Workspace/Contract/Contract";

function AppRouter(): ReactElement {
  return (
    <HashRouter>
      <Routes>
        <Route path="/portal" element={<Portal></Portal>}>
          <Route
            path="workspace/:workspaceId"
            element={<Workspace></Workspace>}
          >
            <Route
              path="contract/:contractId"
              element={<Contract></Contract>}
            ></Route>
          </Route>
          <Route path="" element={<Navigate to="/portal" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;
