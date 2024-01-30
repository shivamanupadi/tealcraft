import { ReactElement, useEffect, useState } from "react";
import "./WorkspacePicker.scss";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { DeleteOutlined, Done, UnfoldMore } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Redux/store";
import {
  A_Workspace,
  CoreWorkspace,
  TealCraft,
  WorkspaceClient,
} from "@repo/tealcraft-sdk";
import CreateWorkspace from "../CreateWorkspace/CreateWorkspace";
import { loadWorkspaces } from "../../Redux/portal/portalReducer";
import { useConfirm } from "material-ui-confirm";
import { BaseColors, confirmationProps, GreyColors } from "@repo/theme";
import { useLoader, useSnackbar } from "@repo/ui";
import { useNavigate, useParams } from "react-router-dom";

export const workspacesMenu = {
  ".MuiPaper-root": {
    boxShadow:
      "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important",
  },
};

export const workspaceItem = {
  fontSize: "14px",
  color: GreyColors.FormLabel,
  svg: {},
};

function WorkspacePicker(): ReactElement {
  const dispatch = useAppDispatch();
  const confirmation = useConfirm();
  const navigate = useNavigate();

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();

  const [workspaceAnchorEl, setWorkspaceAnchorEl] =
    useState<null | HTMLElement>(null);
  const [isWorkspaceCreationVisible, setWorkspaceCreationVisibility] =
    useState<boolean>(false);

  const [currentWorkspace, setCurrentWorkspace] = useState<null | A_Workspace>(
    null,
  );

  const { workspaces } = useSelector((state: RootState) => state.portal);

  const params = useParams();
  const { workspaceId } = params;

  useEffect(() => {
    if (workspaceId) {
      const workspace = workspaces.find((workspace) => {
        return workspace.id === workspaceId;
      });
      setCurrentWorkspace(workspace || null);
      if (workspace) {
        new TealCraft().saveWorkspaceId(workspace.id);
      }
    } else {
      setCurrentWorkspace(null);
    }
  }, [workspaceId, workspaces]);

  return (
    <div className="workspace-picker-wrapper">
      <div className="workspace-picker-container">
        <Button
          color={"primary"}
          variant={"contained"}
          className="grey-button"
          endIcon={<UnfoldMore />}
          onClick={(ev) => {
            setWorkspaceAnchorEl(ev.currentTarget);
          }}
        >
          {currentWorkspace ? (
            <div className="current-workspace">
              <div>
                <img
                  src={new CoreWorkspace(currentWorkspace).getLogo()}
                  alt="workspace-logo"
                />
              </div>
              <div>{currentWorkspace.name}</div>
            </div>
          ) : (
            "Select workspace"
          )}
        </Button>
        <Menu
          anchorEl={workspaceAnchorEl}
          open={Boolean(workspaceAnchorEl)}
          disableAutoFocusItem={true}
          onClose={() => {
            setWorkspaceAnchorEl(null);
          }}
          className="workspaces-list"
          sx={workspacesMenu}
        >
          {workspaces.map((workspace, index) => {
            const workspaceInstance = new CoreWorkspace(workspace);
            return (
              <MenuItem
                key={`${workspaceInstance.getId()}-${index}`}
                sx={workspaceItem}
                selected={false}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setWorkspaceAnchorEl(null);
                  new TealCraft().saveWorkspaceId(workspaceInstance.getId());
                  navigate(`/portal/workspace/${workspaceInstance.getId()}`);
                }}
              >
                {currentWorkspace ? (
                  <ListItemIcon>
                    {currentWorkspace.id === workspace.id ? (
                      <Done fontSize="small" sx={{ color: BaseColors.Black }} />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                ) : (
                  ""
                )}
                <ListItemText>
                  <div className="workspace-picker-name">
                    <div>
                      <img
                        src={new CoreWorkspace(workspace).getLogo()}
                        alt="workspace-logo"
                      />
                    </div>
                    <div>{workspaceInstance.getName()}</div>
                  </div>
                </ListItemText>

                <DeleteOutlined
                  fontSize="small"
                  color={"error"}
                  sx={{ marginLeft: "15px" }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setWorkspaceAnchorEl(null);

                    confirmation({
                      ...confirmationProps,
                      description: `You are trying to delete the workspace - ${workspace.name}. All the associated contracts will be deleted.`,
                    })
                      .then(async () => {
                        try {
                          showLoader("Deleting workspace...");
                          await new WorkspaceClient().delete(workspace.id);
                          hideLoader();
                          showSnack("Workspace deleted", "success");
                          dispatch(loadWorkspaces());
                          if (workspace.id === currentWorkspace?.id) {
                            setCurrentWorkspace(null);
                            new TealCraft().removeWorkspaceId();
                            navigate("/portal");
                          }
                        } catch (e) {
                          hideLoader();
                          showException(e);
                        }
                      })
                      .catch(() => {});
                  }}
                />
              </MenuItem>
            );
          })}

          <MenuItem
            sx={{ marginTop: "10px", "&:hover": { background: "none" } }}
            selected={false}
          >
            <Button
              color={"primary"}
              variant={"contained"}
              size={"small"}
              fullWidth
              onClick={async () => {
                setWorkspaceAnchorEl(null);
                setWorkspaceCreationVisibility(true);
              }}
            >
              Create workspace
            </Button>
          </MenuItem>
        </Menu>

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
  );
}

export default WorkspacePicker;
