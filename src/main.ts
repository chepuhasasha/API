import { App } from "./app";
import { LogerService } from "./logger/logger.service";

async function bootstrap() {
  const logger = new LogerService();
  const app = new App(logger);
  await app.init();
}

bootstrap();
