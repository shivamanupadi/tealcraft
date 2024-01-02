import { DB_Workspace } from "../types";

export class CoreWorkspace {
  private workspace: DB_Workspace;

  constructor(workspace: DB_Workspace) {
    this.workspace = workspace;
  }

  getName(): string {
    return this.workspace.name;
  }

  getId(): string {
    return this.workspace.id;
  }
}
