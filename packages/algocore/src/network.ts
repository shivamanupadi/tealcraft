import * as sdk from "algosdk";
import { Algodv2 } from "algosdk";
import { AlgodConnectionParams, NodeConnectionParams } from "./types";

export class Network {
  public algod: AlgodConnectionParams;

  constructor(params: NodeConnectionParams) {
    this.algod = params.algod;
  }

  getAlgodUrl(): string {
    const { url, port } = this.algod;
    return port ? `${url}:${port}` : url;
  }

  getClient(): Algodv2 {
    const { url, port, token } = this.algod;
    return new sdk.Algodv2(token, url, port);
  }
}
