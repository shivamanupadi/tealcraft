import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { CompilerModule } from "./modules/compiler/compiler.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractEntity } from "./modules/database/Entities/contract.entity";
import { DatabaseModule } from "./modules/database/database.module";
import { FiddleModule } from "./modules/fiddle/fiddle.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService], // Inject ConfigService into the factory function
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DATABASE_HOST"),
        database: configService.get<string>("DATABASE_NAME"),
        username: configService.get<string>("DATABASE_USERNAME"),
        password: configService.get<string>("DATABASE_PASSWORD"),
        entities: [ContractEntity],
        synchronize: true,
        logging: true,
        ssl: true,
      }),
    }),
    DatabaseModule,
    FiddleModule,
    CompilerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
