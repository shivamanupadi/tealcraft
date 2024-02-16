import "./Playground.scss";
import { ReactElement, useState } from "react";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import { Close } from "@mui/icons-material";
import AccountPicker from "../AccountPicker/AccountPicker";
import NodePicker from "../NodePicker/NodePicker";
import { Button } from "@mui/material";
import { createApp, mnemonicAccount } from "@algorandfoundation/algokit-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { CoreNode, getCreationMethod, Network } from "@repo/algocore";
import {
  AppCallTransactionResult,
  AppCompilationResult,
  AppReference,
  CreateAppParams,
} from "@algorandfoundation/algokit-utils/types/app";
import { useLoader, useSnackbar } from "@repo/ui";
import { Explorer } from "@repo/algocore/src/explorer/explorer";
import TransactionDetails from "../TransactionDetails/TransactionDetails";

interface PlaygroundProps {
  appSpec: AppSpec;
  onClose: () => void;
}

export function Playground({
  appSpec,
  onClose,
}: PlaygroundProps): ReactElement {
  const { selectedNode } = useSelector((state: RootState) => state.nodes);
  const { selectedAccount } = useSelector((state: RootState) => state.accounts);

  const [appCreateResult, setAppCreateResult] = useState<
    | null
    | (Partial<AppCompilationResult> & AppCallTransactionResult & AppReference)
  >(null);
  const [isAppCreateTxnVisible, setAppCreateTxnVisibility] =
    useState<boolean>(false);

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();

  const { status, health, genesis, versionsCheck } = useSelector(
    (state: RootState) => state.node,
  );

  const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);

  return (
    <div className={"playground-wrapper"}>
      <div className={"playground-container"}>
        <div className="playground-header">
          <div className="title">Playground</div>
          <div className="actions">
            <div>
              <NodePicker
                onPick={() => {
                  setAppCreateResult(null);
                }}
              ></NodePicker>
            </div>
            <div>
              <AccountPicker></AccountPicker>
            </div>
            <div>
              <Close className="close hover" onClick={onClose}></Close>
            </div>
          </div>
        </div>
        <div className="playground-body">
          <div className="app-spec">
            <div className="app-spec-header">
              <div className="contract-title">
                Contract : {appSpec.contract.name}
              </div>
              <div className="app-spec-actions">
                <div className="app-id greyed">
                  {appCreateResult ? (
                    <div>
                      Application :{" "}
                      <span
                        className="underline hover"
                        onClick={() => {
                          new Explorer(coreNodeInstance).openApplication(
                            appCreateResult?.appId.toString(),
                          );
                        }}
                      >
                        {appCreateResult.appId.toString()}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="greyed">|</div>
                <div>
                  <Button
                    variant={"contained"}
                    size={"small"}
                    color={"secondary"}
                    onClick={async () => {
                      if (!selectedNode) {
                        showSnack("Please select a network", "error");
                        return;
                      }
                      if (!selectedAccount) {
                        showSnack("Please select an account", "error");
                        return;
                      }

                      try {
                        showLoader("Deploying application ...");
                        const creationMethod = getCreationMethod(appSpec);
                        const params: CreateAppParams = {
                          approvalProgram: atob(appSpec.source.approval),
                          clearStateProgram: atob(appSpec.source.clear),
                          from: mnemonicAccount(selectedAccount.mnemonic),
                          schema: {
                            globalInts: appSpec.state.global.num_uints,
                            localInts: appSpec.state.local.num_uints,
                            localByteSlices:
                              appSpec.state.local.num_byte_slices,
                            globalByteSlices:
                              appSpec.state.global.num_byte_slices,
                          },
                        };

                        if (creationMethod) {
                          params.args = {
                            methodArgs: [],
                            method: creationMethod,
                          };
                        }

                        const algod = new Network(selectedNode).getClient();
                        const result = await createApp(params, algod);

                        setAppCreateResult(result);
                        hideLoader();
                        setAppCreateTxnVisibility(true);
                      } catch (e) {
                        hideLoader();
                        showException(e);
                      }
                    }}
                  >
                    Deploy app
                  </Button>
                  {appCreateResult ? (
                    <div>
                      <TransactionDetails
                        show={isAppCreateTxnVisible}
                        id={appCreateResult.transaction.txID()}
                        onClose={() => {
                          setAppCreateTxnVisibility(false);
                        }}
                      ></TransactionDetails>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;
