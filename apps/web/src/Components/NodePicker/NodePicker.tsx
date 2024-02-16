import { ReactElement, useState } from "react";
import "./NodePicker.scss";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Done, UnfoldMore } from "@mui/icons-material";
import { TealCraft } from "@repo/tealcraft-sdk";
import { loadSelectedNode } from "../../Redux/network/nodesReducer";
import { BaseColors, theme } from "@repo/theme";
import { RootState, useAppDispatch } from "../../Redux/store";
import { useSelector } from "react-redux";

interface NodePickerProps {
  onPick: () => void;
}

function NodePicker({ onPick }: NodePickerProps): ReactElement {
  const dispatch = useAppDispatch();
  const { nodes, selectedNode } = useSelector(
    (state: RootState) => state.nodes,
  );
  const [networkAnchorEl, setNetworkAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  return (
    <div className="node-picker-wrapper">
      <div className="node-picker-container">
        <Button
          color={"primary"}
          variant={"outlined"}
          size={"small"}
          endIcon={<UnfoldMore />}
          sx={{ background: BaseColors.White }}
          onClick={(ev) => {
            setNetworkAnchorEl(ev.currentTarget);
          }}
        >
          {selectedNode ? (
            <div className="current-workspace">
              <div>{selectedNode.label}</div>
            </div>
          ) : (
            "Select network"
          )}
        </Button>

        <Menu
          anchorEl={networkAnchorEl}
          open={Boolean(networkAnchorEl)}
          disableAutoFocusItem={true}
          className="classic-menu"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={() => {
            setNetworkAnchorEl(null);
          }}
        >
          {nodes.map((node, index) => {
            return (
              <MenuItem
                key={`${node.id}-${index}`}
                selected={false}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setNetworkAnchorEl(null);
                  new TealCraft().saveNodeId(node.id);
                  dispatch(loadSelectedNode());
                  onPick();
                }}
              >
                {selectedNode ? (
                  <ListItemIcon>
                    {selectedNode.id === node.id ? (
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
                <ListItemText>{node.label}</ListItemText>
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </div>
  );
}

export default NodePicker;
