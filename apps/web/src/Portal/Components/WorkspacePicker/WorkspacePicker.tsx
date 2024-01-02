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
import { CoreWorkspace } from "@repo/tealcraft-sdk";
import CreateWorkspace from "../CreateWorkspace/CreateWorkspace";
import { loadWorkspaces } from "../../../Redux/portal/portalReducer";

function WorkspacePicker(): ReactElement {
  const dispatch = useAppDispatch();

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
                key={`${workspaceInstance.getName()}-${index}`}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
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
          onSuccess={(workspace) => {
            setWorkspaceCreationVisibility(false);
            console.log(workspace);
            dispatch(loadWorkspaces());
          }}
        ></CreateWorkspace>
      </div>
    </div>
  );
}

export default WorkspacePicker;
