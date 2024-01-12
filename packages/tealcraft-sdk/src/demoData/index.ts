import { WorkspaceClient } from "../clients/WorkspaceClient";
import { ContractClient } from "../clients/ContractClient";
import { AuctionContract } from "./data/Auction";
import { ConstantProductAMMContract } from "./data/ConstantProductAMM";
import { CalculatorContract } from "./data/Calculator";
import { ARC72Contract } from "./data/ARC72";
import { ARC75Contract } from "./data/ARC75";

export async function loadDemoData(): Promise<string> {
  const workspace = await new WorkspaceClient().save("Demo workspace");
  if (workspace) {
    const contracts = [
      AuctionContract,
      ConstantProductAMMContract,
      CalculatorContract,
      ARC72Contract,
      ARC75Contract,
    ];
    const contractClient = new ContractClient();
    const promises: any = [];

    contracts.forEach((contract) => {
      promises.push(
        contractClient.save(workspace.id, contract.name, contract.source),
      );
    });

    await Promise.all(promises);
  }

  return workspace?.id || "";
}
