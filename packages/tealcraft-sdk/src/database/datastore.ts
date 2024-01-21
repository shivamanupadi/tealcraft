import Dexie, { Table } from "dexie";
import { A_Contract, A_Workspace } from "../types";

export class TealCraftDatabase extends Dexie {
  workspaces!: Table<A_Workspace, string>;
  contracts!: Table<A_Contract, string>;

  constructor() {
    super("tealcraft");
    this.version(3).stores({
      workspaces: "id, timestamp, name, framework",
      contracts: "id, timestamp, workspaceId, name, source, extension",
    });
  }
}

export const dataStore = new TealCraftDatabase();
