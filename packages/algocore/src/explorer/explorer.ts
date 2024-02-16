import { DappflowExplorer } from "./dappflowExplorer";
import { CoreNode } from "../CoreClasses/CoreNode";

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

  openApplication(id: string): void {
    this.getExplorer().openApplication(id);
  }
}
