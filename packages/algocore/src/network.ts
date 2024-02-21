import * as sdk from "algosdk";
import { Algodv2, Kmd } from "algosdk";
import {
  AlgodConnectionParams,
  IndexerConnectionParams,
  KmdConnectionParams,
  NodeConnectionParams,
} from "./types";
import IndexerClient from "algosdk/dist/types/client/v2/indexer/indexer";

export class Network {
  public algod: AlgodConnectionParams;
  public kmd: KmdConnectionParams | undefined;
  private indexer: IndexerConnectionParams;

  constructor({ algod, kmd, indexer }: NodeConnectionParams) {
    this.algod = algod;
    this.kmd = kmd;
    this.indexer = indexer;
  }

  getAlgodClient(): Algodv2 {
    const { url, port, token } = this.algod;
    return new sdk.Algodv2(token, url, port);
  }

  getIndexerClient(): IndexerClient {
    const { url, port, token } = this.indexer;
    return new sdk.Indexer(token, url, port);
  }

  getKmdClient(): Kmd | undefined {
    if (this.kmd) {
      const { url, port, token } = this.kmd;
      return new sdk.Kmd(token, url, port);
    }
  }
}
