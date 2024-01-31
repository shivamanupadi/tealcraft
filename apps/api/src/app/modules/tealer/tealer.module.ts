import { Module } from "@nestjs/common";
import { TealerController } from "./controllers/tealer.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [TealerController],
  providers: [],
})
export class TealerModule {}
