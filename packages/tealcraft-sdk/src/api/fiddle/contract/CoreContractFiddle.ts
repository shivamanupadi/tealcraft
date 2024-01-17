import { ContractFiddleParams } from "@repo/types";
import { getBaseUrl } from "@repo/utils";
import { ContractClient } from "../../../clients/ContractClient";
import { A_Contract } from "../../../types";

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
    workspaceId: string,
  ): Promise<A_Contract | undefined> {
    const { name, source } = this.fiddle;
    return await new ContractClient().save(workspaceId, name, source);
  }
}
