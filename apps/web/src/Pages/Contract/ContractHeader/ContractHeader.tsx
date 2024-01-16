import { ReactElement, useState } from "react";
import "./ContractHeader.scss";
import { Button, Tooltip } from "@mui/material";
import { Edit, PlayArrow } from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  ContractFiddleClient,
  CoreContract,
  CoreContractFiddle,
  TealCraftCompiler,
} from "@repo/tealcraft-sdk";
import { useLoader, useSnackbar } from "@repo/ui";
import { downloadFile, getExceptionMsg } from "@repo/utils";
import RenameContract from "./RenameContract/RenameContract";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { loadContracts } from "../../../Redux/portal/workspaceReducer";
import {
  failureCompile,
  loadContract,
  startCompile,
  successCompile,
} from "../../../Redux/portal/contractReducer";
import { REACT_APP_API_URL } from "../../../env";
import FiddleUrl from "../../../Components/FiddleUrl/FiddleUrl";

function ContractHeader(): ReactElement {
  const dispatch = useAppDispatch();
  const { showLoader, hideLoader } = useLoader();
  const { showException } = useSnackbar();
  const { contract, source } = useSelector(
    (state: RootState) => state.contract,
  );

  const { workspace } = useSelector((state: RootState) => state.workspace);

  const [isContractRenameVisible, setContractRenameVisibility] =
    useState<boolean>(false);
  const [isFiddleUrlVisible, setFiddleUrlVisibility] = useState<boolean>(false);
  const [fiddleUrl, setFiddleUrl] = useState<string>("");

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
              className="grey-button small-button"
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
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              className="small-button"
              onClick={async () => {
                if (contract) {
                  try {
                    showLoader("Creating public url ...");
                    const fiddle = await new ContractFiddleClient(
                      REACT_APP_API_URL,
                    ).createFiddle(contract.id);
                    if (fiddle) {
                      setFiddleUrl(
                        new CoreContractFiddle(fiddle).getFiddleUrl(),
                      );
                      setFiddleUrlVisibility(true);
                    }
                    hideLoader();
                  } catch (e) {
                    hideLoader();
                    showException(e);
                  }
                }
              }}
            >
              Share
            </Button>
            <FiddleUrl
              show={isFiddleUrlVisible}
              onClose={() => {
                setFiddleUrlVisibility(false);
              }}
              url={fiddleUrl}
            ></FiddleUrl>
          </div>
          <div>
            <Button
              startIcon={<PlayArrow fontSize={"small"}></PlayArrow>}
              variant={"outlined"}
              color={"secondary"}
              size={"small"}
              className="small-button"
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
