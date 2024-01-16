import axios from "axios";
import { ContractFiddleParams } from "@repo/types";
import { ContractClient } from "../../../clients/ContractClient";

export class ContractFiddleClient {
  private readonly apiUrl: string;

  constructor(baseUrl: string) {
    this.apiUrl = `${baseUrl}/api`;
  }

  async createFiddle(id: string): Promise<ContractFiddleParams | undefined> {
    const contract = await new ContractClient().get(id);
    if (contract) {
      const { name, source } = contract;
      const url = `${this.apiUrl}/contracts`;
      const response = await axios.post(url, { name, source });
      return response.data;
    }
  }

  async getFiddle(id: number): Promise<ContractFiddleParams> {
    const url = `${this.apiUrl}/contracts/${id}`;
    const response = await axios.get(url);
    return response.data;
  }
}
