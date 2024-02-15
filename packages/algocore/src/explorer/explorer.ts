import { CoreNode } from "../packages/core-sdk/classes/core/CoreNode";
import { DappflowExplorer } from "./dappflowExplorer";

export class Explorer {
  private nodeInstance: CoreNode;
  constructor(nodeInstance: CoreNode) {
    this.nodeInstance = nodeInstance;
  }

  getExplorer() {
    return new DappflowExplorer(this.nodeInstance);
  }

  openBlock(block: number): void {
    this.getExplorer().openBlock(block);
  }

  openTransaction(id: string): void {
    this.getExplorer().openTransaction(id);
  }

  openAddress(address: string): void {
    this.getExplorer().openAddress(address);
  }
}
