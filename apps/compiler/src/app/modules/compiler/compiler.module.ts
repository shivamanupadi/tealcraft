import { Module } from "@nestjs/common";
import { CompilerController } from "./controllers/compiler.controller";

@Module({
  imports: [],
  controllers: [CompilerController],
  providers: [],
})
export class CompilerModule {}
