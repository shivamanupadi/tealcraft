import Dexie, { Table } from "dexie";
import { DB_Workspace } from "../types";

export class TealCraftDatabase extends Dexie {
  workspaces!: Table<DB_Workspace, number>;

  constructor() {
    super("tealcraft");
    this.version(1).stores({
      workspaces: "id, timestamp, name",
    });
  }
}

export const dataStore = new TealCraftDatabase();
