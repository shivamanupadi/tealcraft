import { ReactElement, useState } from "react";
import "./ContractHeader.scss";
import { Button, Tooltip } from "@mui/material";
import { Edit, PlayArrow } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../Redux/store";
import { CoreContract, TealCraftCompiler } from "@repo/tealcraft-sdk";
import { useLoader } from "@repo/ui";
import {
  failureCompile,
  loadContract,
  startCompile,
  successCompile,
} from "../../../../Redux/portal/contractReducer";
import { downloadFile, getExceptionMsg } from "@repo/utils";
import { theme } from "@repo/theme";
import { loadContracts } from "../../../../Redux/portal/workspaceReducer";
import RenameContract from "./RenameContract/RenameContract";

const ActionButtonSx = { background: theme.palette.common.white };

function ContractHeader(): ReactElement {
  const dispatch = useAppDispatch();
  const { showLoader, hideLoader } = useLoader();
  const { contract, source } = useSelector(
    (state: RootState) => state.contract,
  );

  const { workspace } = useSelector((state: RootState) => state.workspace);

  const [isContractRenameVisible, setContractRenameVisibility] =
    useState<boolean>(false);

  return (
    <div className="contract-header-wrapper">
      <div className="contract-header-container">
        <div className="contract-name-container">
          {contract ? (
            <div className="contract-name">
              <div>{new CoreContract(contract).getNameWithExtension()}</div>
              <div>
                <Tooltip title="Rename contract">
                  <Edit
                    className="edit-name hover"
                    onClick={() => {
                      setContractRenameVisibility(true);
                    }}
                  ></Edit>
                </Tooltip>

                {workspace ? (
                  <RenameContract
                    show={isContractRenameVisible}
                    onClose={() => {
                      setContractRenameVisibility(false);
                    }}
                    onSuccess={() => {
                      setContractRenameVisibility(false);
                      dispatch(loadContracts(workspace));
                      dispatch(
                        loadContract({
                          workspaceId: workspace.id,
                          contractId: contract.id,
                        }),
                      );
                    }}
                    workspace={workspace}
                    contract={contract}
                  ></RenameContract>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="contract-actions">
          <div className="compiler">
            compiler : v{new TealCraftCompiler().getTealScriptVersion()}
          </div>
          <div>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              className="small-button"
              sx={ActionButtonSx}
              onClick={async () => {
                if (contract) {
                  downloadFile(
                    source,
                    new CoreContract(contract).getNameWithExtension(),
                  );
                }
              }}
            >
              Download
            </Button>
          </div>
          <div>
            <Button
              startIcon={<PlayArrow fontSize={"small"}></PlayArrow>}
              variant={"outlined"}
              color={"secondary"}
              size={"small"}
              className="small-button"
              sx={ActionButtonSx}
              onClick={async () => {
                if (contract) {
                  try {
                    showLoader("Compiling contract ...");
                    dispatch(startCompile());
                    const compiler = await new TealCraftCompiler().compile({
                      ...contract,
                      source,
                    });
                    dispatch(successCompile(compiler));
                    hideLoader();
                  } catch (e: any) {
                    hideLoader();
                    dispatch(
                      failureCompile({
                        msg: getExceptionMsg(e),
                        stack: e.stack,
                      }),
                    );
                  }
                }
              }}
            >
              Compile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractHeader;
