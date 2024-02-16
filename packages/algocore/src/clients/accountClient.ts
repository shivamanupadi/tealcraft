import { Algodv2 } from "algosdk";
import { Network } from "../network";
import { AccountResult } from "@algorandfoundation/algokit-utils/types/indexer";

export class AccountClient {
  client: Algodv2;
  network: Network;

  constructor(network: Network) {
    this.network = network;
    this.client = network.getClient();
  }

  async getAccountInformation(address: string): Promise<AccountResult> {
    return (await this.client
      .accountInformation(address)
      .do()) as AccountResult;
  }
}
