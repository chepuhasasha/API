import express, { Express } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { json } from 'body-parser';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express();
		this.port = 3000;
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}
	useMiddlware(): void {
		this.app.use(json());
	}

	useExeptionFiltres(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlware();
		this.useRoutes();
		this.useExeptionFiltres();
		this.server = this.app.listen(this.port);
		this.logger.log(`server started on PORT: ${this.port}`);
	}
}
