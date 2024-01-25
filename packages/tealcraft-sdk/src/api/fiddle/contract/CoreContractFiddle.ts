import { ContractFiddleParams } from "@repo/types";
import { getBaseUrl } from "@repo/utils";
import { ContractClient } from "../../../clients/ContractClient";
import { A_Contract, A_Framework, A_Workspace } from "../../../types";
import { CoreWorkspace } from "../../../core/CoreWorkspace";
import { getFramework } from "../../compiler/frameworks/frameworkUtils";
import { CoreFramework } from "../../compiler/frameworks/CoreFramework";

export class CoreContractFiddle {
  private fiddle: ContractFiddleParams;

  constructor(fiddle: ContractFiddleParams) {
    this.fiddle = fiddle;
  }

  getFiddleUrl() {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/#/share/contract/${this.fiddle.id}`;
  }

  async importToWorkspace(
    workspace: A_Workspace,
  ): Promise<A_Contract | undefined> {
    const { name, source } = this.fiddle;
    return await new ContractClient().save(workspace, name, source);
  }

  getFramework(): A_Framework | undefined {
    const frameworkId = this.fiddle.frameworkId;
    return getFramework(frameworkId);
  }

  getExtension(): string {
    const framework = this.getFramework();
    if (framework) {
      return new CoreFramework(framework).getExtension();
    }

    return "";
  }

  getName(): string {
    return this.fiddle.name;
  }

  getNameWithExtension(): string {
    return `${this.getName()}.${this.getExtension()}`;
  }

  canImportToWorkspace(workspace: A_Workspace): boolean {
    const frameworkId = new CoreWorkspace(workspace).getFrameworkId();
    return this.fiddle.frameworkId === frameworkId;
  }

  getLogo(): string {
    const framework = this.getFramework();
    return framework ? new CoreFramework(framework).getLogo() : "";
  }
}
