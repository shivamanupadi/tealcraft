import Dexie, { Table } from "dexie";
import { A_Workspace } from "../types";

export class TealCraftDatabase extends Dexie {
  workspaces!: Table<A_Workspace, number>;

  constructor() {
    super("tealcraft");
    this.version(1).stores({
      workspaces: "id, timestamp, name",
    });
  }
}

export const dataStore = new TealCraftDatabase();
