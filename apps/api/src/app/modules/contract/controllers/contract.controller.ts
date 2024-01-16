import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  SetMetadata,
} from "@nestjs/common";
import { ContractService } from "../../database/services/contract.service";
import { CreateContractFiddleParams } from "@repo/types";
import { ContractEntity } from "../../database/Entities/contract.entity";

export const Scopes = (...scopes: string[]) => SetMetadata("scopes", scopes);

@Controller("api/contracts")
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post("")
  @Scopes("api")
  async createFiddle(
    @Body() payload: CreateContractFiddleParams,
  ): Promise<ContractEntity> {
    const { name, source } = payload;
    return await this.contractService.save(name, source);
  }

  @Get("/:id")
  @Scopes("api")
  async getFiddle(
    @Param("id", new ParseIntPipe()) id,
  ): Promise<ContractEntity> {
    return await this.contractService.find(id);
  }
}
