import { A_CompileResult, A_Contract, A_Workspace } from "../../../types";
import { getFramework } from "./frameworkUtils";
import { TealScriptCompiler } from "./tealscript/TealScriptCompiler";
import { PuyaCompiler } from "./puya/PuyaCompiler";
import { WorkspaceClient } from "../../../clients/WorkspaceClient";

export class TealCraftCompiler {
  getCompiler(
    workspace: A_Workspace,
    meta?: any,
  ): TealScriptCompiler | PuyaCompiler | undefined {
    const framework = getFramework(workspace.frameworkId);
    if (framework) {
      if (framework.id === "tealscript") {
        return new TealScriptCompiler();
      }
      if (framework.id === "puya") {
        return new PuyaCompiler(meta.compilerUrl);
      }
    }
  }

  async compile(
    contract: A_Contract,
    meta?: any,
  ): Promise<A_CompileResult | undefined> {
    const workspaceId = contract.workspaceId;
    const workspace = await new WorkspaceClient().get(workspaceId);
    if (workspace) {
      const compiler = this.getCompiler(workspace, meta);
      return compiler?.compile(contract);
    }
  }

  async getCompilerVersion(
    workspace: A_Workspace,
    meta?: any,
  ): Promise<string> {
    const compiler = this.getCompiler(workspace, meta);
    if (compiler) {
      return compiler.getCompilerVersion();
    }
    return "";
  }

  getDefaultTemplate(workspace: A_Workspace, name: string) {
    const compiler = this.getCompiler(workspace);
    return compiler?.getDefaultTemplate(name);
  }
}
