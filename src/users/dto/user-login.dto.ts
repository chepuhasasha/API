import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Не коректный email' })
	email: string;

	@IsString()
	password: string;
}
