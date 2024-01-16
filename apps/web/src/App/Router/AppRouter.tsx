import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactElement } from "react";
import Portal from "../../Pages/Portal/Portal";
import Workspace from "../../Pages/Workspace/Workspace";
import Contract from "../../Pages/Contract/Contract";
import Share from "../../Pages/Share/Share";
import ShareContract from "../../Components/ShareContract/ShareContract";
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

        <Route path="/share" element={<Share></Share>}>
          <Route
            path="contract/:fiddleId"
            element={<ShareContract></ShareContract>}
          ></Route>
        </Route>
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;
