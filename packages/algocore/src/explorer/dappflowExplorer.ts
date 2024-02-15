import { CoreNode } from "../CoreClasses/CoreNode";

export class DappflowExplorer {
  private nodeInstance: CoreNode;
  constructor(nodeInstance: CoreNode) {
    this.nodeInstance = nodeInstance;
  }

  getBaseUrl() {
    if (this.nodeInstance.isMainnet()) {
      return "https://app.dappflow.org/setnetwork?name=algonode_mainnet&redirect=explorer";
    }
    if (this.nodeInstance.isTestnet()) {
      return "https://app.dappflow.org/setnetwork?name=algonode_testnet&redirect=explorer";
    }
    if (this.nodeInstance.isBetanet()) {
      return "https://app.dappflow.org/setnetwork?name=algonode_betanet&redirect=explorer";
    }
    if (this.nodeInstance.isVoiTestnet()) {
      return "https://app.dappflow.org/setnetwork?name=voi_testnet&redirect=explorer";
    }
    if (this.nodeInstance.isSandbox()) {
      return "https://app.dappflow.org/setnetwork?name=sandbox&redirect=explorer";
    }
  }

  openBlock(block: number): void {
    window.open(`${this.getBaseUrl()}/block/${block}`, "_blank");
  }

  openTransaction(id: string): void {
    window.open(`${this.getBaseUrl()}/transaction/${id}`, "_blank");
  }

  openAddress(address: string): void {
    window.open(`${this.getBaseUrl()}/account/${address}`, "_blank");
  }
}
