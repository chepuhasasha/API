import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepo } from './users.repository.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepo) private usersRepo: IUsersRepo,
	) {}
	async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(dto.email, dto.name);
		const salt = this.configService.get('SALT');
		console.log(salt);
		await newUser.setPassword(dto.password, +salt);
		const existedUser = await this.usersRepo.find(dto.email);
		if (existedUser) {
			return null;
		}
		return this.usersRepo.create(newUser);
	}
	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepo.find(dto.email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(dto.password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepo.find(email);
	}
}
