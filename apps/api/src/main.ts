import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import * as process from "process";

const PORT = process.env.PORT || 9001;
const appOptions = { cors: true };

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appOptions);
  await app.listen(PORT);
}

bootstrap();
