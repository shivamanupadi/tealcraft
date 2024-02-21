import * as sdk from "algosdk";
import { Algodv2, Kmd } from "algosdk";
import {
  AlgodConnectionParams,
  KmdConnectionParams,
  NodeConnectionParams,
} from "./types";

export class Network {
  public algod: AlgodConnectionParams;
  public kmd: KmdConnectionParams | undefined;

  constructor({ algod, kmd }: NodeConnectionParams) {
    this.algod = algod;
    this.kmd = kmd;
  }

  getAlgodClient(): Algodv2 {
    const { url, port, token } = this.algod;
    return new sdk.Algodv2(token, url, port);
  }

  getKmdClient(): Kmd | undefined {
    if (this.kmd) {
      const { url, port, token } = this.kmd;
      return new sdk.Kmd(token, url, port);
    }
  }
}
