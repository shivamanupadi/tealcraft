import { ReactElement, useState } from "react";
import "./WorkspacePicker.scss";
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { DeleteOutlined, UnfoldMore } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { CoreWorkspace, WorkspaceClient } from "@repo/tealcraft-sdk";
import CreateWorkspace from "../CreateWorkspace/CreateWorkspace";
import { loadWorkspaces } from "../../../Redux/portal/portalReducer";
import { useConfirm } from "material-ui-confirm";
import { confirmationProps } from "@repo/theme";
import { useLoader } from "../../../hooks/Loader/Loader";
import { useSnackbar } from "../../../hooks/Snackbar/Snackbar";

function WorkspacePicker(): ReactElement {
  const dispatch = useAppDispatch();
  const confirmation = useConfirm();

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();
  const [workspaceAnchorEl, setWorkspaceAnchorEl] =
    useState<null | HTMLElement>(null);
  const [isWorkspaceCreationVisible, setWorkspaceCreationVisibility] =
    useState<boolean>(false);

  const { workspaces } = useSelector((state: RootState) => state.portal);

  return (
    <div className="workspace-picker-wrapper">
      <div className="workspace-picker-container">
        <Button
          color={"primary"}
          variant={"contained"}
          className="grey-button"
          size={"small"}
          endIcon={<UnfoldMore />}
          onClick={(ev) => {
            setWorkspaceAnchorEl(ev.currentTarget);
          }}
        >
          Select workspace
        </Button>
        <Menu
          anchorEl={workspaceAnchorEl}
          open={Boolean(workspaceAnchorEl)}
          disableAutoFocusItem={true}
          onClose={() => {
            setWorkspaceAnchorEl(null);
          }}
        >
          {workspaces.map((workspace, index) => {
            const workspaceInstance = new CoreWorkspace(workspace);
            return (
              <MenuItem
                key={`${workspaceInstance.getId()}-${index}`}
                selected={false}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <ListItemText>
                  <Typography color="text.primary">
                    {workspaceInstance.getName()}
                  </Typography>
                </ListItemText>

                <DeleteOutlined
                  fontSize="small"
                  color={"error"}
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    confirmation({
                      ...confirmationProps,
                      description: `You are trying to delete the workspace - ${workspace.name}`,
                    })
                      .then(async () => {
                        try {
                          showLoader("Deleting workspace...");
                          await new WorkspaceClient().delete(workspace.id);
                          hideLoader();
                          showSnack("Workspace deleted", "success");
                          dispatch(loadWorkspaces());
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
          onSuccess={() => {
            setWorkspaceCreationVisibility(false);
            dispatch(loadWorkspaces());
          }}
        ></CreateWorkspace>
      </div>
    </div>
  );
}

export default WorkspacePicker;
