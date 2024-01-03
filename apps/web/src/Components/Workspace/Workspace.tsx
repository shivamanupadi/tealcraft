import { ReactElement, useEffect, useState } from "react";
import "./Workspace.scss";
import { A_Workspace, WorkspaceClient } from "@repo/tealcraft-sdk";
import { useParams } from "react-router-dom";

function Workspace(): ReactElement {
  const params = useParams();
  const { workspaceId } = params;

  const [workspace, setWorkspace] = useState<null | A_Workspace>(null);

  async function loadWorkspace(workspaceId: string) {
    const workspace = await new WorkspaceClient().get(workspaceId);
    setWorkspace(workspace || null);
  }

  useEffect(() => {
    loadWorkspace(workspaceId || "");
  }, [workspaceId]);

  return (
    <div className="workspace-wrapper">
      <div className="workspace-container">{workspace?.name}</div>
    </div>
  );
}

export default Workspace;
