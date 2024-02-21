import "./Playground.scss";
import { ReactElement, useEffect, useState } from "react";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import { Close, PlayCircle } from "@mui/icons-material";
import AccountPicker from "../AccountPicker/AccountPicker";
import NodePicker from "../NodePicker/NodePicker";
import {
  Alert,
  Button,
  CircularProgress,
  FormLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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
  hasCreationMethod,
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
import { LoadingTile, useLoader, useSnackbar } from "@repo/ui";
import { Explorer } from "@repo/algocore/src/explorer/explorer";
import MethodPicker from "../MethodPicker/MethodPicker";
import {
  ABIMethod,
  ABIMethodParams,
  abiTypeIsTransaction,
  TransactionType,
} from "algosdk";
import { ShadedInput } from "@repo/theme";
import { tableStyles } from "../../Pages/Contract/ContractConsole/ContractSchema/ContractSchema";
import { getExceptionMsg } from "@repo/utils";

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
  const [isExecutionInProgress, setExecutionProgress] =
    useState<boolean>(false);
  const [isExecutionSuccessful, setExecutionSuccess] = useState<boolean>(false);
  const [isExecutionCompleted, setExecutionCompletion] =
    useState<boolean>(false);
  const [executionErrorMsg, setExecutionErrorMsg] = useState<string>("");

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();

  function resetState() {
    setAppCreateResult(null);
    setCurrentMethod(null);
    resetMethodExecutionState();
  }

  function resetMethodExecutionState() {
    setExecutionProgress(false);
    setExecutorResult(null);
    setGlobalStateDelta(null);
    setExecutionSuccess(false);
    setExecutionErrorMsg("");
    setExecutionCompletion(false);
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

    const isCreation = isCreateMethod(method, appSpec);
    if (!isCreation) {
      if (!appCreateResult) {
        showSnack("Deploy an application before invoking the methods", "error");
        return;
      }
    }

    try {
      resetMethodExecutionState();
      setExecutionProgress(true);

      const algod = new Network(selectedNode).getClient();
      const sp = await algod.getTransactionParams().do();

      if (isCreation) {
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
        const appCallTxnResult: AppCallTransactionResult = {
          confirmation: result.confirmation,
          confirmations: result.confirmations,
          return: result.return,
          transaction: result.transaction,
          transactions: result.transactions,
        };
        setExecutorResult(appCallTxnResult);
      } else {
        const params: AppCallParams = {
          appId: appCreateResult?.appId || 0,
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
          const appState = decodeAppState(result.confirmation.globalStateDelta);
          setGlobalStateDelta(appState);
        }
      }
      setExecutionProgress(false);
      setExecutionSuccess(true);
      setExecutionCompletion(true);
    } catch (e) {
      setExecutionProgress(false);
      setExecutionSuccess(false);
      setExecutionCompletion(true);
      const msg = getExceptionMsg(e) || "";
      setExecutionErrorMsg(msg);
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

                      if (hasCreationMethod(appSpec)) {
                        const method = getCreationMethod(appSpec);
                        if (method) {
                          await executeMethod(method);
                          setCurrentMethod(method);
                        }
                      } else {
                        try {
                          showLoader("Deploying application ...");
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
                          const algod = new Network(selectedNode).getClient();
                          const result = await createApp(params, algod);
                          setAppCreateResult(result);
                          hideLoader();
                        } catch (e) {
                          hideLoader();
                          showException(e);
                        }
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
                          resetMethodExecutionState();
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
                                color={"primary"}
                                variant={"contained"}
                                onClick={() => {
                                  executeMethod(currentMethod);
                                }}
                                disabled={isExecutionInProgress}
                                startIcon={
                                  isExecutionInProgress ? (
                                    <CircularProgress
                                      size={20}
                                    ></CircularProgress>
                                  ) : (
                                    <PlayCircle></PlayCircle>
                                  )
                                }
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
                      <div className="result-wrapper">
                        <div className="result-container">
                          <div className="title">Result</div>
                          {isExecutionInProgress ? (
                            <LoadingTile></LoadingTile>
                          ) : (
                            <div>
                              {isExecutionCompleted ? (
                                <div>
                                  <div>
                                    {isExecutionSuccessful ? (
                                      <Alert
                                        icon={false}
                                        color={"success"}
                                        className="execution-final-result mini-alert secondary-light-alert"
                                      >
                                        {currentMethod &&
                                        isCreateMethod(currentMethod, appSpec)
                                          ? `Application ${appCreateResult?.appId} deployed successfully`
                                          : "Method execution successful"}
                                      </Alert>
                                    ) : (
                                      <Alert
                                        icon={false}
                                        color={"warning"}
                                        className="execution-final-result mini-alert warning-light-alert"
                                      >
                                        Method execution failed
                                      </Alert>
                                    )}
                                  </div>

                                  {isExecutionSuccessful ? (
                                    <div>
                                      {executorResult ? (
                                        <div className="details">
                                          <div className="section">
                                            <div className="key">
                                              Transaction
                                            </div>
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
                                            <div className="key">Return</div>
                                            <div className="value">
                                              {executorResult?.return?.returnValue?.toString() ||
                                                "void"}
                                            </div>
                                          </div>
                                          <div className="section">
                                            <div className="key">
                                              Global state delta
                                            </div>
                                            <div className="value">
                                              {globalStateDelta &&
                                              Object.keys(globalStateDelta)
                                                .length > 0 ? (
                                                <TableContainer
                                                  component={Paper}
                                                  sx={tableStyles}
                                                >
                                                  <Table>
                                                    <TableHead>
                                                      <TableRow>
                                                        <TableCell>
                                                          Key
                                                        </TableCell>
                                                        <TableCell>
                                                          Type
                                                        </TableCell>
                                                      </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                      {Object.keys(
                                                        globalStateDelta,
                                                      ).map(
                                                        (globalStateKey) => {
                                                          return (
                                                            <TableRow
                                                              key={`global_state_delta_key_${globalStateKey}`}
                                                              sx={{
                                                                "&:last-child td, &:last-child th":
                                                                  {
                                                                    border: 0,
                                                                  },
                                                              }}
                                                            >
                                                              <TableCell>
                                                                {globalStateKey}
                                                              </TableCell>
                                                              <TableCell>
                                                                {globalStateDelta[
                                                                  globalStateKey
                                                                ]?.value?.toString()}
                                                              </TableCell>
                                                            </TableRow>
                                                          );
                                                        },
                                                      )}
                                                    </TableBody>
                                                  </Table>
                                                </TableContainer>
                                              ) : (
                                                "--Empty--"
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    <div className="error-msg">
                                      {executionErrorMsg}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          )}
                        </div>
                      </div>
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
