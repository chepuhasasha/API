import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepo } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};
const UsersRepoMock: IUsersRepo = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepo: IUsersRepo;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepo>(TYPES.UsersRepo).toConstantValue(UsersRepoMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepo = container.get<IUsersRepo>(TYPES.UsersRepo);
	usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('5');
		usersRepo.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'test@test.ru',
			name: 'Test',
			password: 'test',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('test');
	});

	it('validate - user sucsess', async () => {
		usersRepo.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = usersService.validateUser({
			email: 'test@test.ru',
			password: 'test',
		});
		expect(result).toBeTruthy();
	});

	it('validate - wrong password', async () => {
		usersRepo.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({
			email: 'test@test.ru',
			password: 'test1',
		});
		expect(result).toBeFalsy();
	});

	it('validate - wrong user', async () => {
		usersRepo.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.validateUser({
			email: 'test@test.ru',
			password: 'test1',
		});
		expect(result).toBeFalsy();
	});
});
