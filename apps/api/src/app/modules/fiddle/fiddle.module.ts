import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contract.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ContractController],
  providers: [],
})
export class FiddleModule {}
