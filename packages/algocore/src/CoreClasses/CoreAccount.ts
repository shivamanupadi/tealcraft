import { AccountResult } from "@algorandfoundation/algokit-utils/types/indexer";

export class CoreAccount {
  private account: AccountResult;

  constructor(account: AccountResult) {
    this.account = account;
  }

  balance(): number {
    return this.account.amount;
  }
}
