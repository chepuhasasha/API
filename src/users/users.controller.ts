import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { LogerService } from "../logger/logger.service";

export class UserController extends BaseController {
  constructor(logger: LogerService) {
    super(logger);
    this.bindRouts([
      { path: "/login", method: "post", func: this.login },
      { path: "/register", method: "post", func: this.register },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    next(new HTTPError(401, "auth error", "login"));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "login");
  }
}
