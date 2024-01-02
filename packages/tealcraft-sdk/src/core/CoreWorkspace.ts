import { A_Workspace } from "../types";

export class CoreWorkspace {
  private workspace: A_Workspace;

  constructor(workspace: A_Workspace) {
    this.workspace = workspace;
  }

  getName(): string {
    return this.workspace.name;
  }

  getId(): string {
    return this.workspace.id;
  }
}
