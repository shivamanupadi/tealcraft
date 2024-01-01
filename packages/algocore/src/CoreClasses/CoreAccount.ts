import { A_AccountInformation } from "../types";

export class CoreAccount {
  private account: A_AccountInformation;

  constructor(account: A_AccountInformation) {
    this.account = account;
  }

  balance(): number {
    return this.account.amount;
  }
}
