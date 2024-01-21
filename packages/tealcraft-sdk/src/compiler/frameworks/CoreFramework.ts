import { A_Framework } from "../../types";

export class CoreFramework {
  private framework: A_Framework;

  constructor(framework: A_Framework) {
    this.framework = framework;
  }

  getExtension(): string {
    return this.framework.extension;
  }
}
