import { ReactElement, useEffect } from "react";
import "./Workspace.scss";

import { Outlet, useParams } from "react-router-dom";
import WorkspaceSidebar from "./WorkspaceSidebar/WorkspaceSidebar";
import { useAppDispatch } from "../../Redux/store";
import { loadWorkspace } from "../../Redux/portal/workspaceReducer";

function Workspace(): ReactElement {
  const dispatch = useAppDispatch();

  const params = useParams();
  const { workspaceId } = params;

  useEffect(() => {
    if (workspaceId) {
      dispatch(loadWorkspace(workspaceId));
    }
  }, [workspaceId]);

  return (
    <div className="workspace-wrapper">
      <div className="workspace-container">
        <div className="workspace-sidebar">
          <WorkspaceSidebar></WorkspaceSidebar>
        </div>
        <div className="workspace-content">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
