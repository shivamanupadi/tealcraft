import { dataStore } from "../datastore";
import { A_Contract, A_Workspace } from "../../types";
import { v4 } from "uuid";
import { CoreWorkspace } from "../../core/CoreWorkspace";

export class ContractClient {
  async save(
    workspace: A_Workspace,
    name: string,
    source: string = "",
  ): Promise<A_Contract | undefined> {
    const id = v4();
    const coreWorkspace = new CoreWorkspace(workspace);
    await dataStore.contracts.add({
      id,
      timestamp: Date.now(),
      workspaceId: coreWorkspace.getId(),
      name: name,
      source,
      frameworkId: coreWorkspace.getFrameworkId(),
    });

    return this.get(id);
  }

  async get(id: string): Promise<A_Contract | undefined> {
    return dataStore.contracts.get({
      id: id,
    });
  }

  async getByWorkspace(
    workspaceId: string,
    id: string,
  ): Promise<A_Contract | undefined> {
    return dataStore.contracts.get({
      workspaceId,
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

  async rename(id: string, name: string): Promise<number> {
    return dataStore.contracts
      .where({
        id,
      })
      .modify({
        name,
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
