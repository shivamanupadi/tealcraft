import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractEntity } from "./modules/database/Entities/contract.entity";
import { DatabaseModule } from "./modules/database/database.module";
import { ContractModule } from "./modules/contract/contract.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: undefined,
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
    ContractModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
