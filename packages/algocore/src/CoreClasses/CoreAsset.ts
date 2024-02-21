import { AssetResult } from "@algorandfoundation/algokit-utils/types/indexer";

export class CoreAsset {
  asset: AssetResult;

  constructor(asset: AssetResult) {
    this.asset = asset;
  }

  get(): AssetResult {
    return this.asset;
  }

  hasManager(): boolean {
    return Boolean(this.asset.params.manager);
  }

  hasReserve(): boolean {
    return Boolean(this.asset.params.reserve);
  }

  hasFreeze(): boolean {
    return Boolean(this.asset.params.freeze);
  }

  hasClawback(): boolean {
    return Boolean(this.asset.params.clawback);
  }

  getManager(): string {
    return this.asset.params.manager || "";
  }

  getReserve(): string {
    return this.asset.params.reserve || "";
  }

  getFreeze(): string {
    return this.asset.params.freeze || "";
  }

  getClawback(): string {
    return this.asset.params.clawback || "";
  }

  getIndex(): number {
    return this.asset.index;
  }

  getName(): string {
    return this.asset.params.name || "";
  }

  getUnitName(): string {
    return this.asset.params["unit-name"] || "";
  }

  getDecimals(): number {
    return <number>this.asset.params.decimals;
  }

  getTotal(): number {
    return <number>this.asset.params.total;
  }

  getTotalSupply(): number | bigint {
    return this.getTotal() / Math.pow(10, this.getDecimals());
  }

  getAmountInDecimals(amount: number): number | bigint {
    return amount / Math.pow(10, this.getDecimals());
  }

  getAmountToDecimals(amount: number): number | bigint {
    return amount * Math.pow(10, this.getDecimals());
  }

  getCreator(): string {
    return this.asset.params.creator;
  }

  getDefaultFrozen(): boolean {
    return this.asset.params["default-frozen"] || false;
  }

  getUrl(): string {
    return this.asset.params.url || "";
  }
}
