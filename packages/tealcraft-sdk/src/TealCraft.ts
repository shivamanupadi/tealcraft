import { isValidClassName } from "@repo/utils";

export class TealCraft {
  saveWorkspaceId(id: string) {
    localStorage.setItem("workspaceId", id);
  }
  getWorkspaceId(): string | null {
    return localStorage.getItem("workspaceId");
  }
  removeWorkspaceId() {
    localStorage.removeItem("workspaceId");
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
}
