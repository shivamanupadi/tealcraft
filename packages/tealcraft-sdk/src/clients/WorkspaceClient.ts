import { dataStore } from "../database/datastore";
import { A_Workspace } from "../types";
import { v4 } from "uuid";
import { ContractClient } from "./ContractClient";

export class WorkspaceClient {
  async save(name: string): Promise<A_Workspace | undefined> {
    const id = v4();
    await dataStore.workspaces.add({
      id,
      timestamp: Date.now(),
      name: name,
    });

    return this.get(id);
  }

  async get(id: string): Promise<A_Workspace | undefined> {
    return dataStore.workspaces.get({
      id: id,
    });
  }

  async delete(id: string | undefined): Promise<boolean> {
    await new ContractClient().deleteByWorkspace(id);
    await dataStore.workspaces
      .where({
        id: id,
      })
      .delete();

    return true;
  }

  async findAll(): Promise<A_Workspace[]> {
    return dataStore.workspaces.toArray();
  }

  async nameExists(name: string): Promise<boolean> {
    const numberOfWorkspacesWithName = await dataStore.workspaces
      .where({ name })
      .limit(1)
      .count();
    return numberOfWorkspacesWithName > 0;
  }
}
