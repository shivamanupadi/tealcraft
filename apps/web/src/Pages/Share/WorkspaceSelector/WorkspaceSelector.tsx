import { ReactElement, useState } from "react";
import "./WorkspaceSelector.scss";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Done, KeyboardArrowDown } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { A_Workspace, CoreWorkspace } from "@repo/tealcraft-sdk";
import { theme } from "@repo/theme";
import {
  workspaceItem,
  workspacesMenu,
} from "../../../Components/WorkspacePicker/WorkspacePicker";
import { loadWorkspaces } from "../../../Redux/portal/portalReducer";
import CreateWorkspace from "../../../Components/CreateWorkspace/CreateWorkspace";

type WorkspaceSelectorProps = {
  onSelect: (workspace: A_Workspace) => void;
};

function WorkspaceSelector({ onSelect }: WorkspaceSelectorProps): ReactElement {
  const dispatch = useAppDispatch();
  const [workspaceAnchorEl, setWorkspaceAnchorEl] =
    useState<null | HTMLElement>(null);
  const [isWorkspaceCreationVisible, setWorkspaceCreationVisibility] =
    useState<boolean>(false);

  const [workspace, setWorkspace] = useState<null | A_Workspace>(null);
  const { workspaces } = useSelector((state: RootState) => state.portal);

  return (
    <div className="workspace-selector-wrapper">
      <div className="workspace-selector-container">
        <Button
          color={"primary"}
          variant={"contained"}
          className="grey-button"
          endIcon={<KeyboardArrowDown />}
          onClick={(ev) => {
            setWorkspaceAnchorEl(ev.currentTarget);
          }}
        >
          {workspace ? (
            <div className="selected-workspace">
              <div>
                <img
                  src={new CoreWorkspace(workspace).getLogo()}
                  alt="workspace-logo"
                />
              </div>
              <div>{workspace.name}</div>
            </div>
          ) : (
            "--None--"
          )}
        </Button>
        <Menu
          anchorEl={workspaceAnchorEl}
          open={Boolean(workspaceAnchorEl)}
          disableAutoFocusItem={true}
          sx={workspacesMenu}
          onClose={() => {
            setWorkspaceAnchorEl(null);
          }}
        >
          {workspaces.map((eachWorkspace, index) => {
            const workspaceInstance = new CoreWorkspace(eachWorkspace);
            return (
              <MenuItem
                sx={workspaceItem}
                key={`${workspaceInstance.getId()}-${index}`}
                selected={false}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setWorkspaceAnchorEl(null);
                  setWorkspace(eachWorkspace);
                  onSelect(eachWorkspace);
                }}
              >
                {workspace ? (
                  <ListItemIcon>
                    {workspace.id === eachWorkspace.id ? (
                      <Done
                        fontSize="small"
                        sx={{ color: theme.palette.common.black }}
                      />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                ) : (
                  ""
                )}
                <ListItemText>
                  <div className="workspace-selector-name">
                    <div>
                      <img
                        src={workspaceInstance.getLogo()}
                        alt="workspace-logo"
                      />
                    </div>
                    <div>{workspaceInstance.getName()}</div>
                  </div>
                </ListItemText>
              </MenuItem>
            );
          })}

          <MenuItem
            sx={{
              marginTop: "10px",
              marginBottom: "5px",
              "&:hover": { background: "none" },
            }}
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
      </div>

      <CreateWorkspace
        show={isWorkspaceCreationVisible}
        onClose={() => {
          setWorkspaceCreationVisibility(false);
        }}
        onSuccess={(workspace: A_Workspace) => {
          setWorkspaceCreationVisibility(false);
          dispatch(loadWorkspaces());
          setWorkspace(workspace);
          onSelect(workspace);
        }}
      ></CreateWorkspace>
    </div>
  );
}

export default WorkspaceSelector;
