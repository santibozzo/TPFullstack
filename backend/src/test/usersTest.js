
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
				.send([{dni: 50000000}, {dni: 40000000}])
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
