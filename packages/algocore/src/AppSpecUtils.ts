import {
  AppSpec,
  CallConfig,
} from "@algorandfoundation/algokit-utils/types/app-spec";
import { ABIMethod, ABIMethodParams } from "algosdk";

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

export function getMethodCallConfig(
  methodParams: ABIMethodParams,
  appSpec: AppSpec,
): CallConfig | undefined {
  const abiMethodInstance = new ABIMethod(methodParams);
  const signature = abiMethodInstance.getSignature();

  const hint = appSpec.hints[signature];

  return hint?.call_config;
}
