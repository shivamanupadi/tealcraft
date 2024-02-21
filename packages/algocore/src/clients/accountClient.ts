import { Algodv2 } from "algosdk";
import { Network } from "../network";
import { AccountResult } from "@algorandfoundation/algokit-utils/types/indexer";

export class AccountClient {
  algod: Algodv2;
  network: Network;

  constructor(network: Network) {
    this.network = network;
    this.algod = network.getAlgodClient();
  }

  async getAccountInformation(address: string): Promise<AccountResult> {
    return (await this.algod.accountInformation(address).do()) as AccountResult;
  }
}
