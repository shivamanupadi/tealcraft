import { ReactElement, useState } from "react";
import "./WorkspaceSidebar.scss";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import { Add, ChevronRight, ExpandMore } from "@mui/icons-material";
import CreateContract from "../../CreateContract/CreateContract";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { loadContracts } from "../../../Redux/portal/workspaceReducer";

function WorkspaceSidebar(): ReactElement {
  const dispatch = useAppDispatch();

  const { workspace, contracts } = useSelector(
    (state: RootState) => state.workspace,
  );

  const [isContractCreationVisible, setContractCreationVisibility] =
    useState<boolean>(false);

  return (
    <div className="workspace-sidebar-wrapper">
      <div className="workspace-sidebar-container">
        <div className="workspace-menu">
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            defaultExpanded={["contracts"]}
          >
            <TreeItem
              nodeId="contracts"
              label={
                <div className="contracts-header">
                  <div>Contracts</div>
                  <div>
                    <Add
                      fontSize={"small"}
                      onClick={(e) => {
                        setContractCreationVisibility(true);
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    ></Add>
                  </div>
                </div>
              }
            >
              {contracts.map((contract) => {
                return (
                  <TreeItem
                    key={`contract-${contract.id}`}
                    nodeId={`contract-${contract.id}`}
                    label={contract.name}
                  ></TreeItem>
                );
              })}
            </TreeItem>
          </TreeView>
        </div>

        {workspace ? (
          <CreateContract
            show={isContractCreationVisible}
            onClose={() => {
              setContractCreationVisibility(false);
            }}
            onSuccess={() => {
              setContractCreationVisibility(false);
              dispatch(loadContracts(workspace));
            }}
            workspace={workspace}
          ></CreateContract>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default WorkspaceSidebar;
