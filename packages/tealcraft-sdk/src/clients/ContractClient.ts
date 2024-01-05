import { dataStore } from "../database/datastore";
import { A_Contract } from "../types";
import { v4 } from "uuid";

export class ContractClient {
  async save(
    workspaceId: string,
    name: string,
  ): Promise<A_Contract | undefined> {
    const id = v4();
    await dataStore.contracts.add({
      id,
      timestamp: Date.now(),
      workspaceId: workspaceId,
      name: name,
      source: "",
    });

    return this.get(id);
  }

  async get(id: string): Promise<A_Contract | undefined> {
    return dataStore.contracts.get({
      id: id,
    });
  }

  async updateSource(id: string, source: string): Promise<number> {
    return dataStore.contracts
      .where({
        id,
      })
      .modify({
        source,
      });
  }

  async delete(id: string | undefined): Promise<boolean> {
    await dataStore.contracts
      .where({
        id: id,
      })
      .delete();

    return true;
  }

  async deleteByWorkspace(workspaceId: string | undefined): Promise<boolean> {
    await dataStore.contracts
      .where({
        workspaceId: workspaceId,
      })
      .delete();

    return true;
  }

  async findByWorkspace(workspaceId: string): Promise<A_Contract[]> {
    return dataStore.contracts
      .where({
        workspaceId,
      })
      .sortBy("timestamp");
  }

  async nameExists(workspaceId: string, name: string): Promise<boolean> {
    const numberOfWorkspacesWithName = await dataStore.contracts
      .where({ workspaceId, name })
      .limit(1)
      .count();
    return numberOfWorkspacesWithName > 0;
  }
}
