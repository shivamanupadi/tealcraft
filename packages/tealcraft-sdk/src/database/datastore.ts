import Dexie, { Table } from "dexie";
import { A_Contract, A_Workspace } from "../types";

export class TealCraftDatabase extends Dexie {
  workspaces!: Table<A_Workspace, string>;
  contracts!: Table<A_Contract, string>;

  constructor() {
    super("tealcraft");
    this.version(2).stores({
      workspaces: "id, timestamp, name",
      contracts: "id, timestamp, workspaceId, name, source",
    });
  }
}

export const dataStore = new TealCraftDatabase();
