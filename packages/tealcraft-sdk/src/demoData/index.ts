import { WorkspaceClient } from "../database/clients/WorkspaceClient";
import { ContractClient } from "../database/clients/ContractClient";
import { getFramework } from "../api/compiler/frameworks/frameworkUtils";

import { AuctionContract } from "./data/tealscript/Auction";
import { ConstantProductAMMContract } from "./data/tealscript/ConstantProductAMM";
import { CalculatorContract } from "./data/tealscript/Calculator";
import { ARC72Contract } from "./data/tealscript/ARC72";
import { ARC75Contract } from "./data/tealscript/ARC75";

import { ConstantProductAMMContract as ConstantProductAMMContractPuya } from "./data/puya/ConstantProductAMM";
import { VotingContract } from "./data/puya/Voting";
import { AuctionContract as AuctionContractPuya } from "./data/puya/Auction";

async function loadTealScriptDemoData(): Promise<string> {
  const framework = getFramework("tealscript");
  const workspace = await new WorkspaceClient().save(
    "TealScript workspace",
    framework?.id,
  );
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
        contractClient.save(workspace, contract.name, contract.source),
      );
    });

    await Promise.all(promises);
  }

  return workspace?.id || "";
}

async function loadPuyaDemoData(): Promise<string> {
  const framework = getFramework("puya");
  const workspace = await new WorkspaceClient().save(
    "Puya workspace",
    framework?.id,
  );
  if (workspace) {
    const contracts = [
      ConstantProductAMMContractPuya,
      VotingContract,
      AuctionContractPuya,
    ];
    const contractClient = new ContractClient();
    const promises: any = [];

    contracts.forEach((contract) => {
      promises.push(
        contractClient.save(workspace, contract.name, contract.source),
      );
    });

    await Promise.all(promises);
  }

  return workspace?.id || "";
}

export async function loadDemoData(): Promise<string> {
  // await loadPuyaDemoData();
  return await loadTealScriptDemoData();
}
