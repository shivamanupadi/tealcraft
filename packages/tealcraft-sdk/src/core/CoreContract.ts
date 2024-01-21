import { A_Contract } from "../types";
import { CoreFramework } from "../compiler/frameworks/CoreFramework";
import { getFramework } from "../compiler/frameworks/frameworkUtils";

export class CoreContract {
  private contract: A_Contract;

  constructor(contract: A_Contract) {
    this.contract = contract;
  }

  getName(): string {
    return this.contract.name;
  }

  getId(): string {
    return this.contract.id;
  }

  getFrameworkId(): string {
    return this.contract.frameworkId;
  }

  getNameWithExtension(): string {
    const framework = getFramework(this.getFrameworkId());
    if (framework) {
      const extension = new CoreFramework(framework).getExtension();
      return `${this.getName()}.${extension}`;
    }

    return this.getName();
  }
}
