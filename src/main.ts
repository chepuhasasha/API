import { App } from "./app";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LogerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";

async function bootstrap() {
  const logger = new LogerService();
  const app = new App(
    logger,
    new UserController(logger),
    new ExeptionFilter(logger)
  );
  await app.init();
}

bootstrap();
