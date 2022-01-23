import express, { Express } from "express";
import { Server } from "http";

export class App {
  app: Express;
  port: number;
  server: Server;
  constructor() {
    this.app = express();
    this.port = 3000;
  }

  public async init() {
    this.server = this.app.listen(this.port);
    console.log(`server started on PORT: ${this.port}`);
  }
}
