import express, { Express } from "express";
import { Server } from "http";
import { ExeptionFilter } from "./errors/exeption.filter";
import { ILogger } from "./logger/logger.interface";
import { UserController } from "./users/users.controller";

export class App {
  app: Express;
  port: number;
  server: Server;
  logger: ILogger;
  userController: UserController;
  exeptionFilter: ExeptionFilter;
  constructor(
    logger: ILogger,
    userController: UserController,
    exeptionFilter: ExeptionFilter
  ) {
    this.app = express();
    this.port = 3000;
    this.logger = logger;
    this.userController = userController;
    this.exeptionFilter = exeptionFilter;
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExeptionFiltres() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExeptionFiltres();
    this.server = this.app.listen(this.port);
    this.logger.log(`server started on PORT: ${this.port}`);
  }
}
