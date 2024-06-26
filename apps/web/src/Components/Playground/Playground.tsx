import "./Playground.scss";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import {
  Close,
  Edit,
  ExpandMore,
  PlayCircle,
  ShowerOutlined,
} from "@mui/icons-material";
import AccountPicker from "../AccountPicker/AccountPicker";
import NodePicker from "../NodePicker/NodePicker";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  FormLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
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
  algosToMicroalgos,
  TransactionType,
} from "algosdk";
import { GreyColors, ShadedInput, theme } from "@repo/theme";
import { tableStyles } from "../../Pages/Contract/ContractConsole/ContractSchema/ContractSchema";
import { getExceptionMsg, isNumber } from "@repo/utils";
import Dispenser from "../Dispenser/Dispenser";
import { AssetResult } from "@algorandfoundation/algokit-utils/types/indexer";
import AssetPicker from "../AssetPicker/AssetPicker";

const txnFieldStyles = {
  marginTop: "15px",
  display: "inline-block",
};

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
  const resultDivRef = useRef(null);

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

  const [txnFee, setTxnFee] = useState<string>("");

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

    if (txnFee) {
      if (!isNumber(txnFee)) {
        showSnack("Transaction fee should be a number", "error");
        return;
      }
    }

    try {
      resetMethodExecutionState();
      setExecutionProgress(true);

      const algod = new Network(selectedNode).getAlgodClient();
      const sp = await algod.getTransactionParams().do();

      if (txnFee) {
        sp.fee = algosToMicroalgos(Number(txnFee));
        sp.flatFee = true;
      }

      if (isCreation) {
        const params: CreateAppParams = {
          approvalProgram: atob(appSpec.source.approval),
          clearStateProgram: atob(appSpec.source.clear),
          from: mnemonicAccount(selectedAccount.mnemonic),
          transactionParams: sp,
          schema: {
            globalInts: appSpec.state.global.num_uints,
            localInts: appSpec.state.local.num_uints,
            localByteSlices: appSpec.state.local.num_byte_slices,
            globalByteSlices: appSpec.state.global.num_byte_slices,
          },
          args: {
            methodArgs: convertExecutorArgsToMethodArgs(
              executorArgs,
              method,
              sp,
              mnemonicAccount(selectedAccount.mnemonic),
            ),
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
        if (result.confirmation?.globalStateDelta) {
          const appState = decodeAppState(result.confirmation.globalStateDelta);
          setGlobalStateDelta(appState);
        }
      } else {
        const params: AppCallParams = {
          appId: appCreateResult?.appId || 0,
          callType: getMethodCallConfigValue(method, appSpec),
          from: mnemonicAccount(selectedAccount.mnemonic),
          populateAppCallResources: true,
          transactionParams: sp,
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
    focusResult();
  }

  function focusResult() {
    if (resultDivRef.current) {
      // @ts-ignore
      resultDivRef.current.focus();
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
                <div>
                  {appCreateResult ? (
                    <div className="app-details greyed">
                      <div>Application : </div>
                      <div>
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
                      <div>
                        {selectedNode ? (
                          <Dispenser
                            address={appCreateResult.appAddress}
                            network={new Network(selectedNode)}
                            onDispense={() => {}}
                          >
                            <Tooltip
                              title="Dispense algos to app account"
                              className="hover"
                            >
                              <ShowerOutlined></ShowerOutlined>
                            </Tooltip>
                          </Dispenser>
                        ) : (
                          ""
                        )}
                      </div>
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
                    disabled={isExecutionInProgress}
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
                          setCurrentMethod(method);
                          await executeMethod(method);
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
                          const algod = new Network(
                            selectedNode,
                          ).getAlgodClient();
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
              {appCreateResult || hasCreationMethod(appSpec) ? (
                <div className="method-executor">
                  <div className="method-executor-body">
                    <FormLabel className="method-selector">
                      Select method
                    </FormLabel>
                    <MethodPicker
                      onPick={(method) => {
                        resetMethodExecutionState();
                        setCurrentMethod(method);
                        setTxnFee("");
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
                            const argType = arg.type.toString();
                            const normalInput =
                              !abiTypeIsTransaction(arg.type.toString()) &&
                              argType != "asset";
                            return (
                              <div className="abi-method-arg" key={arg.name}>
                                <FormLabel className="classic-label">{`${arg.name} (${argType})`}</FormLabel>
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

                                                setExecutorArgs(processedArgs);
                                              }}
                                              fullWidth
                                            />

                                            <FormLabel
                                              className="classic-label"
                                              sx={txnFieldStyles}
                                            >
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

                                                setExecutorArgs(processedArgs);
                                              }}
                                              endAdornment={<div>Algo</div>}
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
                                              fullWidth
                                              disabled
                                              endAdornment={
                                                <div className="asset-edit">
                                                  <div>
                                                    {
                                                      arg.value?.asset
                                                        ?.params?.["unit-name"]
                                                    }
                                                  </div>
                                                  <div>
                                                    <Edit
                                                      className="hover"
                                                      fontSize={"small"}
                                                      color={"primary"}
                                                      onClick={() => {
                                                        const processedArgs = [
                                                          ...executorArgs,
                                                        ];
                                                        processedArgs[index] = {
                                                          ...arg,
                                                          value: {
                                                            ...arg.value,
                                                            show: true,
                                                          },
                                                        };

                                                        setExecutorArgs(
                                                          processedArgs,
                                                        );
                                                      }}
                                                    ></Edit>
                                                    <AssetPicker
                                                      onPick={(
                                                        asset: AssetResult,
                                                      ) => {
                                                        const processedArgs = [
                                                          ...executorArgs,
                                                        ];
                                                        processedArgs[index] = {
                                                          ...arg,
                                                          value: {
                                                            ...arg.value,
                                                            assetId:
                                                              asset.index,
                                                            asset: asset,
                                                            show: false,
                                                          },
                                                        };
                                                        setExecutorArgs(
                                                          processedArgs,
                                                        );
                                                      }}
                                                      onClose={() => {
                                                        const processedArgs = [
                                                          ...executorArgs,
                                                        ];
                                                        processedArgs[index] = {
                                                          ...arg,
                                                          value: {
                                                            ...arg.value,
                                                            show: false,
                                                          },
                                                        };
                                                        setExecutorArgs(
                                                          processedArgs,
                                                        );
                                                      }}
                                                      show={arg.value.show}
                                                      title="Pick asset"
                                                    ></AssetPicker>
                                                  </div>
                                                </div>
                                              }
                                            />

                                            <FormLabel
                                              className="classic-label"
                                              sx={txnFieldStyles}
                                            >
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

                                                setExecutorArgs(processedArgs);
                                              }}
                                              fullWidth
                                            />

                                            <FormLabel
                                              className="classic-label"
                                              sx={txnFieldStyles}
                                            >
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

                                                setExecutorArgs(processedArgs);
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
                                  <div>
                                    {argType === "asset" ? (
                                      <ShadedInput
                                        placeholder={arg.type.toString()}
                                        value={arg.value.assetId}
                                        disabled
                                        endAdornment={
                                          <div className="asset-edit">
                                            <div>
                                              {
                                                arg.value?.asset?.params?.[
                                                  "unit-name"
                                                ]
                                              }
                                            </div>
                                            <div>
                                              <Edit
                                                className="hover"
                                                fontSize={"small"}
                                                color={"primary"}
                                                onClick={() => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      show: true,
                                                    },
                                                  };

                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                              ></Edit>
                                              <AssetPicker
                                                onPick={(
                                                  asset: AssetResult,
                                                ) => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      assetId: asset.index,
                                                      asset: asset,
                                                      show: false,
                                                    },
                                                  };
                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                                onClose={() => {
                                                  const processedArgs = [
                                                    ...executorArgs,
                                                  ];
                                                  processedArgs[index] = {
                                                    ...arg,
                                                    value: {
                                                      ...arg.value,
                                                      show: false,
                                                    },
                                                  };
                                                  setExecutorArgs(
                                                    processedArgs,
                                                  );
                                                }}
                                                show={arg.value.show}
                                                title="Pick asset"
                                              ></AssetPicker>
                                            </div>
                                          </div>
                                        }
                                        fullWidth
                                      />
                                    ) : (
                                      ""
                                    )}
                                    {normalInput ? (
                                      <ShadedInput
                                        placeholder={arg.type.toString()}
                                        value={arg.value}
                                        onChange={(ev) => {
                                          const processedArgs = [
                                            ...executorArgs,
                                          ];
                                          processedArgs[index] = {
                                            ...arg,
                                            value: ev.target.value,
                                          };

                                          setExecutorArgs(processedArgs);
                                        }}
                                        fullWidth
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          <div className="advanced-config">
                            <Accordion className="accordion">
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMore
                                    sx={{ color: GreyColors.A7A9AC }}
                                  />
                                }
                              >
                                <div className="title">
                                  Advanced configuration
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="advanced-config-body">
                                  <FormLabel
                                    className="classic-label"
                                    sx={txnFieldStyles}
                                  >
                                    Transaction fee
                                  </FormLabel>
                                  <ShadedInput
                                    placeholder="Amount"
                                    value={txnFee}
                                    onChange={(ev) => {
                                      setTxnFee(ev.target.value);
                                    }}
                                    endAdornment={<div>Algo</div>}
                                    fullWidth
                                  />
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </div>
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
                  </div>
                  <div className="result-wrapper">
                    <div
                      className="result-container"
                      ref={resultDivRef}
                      tabIndex={-1}
                    >
                      <div className="title">Result</div>
                      {isExecutionInProgress ? (
                        <LoadingTile></LoadingTile>
                      ) : (
                        <div>
                          {isExecutionCompleted ? (
                            <div>
                              <div>
                                {isExecutionSuccessful ? (
                                  <div
                                    style={{
                                      color: theme.palette.secondary.main,
                                    }}
                                    className="execution-final-result"
                                  >
                                    {currentMethod &&
                                    isCreateMethod(currentMethod, appSpec)
                                      ? `Application ${appCreateResult?.appId} deployed successfully`
                                      : "Method execution successful"}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      color: theme.palette.warning.dark,
                                    }}
                                    className="execution-final-result"
                                  >
                                    Method execution failed
                                  </div>
                                )}
                              </div>

                              {isExecutionSuccessful ? (
                                <div>
                                  {executorResult ? (
                                    <div className="details">
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
                                          Object.keys(globalStateDelta).length >
                                            0 ? (
                                            <TableContainer
                                              component={Paper}
                                              sx={tableStyles}
                                            >
                                              <Table>
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell>Key</TableCell>
                                                    <TableCell>Type</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {Object.keys(
                                                    globalStateDelta,
                                                  ).map((globalStateKey) => {
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
                                                  })}
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
