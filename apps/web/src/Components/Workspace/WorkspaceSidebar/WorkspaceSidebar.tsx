import { ReactElement, useState } from "react";
import "./WorkspaceSidebar.scss";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import {
  AddCircleOutline,
  ChevronRight,
  ExpandMore,
  TextSnippet,
} from "@mui/icons-material";
import CreateContract from "../../CreateContract/CreateContract";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { loadContracts } from "../../../Redux/portal/workspaceReducer";
import { A_Contract, CoreContract, CoreWorkspace } from "@repo/tealcraft-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { treeStyles } from "@repo/theme";
import { Tooltip } from "@mui/material";

function getContractNodeId(contractId: string | undefined): string {
  return `contract-${contractId}`;
}

function WorkspaceSidebar(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { workspace, contracts } = useSelector(
    (state: RootState) => state.workspace,
  );

  const params = useParams();
  const { contractId } = params;

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
            selected={getContractNodeId(contractId)}
            multiSelect={false}
            sx={treeStyles}
          >
            <TreeItem
              nodeId="contracts"
              label={
                <div className="contracts-header">
                  <div>Contracts</div>
                  <div>
                    <Tooltip title="Create contract">
                      <AddCircleOutline
                        onClick={(e) => {
                          setContractCreationVisibility(true);
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      ></AddCircleOutline>
                    </Tooltip>
                  </div>
                </div>
              }
            >
              {contracts.map((contract) => {
                const contractInstance = new CoreContract(contract);
                let workspaceInstance: CoreWorkspace;
                if (workspace) {
                  workspaceInstance = new CoreWorkspace(workspace);
                }
                return (
                  <TreeItem
                    icon={<TextSnippet></TextSnippet>}
                    className="indent"
                    key={getContractNodeId(contractInstance.getId())}
                    nodeId={getContractNodeId(contractInstance.getId())}
                    label={contractInstance.getNameWithExtension()}
                    onClick={() => {
                      navigate(
                        `/portal/workspace/${workspaceInstance.getId()}/contract/${contractInstance.getId()}`,
                      );
                    }}
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
            onSuccess={(contract: A_Contract) => {
              setContractCreationVisibility(false);
              dispatch(loadContracts(workspace));
              navigate(
                `/portal/workspace/${workspace.id}/contract/${contract.id}`,
              );
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
