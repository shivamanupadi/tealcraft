import { ReactElement, useState } from "react";
import "./NoWorkspaces.scss";
import { RootState, useAppDispatch } from "../../Redux/store";
import { loadWorkspaces } from "../../Redux/portal/portalReducer";
import { useNavigate } from "react-router-dom";
import { A_Workspace, TealCraft } from "@repo/tealcraft-sdk";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import CreateWorkspace from "../../Components/CreateWorkspace/CreateWorkspace";
import noWorkspacesImg from "../../assets/images/no-workspaces.png";

function NoWorkspaces(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { workspaces, loadingWorkspaces } = useSelector(
    (state: RootState) => state.portal,
  );
  const [isWorkspaceCreationVisible, setWorkspaceCreationVisibility] =
    useState<boolean>(false);

  return (
    <div className="no-workspaces-wrapper">
      <div className="no-workspaces-container">
        <div className="no-workspaces">
          {workspaces.length === 0 && !loadingWorkspaces ? (
            <div>
              <div>
                <img src={noWorkspacesImg} alt="no-workspaces" />
              </div>
              <div className="info">
                <div>Looks like you don't have any workspaces.</div>
                <div>Create a new workspace to get started.</div>
              </div>
              <div>
                <Button
                  variant={"contained"}
                  onClick={() => {
                    setWorkspaceCreationVisibility(true);
                  }}
                >
                  Create workspace
                </Button>
                <CreateWorkspace
                  show={isWorkspaceCreationVisible}
                  onClose={() => {
                    setWorkspaceCreationVisibility(false);
                  }}
                  onSuccess={(workspace: A_Workspace) => {
                    setWorkspaceCreationVisibility(false);
                    dispatch(loadWorkspaces());
                    new TealCraft().saveWorkspaceId(workspace.id);
                    navigate(`/portal/workspace/${workspace.id}`);
                  }}
                ></CreateWorkspace>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default NoWorkspaces;
