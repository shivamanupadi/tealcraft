import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { CompilerModule } from "./modules/compiler/compiler.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CompilerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
