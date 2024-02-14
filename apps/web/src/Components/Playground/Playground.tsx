import "./Playground.scss";
import { ReactElement, useState } from "react";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Redux/store";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Close, Done, UnfoldMore } from "@mui/icons-material";
import { theme } from "@repo/theme";
import { loadSelectedNode } from "../../Redux/network/nodesReducer";
import { TealCraft } from "@repo/tealcraft-sdk";
import AccountPicker from "../AccountPicker/AccountPicker";

interface PlaygroundProps {
  appSpec: AppSpec;
  onClose: () => void;
}

export function Playground({
  appSpec,
  onClose,
}: PlaygroundProps): ReactElement {
  const dispatch = useAppDispatch();
  const { nodes, selectedNode } = useSelector(
    (state: RootState) => state.nodes,
  );
  const [networkAnchorEl, setNetworkAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  return (
    <div className={"playground-wrapper"}>
      <div className={"playground-container"}>
        <div className="playground-header">
          <div className="title">Playground</div>
          <div className="actions">
            <div>
              <AccountPicker></AccountPicker>
            </div>
            <div>
              <Button
                color={"primary"}
                variant={"contained"}
                className="grey-button"
                endIcon={<UnfoldMore />}
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
            <div>
              <Close className="close hover" onClick={onClose}></Close>
            </div>
          </div>
        </div>
        <div className="playground-body"></div>
      </div>
    </div>
  );
}

export default Playground;
