export type A_Workspace = {
  id: string;
  timestamp: number;
  name: string;
};

export type A_Contract = {
  id: string;
  timestamp: number;
  workspaceId: string;
  name: string;
  source: string;
};
