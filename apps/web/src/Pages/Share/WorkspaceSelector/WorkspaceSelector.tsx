import { ReactElement, useState } from "react";
import "./WorkspaceSelector.scss";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Done, KeyboardArrowDown } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { A_Workspace, CoreWorkspace } from "@repo/tealcraft-sdk";
import { theme } from "@repo/theme";

type WorkspaceSelectorProps = {
  onSelect: (workspace: A_Workspace) => void;
};

function WorkspaceSelector({ onSelect }: WorkspaceSelectorProps): ReactElement {
  const [workspaceAnchorEl, setWorkspaceAnchorEl] =
    useState<null | HTMLElement>(null);

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
          {workspace ? workspace.name : "--None--"}
        </Button>
        <Menu
          anchorEl={workspaceAnchorEl}
          open={Boolean(workspaceAnchorEl)}
          disableAutoFocusItem={true}
          onClose={() => {
            setWorkspaceAnchorEl(null);
          }}
        >
          {workspaces.map((eachWorkspace, index) => {
            const workspaceInstance = new CoreWorkspace(eachWorkspace);
            return (
              <MenuItem
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
                  <Typography color="text.primary">
                    {workspaceInstance.getName()}
                  </Typography>
                </ListItemText>
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </div>
  );
}

export default WorkspaceSelector;
