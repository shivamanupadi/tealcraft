import {
  AppSpec,
  CallConfig,
} from "@algorandfoundation/algokit-utils/types/app-spec";
import {
  ABIArrayDynamicType,
  ABIArrayStaticType,
  ABIMethod,
  ABIMethodParams,
  ABITupleType,
  ABIType,
  abiTypeIsTransaction,
  Account,
  algosToMicroalgos,
  OnApplicationComplete,
  SuggestedParams,
  Transaction,
  TransactionType,
} from "algosdk";
import { A_ABI_METHOD_EXECUTOR_ARG } from "./types";
import { ABIAppCallArg } from "@algorandfoundation/algokit-utils/types/app";

export function getCreateMethodSignature(appSpec: AppSpec): string {
  const signature = Object.keys(appSpec.hints).find(
    (key) => appSpec.hints[key]?.call_config.no_op === "CREATE",
  );
  return signature || "";
}

export function isCreateMethod(
  methodParams: ABIMethodParams,
  appSpec: AppSpec,
): boolean {
  const signature = getCreateMethodSignature(appSpec);
  return new ABIMethod(methodParams).getSignature() === signature;
}

export function getCreationMethod(
  appSpec: AppSpec,
): ABIMethodParams | undefined {
  return appSpec.contract.methods.find((method) => {
    return isCreateMethod(method, appSpec);
  });
}

export function hasCreationMethod(appSpec: AppSpec): boolean {
  return getCreationMethod(appSpec) != undefined;
}

export function creationMethodHasArguments(appSpec: AppSpec): boolean {
  if (hasCreationMethod(appSpec)) {
    const method = getCreationMethod(appSpec);
    if (method) {
      return method.args.length > 0;
    }
  }

  return false;
}

export function getMethodCallConfig(
  methodParams: ABIMethodParams,
  appSpec: AppSpec,
): CallConfig | undefined {
  const abiMethodInstance = new ABIMethod(methodParams);
  const signature = abiMethodInstance.getSignature();

  const hint = appSpec.hints[signature];

  return hint?.call_config;
}

export function getMethodCallConfigValue(
  methodParams: ABIMethodParams,
  appSpec: AppSpec,
):
  | "no_op"
  | "opt_in"
  | "close_out"
  | "delete_application"
  | "clear_state"
  | OnApplicationComplete.NoOpOC
  | OnApplicationComplete.OptInOC
  | OnApplicationComplete.CloseOutOC
  | OnApplicationComplete.ClearStateOC
  | OnApplicationComplete.DeleteApplicationOC {
  const callConfig = getMethodCallConfig(methodParams, appSpec);
  let value: any = OnApplicationComplete.NoOpOC;

  if (callConfig?.no_op) {
    value = OnApplicationComplete.NoOpOC;
  } else if (callConfig?.opt_in) {
    value = OnApplicationComplete.OptInOC;
  } else if (callConfig?.close_out) {
    value = OnApplicationComplete.CloseOutOC;
  } else if (callConfig?.delete_application) {
    value = OnApplicationComplete.DeleteApplicationOC;
  }

  return value;
}

export function parseMethodArgumentValue(arg: A_ABI_METHOD_EXECUTOR_ARG): any {
  const dataType = arg.type.toString();
  const val = arg.value;

  if (
    arg.type instanceof ABIArrayStaticType ||
    arg.type instanceof ABIArrayDynamicType
  ) {
    if (dataType.startsWith("byte")) {
      return new Uint8Array(Buffer.from(val));
    }
    if (dataType.startsWith("uint")) {
      const vals = val.split(",");
      const intVals = vals.map((val1: any) => {
        return BigInt(val1);
      });
      return intVals;
    }
    return val.split(",");
  }
  if (
    dataType.startsWith("uint") ||
    dataType.startsWith("ufixed") ||
    dataType === "byte" ||
    dataType === "asset" ||
    dataType === "application"
  ) {
    return BigInt(val);
  }
  if (dataType === "bool") {
    return val === "true";
  }
  if (arg.type instanceof ABITupleType) {
    const encodedVal: any = [];
    const tupleContentTypes = ABITupleType.parseTupleContent(
      dataType.slice(1, dataType.length - 1),
    );
    const tupleContentValues = ABITupleType.parseTupleContent(val);

    if (tupleContentTypes.length !== tupleContentValues.length) {
      throw new Error("Tuple content length mismatch");
    }

    tupleContentTypes.forEach((tupleContentType, i) => {
      const ti = ABIType.from(tupleContentType);
      const arg1: A_ABI_METHOD_EXECUTOR_ARG = {
        type: ti,
        value: tupleContentValues[i],
      };
      encodedVal.push(parseMethodArgumentValue(arg1));
    });

    return encodedVal;
  }

  return val;
}
export function convertExecutorArgsToMethodArgs(
  executorArgs: A_ABI_METHOD_EXECUTOR_ARG[],
  method: ABIMethodParams,
  sp: SuggestedParams,
  account: Account,
): ABIAppCallArg[] {
  return executorArgs
    .map((arg) => {
      const val = parseMethodArgumentValue(arg);
      const argType = arg.type.toString() as TransactionType;

      if (abiTypeIsTransaction(argType)) {
        let txn;
        if (argType === TransactionType.pay) {
          txn = new Transaction({
            type: TransactionType.pay,
            from: account.addr,
            to: val.to,
            amount: algosToMicroalgos(val.amount),
            ...sp,
          });
        }
        return txn;
      }

      return val;
    })
    .filter((value) => value !== undefined && value !== "" && value !== null);
}
