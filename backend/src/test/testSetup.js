
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

/* ---- Token generator ---- */

exports.generateTokenForTests = (dni, limit) => {
	return new Promise((resolve, reject) => generateTokenForTests(dni, limit, resolve, reject));
};

exports.generateExpiredToken = dni => {
	return jwt.sign({dni}, config.tokenSecretKey, {expiresIn: '0h'});
};

function generateTokenForTests(dni, limit, resolve, reject) {
	const token = jwt.sign({dni}, config.tokenSecretKey, {expiresIn: '1h'});
	requestLimitsModel.updateRequestLimit(dni, {limit, uses: 0})
		.then(result => resolve && resolve(token))
		.catch(error => reject && reject(error));
}