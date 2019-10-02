
const testSetup = require('./testSetup');
const requestLimitsRouter = require('../routers/requestLimitsRouter');
const request = require('supertest');
const assert = require('assert');
const express = require('express');
const app = express();
const globals = {};

app.use(express.json());
app.use('/api/request-limits', requestLimitsRouter);

describe('RequestLimits tests', () => {
	before(done => {
		globals['expiredToken'] = testSetup.generateExpiredToken(50000001);
		testSetup.generateTokenForTests(50000001, 200)
			.then(token => {
				globals['token'] = token;
				done();
			})
			.catch(error => done(error));
	});

	describe('GET:request-limits/{dni}', () => {
		it('get own limit', done => {
			request(app)
				.get('/api/request-limits/50000001')
				.set('authorization', globals.token)
				.expect(200)
				.then(response => {
					assert.strictEqual(response.body.dni, 50000001);
					assert.strictEqual(response.body.limit, 200);
					assert.ok(response.body.uses > 0);
					done();
				})
				.catch(error => done(error));
		});

		it('get other limit', () => {
			return request(app)
				.get('/api/request-limits/50000000')
				.set('authorization', globals.token)
				.expect(401);
		});

		it('invalid dni', () => {
			return request(app)
				.get('/api/request-limits/500')
				.set('authorization', globals.token)
				.expect(401);
		});

		it('doesn\'t supply token', () => {
			return request(app)
				.get('/api/request-limits/50000001')
				.expect(401);
		});

		it('supplies invalid token', () => {
			return request(app)
				.get('/api/request-limits/50000001')
				.set('authorization', 'invalidToken')
				.expect(401);
		});

		it('supplies expired token', () => {
			return request(app)
				.get('/api/request-limits/50000001')
				.set('authorization', globals.expiredToken)
				.expect(401);
		});
	});

	describe('PATCH:request-limits/{dni}', () => {
		it('change own limit', done => {
			request(app)
				.patch('/api/request-limits/50000001')
				.set('authorization', globals.token)
				.send({limit: 250})
				.expect(200)
				.then(() => {
					request(app)
						.get('/api/request-limits/50000001')
						.set('authorization', globals.token)
						.expect(200)
						.then(response => {
							assert.strictEqual(response.body.limit, 250);
							assert.strictEqual(response.body.uses, 1);
							done();
						})
						.catch(error => done(error));
				})
				.catch(error => done(error));
		});

		it('change other limit', () => {
			return request(app)
				.patch('/api/request-limits/50000000')
				.set('authorization', globals.token)
				.send({limit: 250})
				.expect(401);
		});

		it('invalid dni', () => {
			return request(app)
				.patch('/api/request-limits/500')
				.set('authorization', globals.token)
				.send({limit: 250})
				.expect(401);
		});

		it('invalid limit', () => {
			return request(app)
				.patch('/api/request-limits/50000001')
				.set('authorization', globals.token)
				.send({limit: 'asd'})
				.expect(400);
		});

		it('limit below 1', () => {
			return request(app)
				.patch('/api/request-limits/50000001')
				.set('authorization', globals.token)
				.send({limit: -1})
				.expect(400);
		});

		it('null limit', () => {
			return request(app)
				.patch('/api/request-limits/50000001')
				.set('authorization', globals.token)
				.send({limit: null})
				.expect(400);
		});

		it('missing limit field', () => {
			return request(app)
				.patch('/api/request-limits/50000001')
				.set('authorization', globals.token)
				.send({})
				.expect(400);
		});

		it('doesn\'t supply token', () => {
			return request(app)
				.patch('/api/request-limits/50000001')
				.expect(401);
		});

		it('supplies invalid token', () => {
			return request(app)
				.patch('/api/request-limits/50000001')
				.set('authorization', 'invalidToken')
				.expect(401);
		});

		it('supplies expired token', () => {
			return request(app)
				.patch('/api/request-limits/50000001')
				.set('authorization', globals.expiredToken)
				.expect(401);
		});
	});
});