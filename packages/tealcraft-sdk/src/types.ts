import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";

export type A_Workspace = {
  id: string;
  timestamp: number;
  name: string;
  frameworkId: string;
};

export type A_Contract = {
  id: string;
  timestamp: number;
  workspaceId: string;
  name: string;
  source: string;
  frameworkId: string;
};

export type A_Framework = {
  id: string;
  label: string;
  language: string;
  extension: string;
};

export type A_CompileResult = {
  appSpec: AppSpec;
  AVMVersion: number;
  srcMap: any;
};
