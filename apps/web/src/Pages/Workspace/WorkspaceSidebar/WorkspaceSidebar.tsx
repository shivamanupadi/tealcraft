import { ReactElement, useState } from "react";
import "./WorkspaceSidebar.scss";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import {
  AddCircleOutline,
  ChevronRight,
  DeleteOutlined,
  ExpandMore,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { loadContracts } from "../../../Redux/portal/workspaceReducer";
import {
  A_Contract,
  ContractClient,
  CoreContract,
  CoreWorkspace,
} from "@repo/tealcraft-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { confirmationProps, treeStyles } from "@repo/theme";
import { Tooltip } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useLoader, useSnackbar } from "@repo/ui";
import { resetContract } from "../../../Redux/portal/contractReducer";
import CreateContract from "../../../Components/CreateContract/CreateContract";

function getContractNodeId(contractId: string | undefined): string {
  return `contract-${contractId}`;
}

function WorkspaceSidebar(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const confirmation = useConfirm();

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();

  const { workspace, contracts } = useSelector(
    (state: RootState) => state.workspace,
  );

  const { contract: currentContract } = useSelector(
    (state: RootState) => state.contract,
  );

  const params = useParams();
  const { contractId } = params;

  const [isContractCreationVisible, setContractCreationVisibility] =
    useState<boolean>(false);

  return (
    <div className="workspace-sidebar-wrapper">
      <div className="workspace-sidebar-container">
        <div className="workspace-menu">
          {workspace ? (
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
                          sx={{ marginTop: "5px" }}
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
                {contracts.length === 0 ? (
                  <div className="no-contracts">
                    <div>
                      There are no contracts in this workspace. Create your
                      first contract.
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {contracts.map((contract) => {
                  const contractInstance = new CoreContract(contract);
                  let workspaceInstance: CoreWorkspace;
                  if (workspace) {
                    workspaceInstance = new CoreWorkspace(workspace);
                  }
                  return (
                    <TreeItem
                      icon={
                        <div className="contract-icons">
                          <DeleteOutlined
                            className="contract-icon delete"
                            fontSize={"small"}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              confirmation({
                                ...confirmationProps,
                                description: `You are trying to delete the contract - ${contract.name}.`,
                              })
                                .then(async () => {
                                  try {
                                    showLoader("Deleting contract...");
                                    await new ContractClient().delete(
                                      contract.id,
                                    );
                                    hideLoader();
                                    showSnack("Contract deleted", "success");
                                    if (workspace) {
                                      dispatch(loadContracts(workspace));
                                    }

                                    if (currentContract) {
                                      if (contract.id === currentContract.id) {
                                        dispatch(resetContract());
                                        navigate(
                                          `/portal/workspace/${workspace?.id}`,
                                        );
                                      }
                                    }
                                  } catch (e) {
                                    hideLoader();
                                    showException(e);
                                  }
                                })
                                .catch(() => {});
                            }}
                          ></DeleteOutlined>
                          <TextSnippetOutlined
                            fontSize={"small"}
                            className="contract-icon"
                          ></TextSnippetOutlined>
                        </div>
                      }
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
          ) : (
            ""
          )}
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
