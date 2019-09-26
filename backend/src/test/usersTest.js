const BASE_PATH = '/api';

const testSetup = require('./testSetup');
const usersRouter = require('../routers/usersRouter');
const request = require('supertest');
const assert = require('assert');
const express = require('express');
const app = express();
const globals = {};

app.use(express.json());
app.use(`${BASE_PATH}/users`, usersRouter);

describe('Users tests', () => {
	before(done => {
		globals['expiredToken'] = testSetup.generateExpiredToken(50000000);
		testSetup.generateTokenForTests(50000000, 200)
			.then(token => {
				globals['token'] = token;
				done();
			})
			.catch(error => done(error));
	});

	describe('GET:users/{id}', () => {
		it('gets existing user', done => {
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

		it('tries to get non-existing user', () => {
			return request(app)
				.get(`${BASE_PATH}/users/00000000`)
				.set('authorization', globals.token)
				.expect(404);
		});

		it('invalid dni length', () => {
			return request(app)
				.get(`${BASE_PATH}/users/50`)
				.set('authorization', globals.token)
				.expect(404);
		});

		it('invalid dni format', () => {
			return request(app)
				.get(`${BASE_PATH}/users/50asd`)
				.set('authorization', globals.token)
				.expect(400);
		});

		it('doesn\'t supply token', () => {
			return request(app)
				.get(`${BASE_PATH}/users/50000000`)
				.expect(401);
		});

		it('supplies invalid token', () => {
			return request(app)
				.get(`${BASE_PATH}/users/50000000`)
				.set('authorization', 'invalidToken')
				.expect(401);
		});

		it('supplies expired token', () => {
			return request(app)
				.get(`${BASE_PATH}/users/50000000`)
				.set('authorization', globals.expiredToken)
				.expect(401);
		});
	});
});
