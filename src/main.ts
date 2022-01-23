import { App } from "./app";
import { LogerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";

async function bootstrap() {
  const logger = new LogerService();
  const app = new App(logger, new UserController(logger));
  await app.init();
}

bootstrap();
