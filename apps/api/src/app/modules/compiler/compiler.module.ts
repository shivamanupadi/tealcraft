import { Module } from "@nestjs/common";
import { CompilerController } from "./controllers/compiler.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [CompilerController],
  providers: [],
})
export class CompilerModule {}
