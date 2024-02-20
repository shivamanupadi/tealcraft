import "./Playground.scss";
import { ReactElement, useEffect, useState } from "react";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import { Close } from "@mui/icons-material";
import AccountPicker from "../AccountPicker/AccountPicker";
import NodePicker from "../NodePicker/NodePicker";
import { Button, FormLabel, Grid } from "@mui/material";
import {
  callApp,
  createApp,
  mnemonicAccount,
  decodeAppState,
} from "@algorandfoundation/algokit-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  A_ABI_METHOD_EXECUTOR_ARG,
  convertExecutorArgsToMethodArgs,
  CoreNode,
  creationMethodHasArguments,
  getCreationMethod,
  getMethodCallConfigValue,
  isCreateMethod,
  Network,
} from "@repo/algocore";
import {
  AppCallParams,
  AppCallTransactionResult,
  AppCompilationResult,
  AppReference,
  AppState,
  CreateAppParams,
} from "@algorandfoundation/algokit-utils/types/app";
import { useLoader, useSnackbar } from "@repo/ui";
import { Explorer } from "@repo/algocore/src/explorer/explorer";
import MethodPicker from "../MethodPicker/MethodPicker";
import {
  ABIMethod,
  ABIMethodParams,
  abiTypeIsTransaction,
  TransactionType,
} from "algosdk";
import { ShadedInput } from "@repo/theme";

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

  const [currentMethod, setCurrentMethod] = useState<ABIMethodParams | null>(
    null,
  );
  const [executorResult, setExecutorResult] =
    useState<AppCallTransactionResult | null>(null);
  const [executorArgs, setExecutorArgs] = useState<A_ABI_METHOD_EXECUTOR_ARG[]>(
    [],
  );
  const [globalStateDelta, setGlobalStateDelta] = useState<AppState | null>(
    null,
  );

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();

  function resetState() {
    setAppCreateResult(null);
    setCurrentMethod(null);
  }

  useEffect(() => {
    if (currentMethod) {
      const processedArgs = new ABIMethod(currentMethod).args.map((arg) => ({
        ...arg,
        value: "",
      }));
      setExecutorArgs(processedArgs);
    }
  }, [currentMethod]);

  const { status, health, genesis, versionsCheck } = useSelector(
    (state: RootState) => state.node,
  );

  const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);

  async function executeMethod(method: ABIMethodParams) {
    if (!selectedNode) {
      showSnack("Please select a network", "error");
      return;
    }
    if (!selectedAccount) {
      showSnack("Please select an account", "error");
      return;
    }

    try {
      const algod = new Network(selectedNode).getClient();
      const sp = await algod.getTransactionParams().do();
      const isCreation = isCreateMethod(method, appSpec);

      if (isCreation) {
        try {
          showLoader("Deploying application ...");
          const params: CreateAppParams = {
            approvalProgram: atob(appSpec.source.approval),
            clearStateProgram: atob(appSpec.source.clear),
            from: mnemonicAccount(selectedAccount.mnemonic),
            schema: {
              globalInts: appSpec.state.global.num_uints,
              localInts: appSpec.state.local.num_uints,
              localByteSlices: appSpec.state.local.num_byte_slices,
              globalByteSlices: appSpec.state.global.num_byte_slices,
            },
            args: {
              methodArgs: [],
              method: method,
            },
          };
          const result = await createApp(params, algod);
          setAppCreateResult(result);
          hideLoader();
        } catch (e) {
          hideLoader();
          showException(e);
        }
      } else {
        if (!appCreateResult) {
          showSnack(
            "Deploy an application before invoking the methods",
            "error",
          );
          return;
        }
        showLoader("Invoking method call ...");
        const params: AppCallParams = {
          appId: appCreateResult.appId,
          callType: getMethodCallConfigValue(method, appSpec),
          from: mnemonicAccount(selectedAccount.mnemonic),
          populateAppCallResources: true,
          args: {
            method: method,
            methodArgs: convertExecutorArgsToMethodArgs(
              executorArgs,
              method,
              sp,
              mnemonicAccount(selectedAccount.mnemonic),
            ),
          },
        };
        const result = await callApp(params, algod);
        setExecutorResult(result);
        if (result.confirmation?.globalStateDelta) {
          const test = decodeAppState(result.confirmation.globalStateDelta);
          setGlobalStateDelta(test);
        }

        hideLoader();
      }
    } catch (e) {
      hideLoader();
      showException(e);
    }
  }

  return (
    <div className={"playground-wrapper"}>
      <div className={"playground-container"}>
        <div className="playground-header">
          <div className="title">Playground</div>
          <div className="actions">
            <div>
              <NodePicker
                onPick={() => {
                  resetState();
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

                      if (creationMethodHasArguments(appSpec)) {
                        showSnack(
                          "This contract has a method which need few  arguments to deploy the application. please invoke that method below to deploy a new application.",
                          "error",
                        );
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
                      } catch (e) {
                        hideLoader();
                        showException(e);
                      }
                    }}
                  >
                    Deploy app
                  </Button>
                </div>
              </div>
            </div>
            <div className="app-spec-body">
              {appCreateResult || creationMethodHasArguments(appSpec) ? (
                <div className="method-executor">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormLabel className="method-selector">
                        Select method
                      </FormLabel>
                      <MethodPicker
                        onPick={(method) => {
                          setCurrentMethod(method);
                        }}
                        selectedMethod={currentMethod}
                        appSpec={appSpec}
                      ></MethodPicker>

                      {currentMethod ? (
                        <div className="app-create-info">
                          {isCreateMethod(currentMethod, appSpec) ? (
                            <div>
                              This is a app create method. Executing this method
                              will deploy a new application and set the deployed
                              application to the current context.
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                      {currentMethod ? (
                        <div className="abi-method-args-form-wrapper">
                          <div className="abi-method-args-form-container">
                            {executorArgs.length > 0 ? (
                              <div className="abi-method-args-form-title">
                                Arguments
                              </div>
                            ) : (
                              ""
                            )}

                            {executorArgs.map((arg, index) => {
                              return (
                                <div className="abi-method-arg" key={arg.name}>
                                  <FormLabel className="classic-label">{`${
                                    arg.name
                                  } (${arg.type.toString()})`}</FormLabel>
                                  {abiTypeIsTransaction(arg.type.toString()) ? (
                                    <div>
                                      <div className="arg-transaction-wrapper">
                                        <div className="arg-transaction-container">
                                          {arg.type.toString() ===
                                          TransactionType.pay ? (
                                            <div>
                                              <FormLabel className="classic-label">
                                                To
                                              </FormLabel>
                                              <ShadedInput
                                                placeholder="To address"
                                                multiline
                                                rows={2}
                                                value={arg.value.to}
                                                onChange={(ev) => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      to: ev.target.value,
                                                    },
                                                  };

                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                                fullWidth
                                              />

                                              <FormLabel className="classic-label">
                                                Amount
                                              </FormLabel>
                                              <ShadedInput
                                                placeholder="Amount"
                                                value={arg.value.amount}
                                                onChange={(ev) => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      amount: ev.target.value,
                                                    },
                                                  };

                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                                fullWidth
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )}

                                          {arg.type.toString() ===
                                          TransactionType.axfer ? (
                                            <div>
                                              <FormLabel className="classic-label">
                                                Asset ID
                                              </FormLabel>
                                              <ShadedInput
                                                placeholder="Asset ID"
                                                value={arg.value.assetId}
                                                onChange={(ev) => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      assetId: ev.target.value,
                                                    },
                                                  };

                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                                fullWidth
                                              />

                                              <FormLabel className="classic-label">
                                                To
                                              </FormLabel>
                                              <ShadedInput
                                                placeholder="To address"
                                                multiline
                                                rows={2}
                                                value={arg.value.to}
                                                onChange={(ev) => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      to: ev.target.value,
                                                    },
                                                  };

                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                                fullWidth
                                              />

                                              <FormLabel className="classic-label">
                                                Amount
                                              </FormLabel>
                                              <ShadedInput
                                                placeholder="Amount"
                                                value={arg.value.amount}
                                                onChange={(ev) => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      amount: ev.target.value,
                                                    },
                                                  };

                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                                fullWidth
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <ShadedInput
                                      placeholder={arg.type.toString()}
                                      value={arg.value}
                                      onChange={(ev) => {
                                        const processedArgs = [...executorArgs];
                                        processedArgs[index] = {
                                          ...arg,
                                          value: ev.target.value,
                                        };

                                        setExecutorArgs(processedArgs);
                                      }}
                                      fullWidth
                                    />
                                  )}
                                </div>
                              );
                            })}

                            <div className="abi-method-execute">
                              <Button
                                variant={"contained"}
                                onClick={() => {
                                  executeMethod(currentMethod);
                                }}
                              >
                                Execute
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      {executorResult ? (
                        <div className="result-wrapper">
                          <div className="result-container">
                            <div className="title">Result</div>
                            <div className="details">
                              <div className="section">
                                <div className="key">Return</div>
                                <div className="value">
                                  {executorResult?.return?.returnValue?.toString()}
                                </div>
                              </div>
                              <div className="section">
                                <div className="key">Transaction</div>
                                <div
                                  className="value underline hover"
                                  onClick={() => {
                                    new Explorer(
                                      coreNodeInstance,
                                    ).openTransaction(
                                      executorResult?.transaction.txID(),
                                    );
                                  }}
                                >
                                  {executorResult?.transaction.txID()}
                                </div>
                              </div>
                              <div className="section">
                                <div className="key">Global state delta</div>
                                {globalStateDelta ? (
                                  <div className="value">
                                    {Object.keys(globalStateDelta).map(
                                      (globalStateKey) => {
                                        return (
                                          <div>
                                            <div>{globalStateKey}</div>
                                            <div>
                                              {globalStateDelta[
                                                globalStateKey
                                              ]?.value.toString()}
                                            </div>
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                </div>
              ) : (
                <div className="no-app-info">
                  Deploy an application to invoke methods
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;
