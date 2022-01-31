import express, { Express } from "express";
import { Server } from "http";
import { injectable, inject } from "inversify";
import { ExeptionFilter } from "./errors/exeption.filter";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { UserController } from "./users/users.controller";
import "reflect-metadata";

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;
  logger: ILogger;
  userController: UserController;
  exeptionFilter: ExeptionFilter;
  constructor(
    @inject(TYPES.ILogger) logger: ILogger,
    @inject(TYPES.UserController) userController: UserController,
    @inject(TYPES.ExeptionFilter) exeptionFilter: ExeptionFilter
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
