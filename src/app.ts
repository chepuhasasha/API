import express, { Express } from "express";
import { Server } from "http";
import { ILogger } from "./logger/logger.interface";

export class App {
  app: Express;
  port: number;
  server: Server;
  logger: ILogger;
  constructor(logger: ILogger) {
    this.app = express();
    this.port = 3000;
    this.logger = logger;
  }

  public async init() {
    this.server = this.app.listen(this.port);
    this.logger.log(`server started on PORT: ${this.port}`);
  }
}
