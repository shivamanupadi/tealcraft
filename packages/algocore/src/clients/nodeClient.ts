import { Algodv2 } from "algosdk";
import { A_Genesis, A_Status, A_VersionsCheck } from "../types";
import { Network } from "../network";

export class NodeClient {
  client: Algodv2;
  network: Network;

  constructor(network: Network) {
    this.network = network;
    this.client = network.getClient();
  }

  async versionsCheck(): Promise<A_VersionsCheck> {
    const versions = await this.client.versionsCheck().do();
    return versions as A_VersionsCheck;
  }

  async status(): Promise<A_Status> {
    const status = await this.client.status().do();
    return status as A_Status;
  }

  async genesis(): Promise<A_Genesis> {
    const genesis = await this.client.genesis().do();
    return genesis as A_Genesis;
  }

  async health(): Promise<boolean> {
    await this.client.healthCheck().do();
    return true;
  }

  async ready(): Promise<boolean> {
    await this.client.ready().do();
    return true;
  }
}
