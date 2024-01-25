import { A_Framework, A_Workspace } from "../types";
import { getFramework } from "../api/compiler/frameworks/frameworkUtils";
import { CoreFramework } from "../api/compiler/frameworks/CoreFramework";

export class CoreWorkspace {
  private readonly workspace: A_Workspace;

  constructor(workspace: A_Workspace) {
    this.workspace = workspace;
  }

  get(): A_Workspace {
    return this.workspace;
  }

  getName(): string {
    return this.workspace.name;
  }

  getId(): string {
    return this.workspace.id;
  }

  getFrameworkId(): string {
    return this.workspace.frameworkId;
  }

  getFramework(): A_Framework | undefined {
    const id = this.getFrameworkId();
    return getFramework(id);
  }

  getLogo(): string {
    const framework = this.getFramework();
    return framework ? new CoreFramework(framework).getLogo() : "";
  }
}
