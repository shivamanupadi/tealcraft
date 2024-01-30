import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ContractService } from "../../database/services/contract.service";
import { CreateContractFiddleParams } from "@repo/types";
import { ContractEntity } from "../../database/Entities/contract.entity";

@Controller("fiddles")
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post("contracts")
  async createFiddle(
    @Body() payload: CreateContractFiddleParams,
  ): Promise<ContractEntity> {
    const { name, source, frameworkId } = payload;
    return await this.contractService.save(name, source, frameworkId);
  }

  @Get("contracts/:id")
  async getFiddle(
    @Param("id", new ParseIntPipe()) id,
  ): Promise<ContractEntity> {
    return await this.contractService.find(id);
  }
}
