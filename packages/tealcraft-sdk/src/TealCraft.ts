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
}
