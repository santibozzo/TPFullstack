const BASE_PATH = '/api';

const usersRouter = require('../routers/usersRouter');
const loginRouter = require('../routers/loginRouter');
const request = require('supertest');
const assert = require('assert');
const express = require('express');
const app = express();
const globals = {};

app.use(express.json());
app.use(`${BASE_PATH}/users`, usersRouter);
app.use(`${BASE_PATH}/login`, loginRouter);

describe('GET:/users/{id}', () => {
	before(done => {
		request(app)
			.post(`${BASE_PATH}/login`)
			.send({dni: 50000000, password: '123456'})
			.expect(200)
			.then(response => {
				globals['token'] = response.body.token;
				done();
			})
			.catch(error => done(error));
	});

	it('should return user 50000000', done => {
		request(app)
			.get(`${BASE_PATH}/users/50000000`)
			.set('authorization', globals.token)
			.expect(200)
			.then(response => {
				const user = response.body;
				assert.strictEqual(user.dni, 50000000);
				assert.strictEqual(user.email, '50000000@tpfullstack.com');
				done();
			})
			.catch(error => done(error));
	});
});
