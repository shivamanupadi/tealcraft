import axios from "axios";
import { ContractFiddleParams } from "@repo/types";
import { ContractClient } from "../../../clients/ContractClient";

export class ContractFiddleClient {
  private readonly fiddlesApiUrl: string;

  constructor(fiddlesBaseUrl: string) {
    this.fiddlesApiUrl = fiddlesBaseUrl;
  }

  async createFiddle(id: string): Promise<ContractFiddleParams | undefined> {
    const contract = await new ContractClient().get(id);
    if (contract) {
      const { name, source, frameworkId } = contract;
      const url = `${this.fiddlesApiUrl}/contracts`;
      const response = await axios.post(url, { name, source, frameworkId });
      return response.data;
    }
  }

  async getFiddle(id: number): Promise<ContractFiddleParams> {
    const url = `${this.fiddlesApiUrl}/contracts/${id}`;
    const response = await axios.get(url);
    return response.data;
  }
}
