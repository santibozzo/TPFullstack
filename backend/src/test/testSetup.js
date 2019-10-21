
const config = require('../resources/config');
const dataBase = config.dataBase;
const jwt = require('jsonwebtoken');
const requestLimitsModel = require('../models/requestLimitsModel');
const mongoose = require('mongoose');
const dataBaseInitializer = require('../dataAccess/dataBaseInitializer');

/* ---- DB Initializer ---- */

const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dataBase.host}:${dataBase.port}/${dataBase.name}Test`, connectionOptions)
	.then(() => {
		console.log('Connected to test DB');
		dataBaseInitializer.initializeDataBase()
			.then(() => run())
			.catch(error => console.error(error));
	})
	.catch(error => console.error(error));

/* ---- DB Cleanup ---- */

after(done => {
	mongoose.connection.db.dropDatabase((err, result) => {
		if(err) {
			console.error(err);
			done(err);
		}
		console.log('Test DB dropped');
		done();
	});
});

/* ---- Token generator ---- */

exports.generateTokenForTests = (dni, limit, infoRequestLimit = 10000) => {
	return new Promise((resolve, reject) => generateTokenForTests(dni, limit, infoRequestLimit, resolve, reject));
};

exports.generateExpiredToken = dni => {
	return jwt.sign({dni}, config.tokenSecretKey, {expiresIn: '0h'});
};

function generateTokenForTests(dni, limit, infoRequestLimit, resolve, reject) {
	const token = jwt.sign({dni}, config.tokenSecretKey, {expiresIn: '1h'});
	requestLimitsModel.createRequestLimit(dni)
		.then(result => {
			requestLimitsModel.updateRequestLimit(dni, {limit, uses: 0, infoRequestLimit, infoRequestUses: 0})
				.then(result => resolve && resolve(token))
				.catch(error => reject && reject(error));
		})
		.catch(error => reject && reject(error));
}