import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@test.ru',
			password: 'test',
			name: 'Test',
		});
		expect(res.statusCode).toBe(422);
	});

	it('Login - sucsess', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@test.ru',
			password: 'test',
		});
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@test.ru',
			password: 'test1',
		});
		expect(res.statusCode).toBe(401);
	});
	it('Info - sucsess', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'test@test.ru',
			password: 'test',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('test@test.ru');
	});
	it('Info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
