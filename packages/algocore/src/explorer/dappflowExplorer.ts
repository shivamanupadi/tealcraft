import { CoreNode } from "../CoreClasses/CoreNode";

export class DappflowExplorer {
  private nodeInstance: CoreNode;
  constructor(nodeInstance: CoreNode) {
    this.nodeInstance = nodeInstance;
  }

  getBaseUrl(): string {
    if (this.nodeInstance.isMainnet()) {
      return "https://app.dappflow.org/setnetwork?name=algonode_mainnet&redirect=";
    }
    if (this.nodeInstance.isTestnet()) {
      return "https://app.dappflow.org/setnetwork?name=algonode_testnet&redirect=";
    }
    if (this.nodeInstance.isBetanet()) {
      return "https://app.dappflow.org/setnetwork?name=algonode_betanet&redirect=";
    }
    if (this.nodeInstance.isVoiTestnet()) {
      return "https://app.dappflow.org/setnetwork?name=voi_testnet&redirect=";
    }
    if (this.nodeInstance.isSandbox()) {
      return "https://app.dappflow.org/setnetwork?name=sandbox&redirect=";
    }

    return "";
  }

  openDispenser(): void {
    window.open(`${this.getBaseUrl()}/node-manager/dispenser`, "_blank");
  }
}
