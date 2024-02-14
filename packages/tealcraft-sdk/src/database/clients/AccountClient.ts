import { dataStore } from "../datastore";
import { A_Account } from "../../types";
import { v4 } from "uuid";
import { ContractClient } from "./ContractClient";

export class AccountClient {
  async save(mnemonic: string): Promise<A_Account | undefined> {
    const id = v4();
    await dataStore.accounts.add({
      id,
      timestamp: Date.now(),
      mnemonic: mnemonic,
    });

    return this.get(id);
  }

  async get(id: string): Promise<A_Account | undefined> {
    return dataStore.accounts.get({
      id: id,
    });
  }

  async delete(id: string | undefined): Promise<boolean> {
    await new ContractClient().deleteByWorkspace(id);
    await dataStore.accounts
      .where({
        id: id,
      })
      .delete();

    return true;
  }

  async findAll(): Promise<A_Account[]> {
    return dataStore.accounts.orderBy("timestamp").toArray();
  }
}
