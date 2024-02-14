import Dexie, { Table } from "dexie";
import { A_Account, A_Contract, A_Workspace } from "../types";

export class TealCraftDatabase extends Dexie {
  workspaces!: Table<A_Workspace, string>;
  contracts!: Table<A_Contract, string>;
  accounts!: Table<A_Account, string>;

  constructor() {
    super("tealcraft");
    this.version(4).stores({
      workspaces: "id, timestamp, name, framework",
      contracts: "id, timestamp, workspaceId, name, source, extension",
      accounts: "id, timestamp, mnemonic",
    });
  }
}

export const dataStore = new TealCraftDatabase();
