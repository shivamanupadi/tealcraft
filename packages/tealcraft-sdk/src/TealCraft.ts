import { downloadJson, isValidClassName } from "@repo/utils";
import { loadDemoData } from "./demoData";
import { LOCAL_STORAGE } from "./constants";
import { exportDB, importDB, ImportOptions } from "dexie-export-import";
import { dataStore } from "./database/datastore";
import { Table } from "dexie";

export class TealCraft {
  saveWorkspaceId(id: string) {
    localStorage.setItem(LOCAL_STORAGE.workspaceId, id);
  }

  getWorkspaceId(): string | null {
    return localStorage.getItem(LOCAL_STORAGE.workspaceId);
  }

  removeWorkspaceId() {
    localStorage.removeItem(LOCAL_STORAGE.workspaceId);
  }

  saveNodeId(id: string) {
    localStorage.setItem(LOCAL_STORAGE.nodeId, id);
  }

  getNodeId(): string {
    return localStorage.getItem(LOCAL_STORAGE.nodeId) || "algonode_mainnet";
  }

  saveAccountId(id: string) {
    localStorage.setItem(LOCAL_STORAGE.accountId, id);
  }

  getAccountId(): string | null {
    return localStorage.getItem(LOCAL_STORAGE.accountId);
  }

  removeAccountId(): void {
    localStorage.removeItem(LOCAL_STORAGE.accountId);
  }

  isValidContractName(name: string): boolean {
    const minLength = 5;
    const maxLength = 30;
    if (!name) {
      throw new Error("Invalid contract name");
    }

    if (name.length < minLength) {
      throw new Error(`Contract name should be at least ${minLength} chars`);
    }

    if (name.length > maxLength) {
      throw new Error(`Contract name cannot be more than ${maxLength} chars`);
    }

    if (!isValidClassName(name)) {
      throw new Error("Contract name should be a valid class name");
    }

    return true;
  }

  async loadDemoData(): Promise<string> {
    return await loadDemoData();
  }

  async factoryReset(): Promise<void> {
    const tableNames: Table[] = dataStore.tables;
    const promises: any = [];

    tableNames.forEach((tableName) => {
      promises.push(tableName.clear());
    });

    await Promise.all(promises);

    Object.values(LOCAL_STORAGE).forEach((item) => {
      localStorage.removeItem(item);
    });
  }

  async exportData() {
    const blob = await exportDB(dataStore);
    const jsonData = JSON.parse(await blob.text());
    downloadJson(jsonData, "tealcraft.data.json");
  }

  async importData(data: any) {
    const blob = new Blob([data], {
      type: "application/json",
    });

    const options: ImportOptions = {
      overwriteValues: true,
    };

    await importDB(blob, options);
  }
}
