import { inject, injectable } from 'inversify';
import { PrismaClient, UserModel } from '@prisma/client';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] DB CONNECTED');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.log('[PrismaService] CONNECTION ERROR', e.message);
			}
		}
	}
	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.logger.log('[PrismaService] DB DISCONNECTED');
	}
}
