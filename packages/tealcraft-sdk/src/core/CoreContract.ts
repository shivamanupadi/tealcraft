import { A_Contract } from "../types";

export class CoreContract {
  private contract: A_Contract;

  constructor(contract: A_Contract) {
    this.contract = contract;
  }

  getName(): string {
    return this.contract.name;
  }

  getId(): string {
    return this.contract.id;
  }

  getNameWithExtension(): string {
    return `${this.getName()}.ts`;
  }
}
