import { dataStore } from "../database/datastore";
import { DB_Workspace } from "../types";
import { v4 } from "uuid";

export class WorkspaceClient {
  async save(name: string): Promise<DB_Workspace | undefined> {
    const id = await dataStore.workspaces.add({
      id: v4(),
      timestamp: Date.now(),
      name: name,
    });

    return this.get(id);
  }

  async get(id: number): Promise<DB_Workspace | undefined> {
    return dataStore.workspaces.get({
      id: id,
    });
  }

  async delete(id: string | undefined): Promise<boolean> {
    await dataStore.workspaces
      .where({
        id: id,
      })
      .delete();

    return true;
  }

  async findAll(): Promise<DB_Workspace[]> {
    return dataStore.workspaces.toArray();
  }
}
