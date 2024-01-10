import { ReactElement, useEffect, useState } from "react";
import "./Portal.scss";
import Header from "../Components/Header/Header";
import { RootState, useAppDispatch } from "../Redux/store";
import { initPortal, loadWorkspaces } from "../Redux/portal/portalReducer";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { A_Workspace, TealCraft } from "@repo/tealcraft-sdk";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import CreateWorkspace from "../Components/CreateWorkspace/CreateWorkspace";
import noWorkspacesImg from "../assets/images/no-workspaces.png";

function Portal(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const params = useParams();
  const { workspaceId } = params;

  const { workspaces, loadingWorkspaces } = useSelector(
    (state: RootState) => state.portal,
  );
  const [isWorkspaceCreationVisible, setWorkspaceCreationVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    dispatch(initPortal());
  }, []);

  useEffect(() => {
    const id = new TealCraft().getWorkspaceId();
    if (id && !workspaceId) {
      navigate(`/portal/workspace/${id}`);
    }
  }, []);

  return (
    <div className="portal-wrapper">
      <div className="portal-container">
        <Header></Header>
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
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default Portal;
