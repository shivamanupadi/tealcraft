import { isValidClassName } from "@repo/utils";
import { loadDemoData } from "./demoData";
import { LOCAL_STORAGE } from "./constants";
import { WorkspaceClient } from "./clients/WorkspaceClient";

export class TealCraft {
  saveWorkspaceId(id: string) {
    localStorage.setItem(LOCAL_STORAGE.workspaceId, id);
  }

  getWorkspaceId(): string | null {
    return localStorage.getItem(LOCAL_STORAGE.workspaceId);
  }

  removeWorkspaceId() {
    localStorage.removeItem(LOCAL_STORAGE.workspaceId);
  }

  isValidContractName(name: string): boolean {
    const minLength = 5;
    const maxLength = 30;
    if (!name) {
      throw new Error("Invalid contract name");
    }

    if (name.length < minLength) {
      throw new Error(`Contract name should be at least ${minLength} chars`);
    }

    if (name.length > maxLength) {
      throw new Error(`Contract name cannot be more than ${maxLength} chars`);
    }

    if (!isValidClassName(name)) {
      throw new Error("Contract name should be a valid typescript class name");
    }

    return true;
  }

  async loadDemoData(): Promise<string> {
    return await loadDemoData();
  }

  async factoryReset(): Promise<void> {
    const workspaceClient = new WorkspaceClient();
    const workspaces = await workspaceClient.findAll();

    const promises: any = [];

    workspaces.forEach((workspace) => {
      promises.push(workspaceClient.delete(workspace.id));
    });

    await Promise.all(promises);

    Object.values(LOCAL_STORAGE).forEach((item) => {
      localStorage.removeItem(item);
    });
  }
}
