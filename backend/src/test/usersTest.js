
const testSetup = require('./testSetup');
const usersRouter = require('../routers/usersRouter');
const request = require('supertest');
const assert = require('assert');
const express = require('express');
const app = express();
const globals = {};

app.use(express.json());
app.use('/api/users', usersRouter);

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

	describe('POST:users', () => {
		it('creates non-existing user', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: 40000000,
					email: '40000000@tpFullstack.com',
					password: '123456',
					creditScore: 5
				})
				.expect(201);
		});

		it('creates existing user', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: 50000000,
					email: '50000000@tpFullstack.com',
					password: '123456',
					creditScore: 5
				})
				.expect(400);
		});

		it('string dni', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: '40000001',
					email: '40000001@tpFullstack.com',
					password: '123456',
					creditScore: 5
				})
				.expect(201);
		});

		it('invalid dni', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: 30,
					email: '50000000@tpFullstack.com',
					password: '123456',
					creditScore: 5
				})
				.expect(400);
		});

		it('negative dni', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: -30000000,
					email: '30000000@tpFullstack.com',
					password: '123456',
					creditScore: 5
				})
				.expect(400);
		});

		it('number password', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: 40000002,
					email: '40000002@tpFullstack.com',
					password: 123456,
					creditScore: 5
				})
				.expect(201);
		});

		it('credit score higher than 5', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: '30000000',
					email: '50000000@tpFullstack.com',
					password: '123456',
					creditScore: 8
				})
				.expect(400);
		});

		it('credit score lower than 1', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: '30000000',
					email: '50000000@tpFullstack.com',
					password: '123456',
					creditScore: 0
				})
				.expect(400);
		});

		it('missing dni field', () => {
			return request(app)
				.post('/api/users')
				.send({
					email: '50000000@tpFullstack.com',
					password: '123456',
					creditScore: 8
				})
				.expect(400);
		});

		it('missing email field', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: '30000000',
					password: '123456',
					creditScore: 8
				})
				.expect(400);
		});

		it('missing password field', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: '30000000',
					email: '50000000@tpFullstack.com',
					creditScore: 8
				})
				.expect(400);
		});

		it('missing credit score field', () => {
			return request(app)
				.post('/api/users')
				.send({
					dni: '30000000',
					email: '50000000@tpFullstack.com',
					password: '123456'
				})
				.expect(400);
		});
	});

	describe('GET:users/{id}', () => {
		it('gets existing user', done => {
			request(app)
				.get('/api/users/50000000')
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
				.get('/api/users/00000000')
				.set('authorization', globals.token)
				.expect(404);
		});

		it('invalid dni length', () => {
			return request(app)
				.get('/api/users/50')
				.set('authorization', globals.token)
				.expect(404);
		});

		it('invalid dni format', () => {
			return request(app)
				.get('/api/users/50asd')
				.set('authorization', globals.token)
				.expect(400);
		});

		it('doesn\'t supply token', () => {
			return request(app)
				.get('/api/users/50000000')
				.expect(401);
		});

		it('supplies invalid token', () => {
			return request(app)
				.get('/api/users/50000000')
				.set('authorization', 'invalidToken')
				.expect(401);
		});

		it('supplies expired token', () => {
			return request(app)
				.get('/api/users/50000000')
				.set('authorization', globals.expiredToken)
				.expect(401);
		});
	});

	describe('POST:users/get', () => {
		it('passes 1 dni', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: 50000000}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 1);
					assert.strictEqual(result.body[0].dni, 50000000);
					done();
				})
				.catch(error => done(error));
		});

		it('passes 2 dni', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: 50000000}, {dni: 50000001}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 2);
					assert.strictEqual(result.body[0].dni, 50000000);
					assert.strictEqual(result.body[1].dni, 50000001);
					done();
				})
				.catch(error => done(error));
		});

		it('passes 1 cuit', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{cuit: '23-50000000-9'}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 1);
					assert.strictEqual(result.body[0].dni, 50000000);
					done();
				})
				.catch(error => done(error));
		});

		it('passes 2 cuit', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{cuit: '23-50000000-9'}, {cuit: '23-50000001-9'}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 2);
					assert.strictEqual(result.body[0].dni, 50000000);
					assert.strictEqual(result.body[1].dni, 50000001);
					done();
				})
				.catch(error => done(error));
		});

		it('passes 1 dni and 1 cuit', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: 50000000}, {cuit: '23-50000001-9'}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 2);
					assert.strictEqual(result.body[0].dni, 50000000);
					assert.strictEqual(result.body[1].dni, 50000001);
					done();
				})
				.catch(error => done(error));
		});

		it('passes 2 identical dni', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: 50000000}, {dni: 50000000}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 1);
					assert.strictEqual(result.body[0].dni, 50000000);
					done();
				})
				.catch(error => done(error));
		});

		it('passes 1 existing dni and 1 non-existing dni', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: 50000000}, {dni: 10000000}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 1);
					assert.strictEqual(result.body[0].dni, 50000000);
					done();
				})
				.catch(error => done(error));
		});

		it('passes empty list', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 0);
					done();
				})
				.catch(error => done(error));
		});

		it('passes invalid body structure', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dnnnni: 50000000}, {dni: 50000001}])
				.expect(400);
		});

		it('passes 1 invalid dni length and 1 cuit', done => {
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: 50000}, {cuit: '23-50000001-9'}])
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 1);
					assert.strictEqual(result.body[0].dni, 50000001);
					done();
				})
				.catch(error => done(error));
		});

		it('passes 1 string dni and 1 cuit', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: '50000000asd'}, {cuit: '23-50000001-9'}])
				.expect(400);
		});

		it('passes 1 dni and 1 number cuit', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: 50000000}, {cuit: 50000001}])
				.expect(400);
		});

		it('passes 1 invalid cuit', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{cuit: '23-9-50000001'}])
				.expect(400);
		});

		it('passes 1 null dni', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{dni: null}])
				.expect(400);
		});

		it('passes 1 null cuit', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send([{cuit: null}])
				.expect(400);
		});

		it('stress by passing 5000 dni', done => {
			const dnis = [];
			for(let i = 0; i < 5000; i++) {
				dnis.push({dni: 50000000 + i});
			}
			request(app)
				.post('/api/users/get')
				.set('authorization', globals.token)
				.send(dnis)
				.expect(200)
				.then(result => {
					assert.strictEqual(result.body.length, 5000);
					done();
				})
				.catch(error => done(error));
		});

		it('doesn\'t supply token', () => {
			return request(app)
				.post('/api/users/get')
				.send([])
				.expect(401);
		});

		it('supplies invalid token', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', 'invalidToken')
				.send([])
				.expect(401);
		});

		it('supplies expired token', () => {
			return request(app)
				.post('/api/users/get')
				.set('authorization', globals.expiredToken)
				.send([])
				.expect(401);
		});

	});
});
