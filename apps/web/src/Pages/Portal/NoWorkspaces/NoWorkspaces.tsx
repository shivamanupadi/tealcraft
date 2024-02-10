import { ReactElement, useState } from "react";
import "./NoWorkspaces.scss";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { loadWorkspaces } from "../../../Redux/portal/portalReducer";
import { useNavigate } from "react-router-dom";
import { A_Workspace, ContractClient, TealCraft } from "@repo/tealcraft-sdk";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import CreateWorkspace from "../../../Components/CreateWorkspace/CreateWorkspace";
import noWorkspacesImg from "../../../assets/images/no-workspaces.png";
import { confirmationProps } from "@repo/theme";
import { useConfirm } from "material-ui-confirm";
import { useLoader, useSnackbar } from "@repo/ui";

function NoWorkspaces(): ReactElement {
  const confirmation = useConfirm();
  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();
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
              <div className="actions">
                <div>
                  <Button
                    variant={"outlined"}
                    color={"secondary"}
                    onClick={async () => {
                      confirmation({
                        ...confirmationProps,
                        description: `One TealScript and one Puya workspace with preloaded contracts will be created.`,
                      })
                        .then(async () => {
                          try {
                            showLoader("Creating demo workspace...");
                            const workspaceId =
                              await new TealCraft().loadDemoData();
                            hideLoader();

                            showSnack(
                              "Demo workspace created successfully",
                              "success",
                            );
                            dispatch(loadWorkspaces());

                            new TealCraft().saveWorkspaceId(workspaceId);
                            const contracts =
                              await new ContractClient().findByWorkspace(
                                workspaceId,
                              );
                            if (contracts && contracts.length > 0) {
                              navigate(
                                `/portal/workspace/${workspaceId}/contract/${contracts[0]?.id}`,
                              );
                            } else {
                              navigate(`/portal/workspace/${workspaceId}`);
                            }
                          } catch (e) {
                            hideLoader();
                            showException(e);
                          }
                        })
                        .catch(() => {});
                    }}
                  >
                    Demo workspaces
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
                <div>
                  <Button
                    variant={"contained"}
                    onClick={() => {
                      setWorkspaceCreationVisibility(true);
                    }}
                  >
                    Create workspace
                  </Button>
                </div>
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
