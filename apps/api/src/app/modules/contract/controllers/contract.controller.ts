import { Body, Controller, Post, SetMetadata } from "@nestjs/common";
import { ContractService } from "../../database/services/contract.service";
import { CreateContractFiddleParams } from "@repo/types";
import { ContractEntity } from "../../database/Entities/contract.entity";

export const Scopes = (...scopes: string[]) => SetMetadata("scopes", scopes);

@Controller("api/contracts")
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post("")
  @Scopes("api")
  async createContractFiddle(
    @Body() payload: CreateContractFiddleParams,
  ): Promise<ContractEntity> {
    const { name, source } = payload;
    return await this.contractService.save(name, source);
  }
}
