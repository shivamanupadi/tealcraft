import { ContractFiddleParams } from "@repo/types";
import { getBaseUrl } from "@repo/utils";

export class CoreContractFiddle {
  private fiddle: ContractFiddleParams;

  constructor(fiddle: ContractFiddleParams) {
    this.fiddle = fiddle;
  }

  getFiddleUrl() {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/#/share/contract/${this.fiddle.id}`;
  }
}
