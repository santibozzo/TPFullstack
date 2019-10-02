
const config = require('../resources/config');
const loginRouter = require('../routers/loginRouter');
const request = require('supertest');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/login', loginRouter);

describe('Login tests', () => {
	describe('POST:login', () => {
		it('login with existing user', done => {
			request(app)
				.post('/api/login')
				.send({dni: 50000003, password: '123456'})
				.expect(200)
				.then(response => {
					jwt.verify(response.body.token, config.tokenSecretKey, (err, decoded) => {
						assert.ok(decoded);
						assert.strictEqual(decoded.dni, 50000003);
						done();
					});
				})
				.catch(error => done(error));
		});

		it('login with non-existing user', () => {
			return request(app)
				.post('/api/login')
				.send({dni: 10000000, password: '123456'})
				.expect(404);
		});

		it('invalid dni', () => {
			return request(app)
				.post('/api/login')
				.send({dni: 500, password: '123456'})
				.expect(404);
		});

		it('negative dni', () => {
			return request(app)
				.post('/api/login')
				.send({dni: -50000003, password: '123456'})
				.expect(404);
		});

		it('string dni', () => {
			return request(app)
				.post('/api/login')
				.send({dni: '50000003', password: '123456'})
				.expect(400);
		});

		it('existing user, wrong password', () => {
			return request(app)
				.post('/api/login')
				.send({dni: 50000003, password: '12345'})
				.expect(401);
		});

		it('number password', () => {
			return request(app)
				.post('/api/login')
				.send({dni: 50000003, password: 123456})
				.expect(401);
		});

		it('missing dni field', () => {
			return request(app)
				.post('/api/login')
				.send({password: '123456'})
				.expect(400);
		});

		it('missing password field', () => {
			return request(app)
				.post('/api/login')
				.send({dni: 50000003})
				.expect(400);
		});

		it('empty body', () => {
			return request(app)
				.post('/api/login')
				.send({})
				.expect(400);
		});
	});
});