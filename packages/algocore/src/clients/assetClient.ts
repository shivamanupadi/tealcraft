import { Algodv2 } from "algosdk";
import { Network } from "../network";
import IndexerClient from "algosdk/dist/types/client/v2/indexer/indexer";
import {
  AssetLookupResult,
  AssetResult,
} from "@algorandfoundation/algokit-utils/types/indexer";

export class AssetClient {
  client: Algodv2;
  indexer: IndexerClient;
  network: Network;

  constructor(network: Network) {
    this.network = network;
    this.client = network.getAlgodClient();
    this.indexer = network.getIndexerClient();
  }

  async get(id: number): Promise<AssetResult> {
    const asset = await this.client.getAssetByID(id).do();
    return asset as AssetResult;
  }

  async getAssets(token?: string): Promise<AssetLookupResult> {
    const req = this.indexer.searchForAssets();
    if (token) {
      req.nextToken(token);
    }

    const response = await req.do();
    return response as AssetLookupResult;
  }

  async searchForAssetsByName(searchText: string): Promise<AssetResult> {
    return (await this.indexer
      .searchForAssets()
      .name(searchText)
      .do()) as AssetResult;
  }

  async searchForAssetsByIndex(id: number): Promise<AssetResult> {
    return (await this.indexer.searchForAssets().index(id).do()) as AssetResult;
  }
}
