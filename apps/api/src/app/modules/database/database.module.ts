import { Module } from "@nestjs/common";
import { ContractService } from "./services/contract.service";
import { ContractEntity } from "./Entities/contract.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  controllers: [],
  providers: [ContractService],
  exports: [ContractService],
})
export class DatabaseModule {}
