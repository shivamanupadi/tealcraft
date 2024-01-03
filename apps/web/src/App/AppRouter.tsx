import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactElement } from "react";
import Portal from "../Portal/Portal";

function AppRouter(): ReactElement {
  return (
    <HashRouter>
      <Routes>
        <Route path="/portal" element={<Portal></Portal>}>
          <Route path="workspace/:id" element={<div>workspace</div>}></Route>
          <Route path="" element={<Navigate to="/portal" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;
