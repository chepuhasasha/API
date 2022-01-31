import { Router, Response } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { ExpressReturnType, IContrillerRoute } from './route.interface';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): void {
		res.sendStatus(201);
	}

	public send<T>(res: Response, status: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(status).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	protected bindRouts(routes: IContrillerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const handler = route.func.bind(this);
			this.router[route.method](route.path, handler);
		}
	}
}
