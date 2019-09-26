
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requestLimitSchema = new Schema({
	dni: {type: Number, unique: true, required: true, validate: dni => dni.toString().length === 8},
	limit: {type: Number, required: true, default: 10, min: 1},
	uses: {type: Number, required: true, default: 0},
	lastRefresh: {type: String, required: true, default: moment().format('DD/MM-HH:mm')}
});
const requestLimit = mongoose.model('requestLimits', requestLimitSchema);
const requestLimitProj = {_id: false, __v: false};

exports.createRequestLimit = dni => {
	return new Promise((resolve, reject) => createRequestLimit(dni, resolve, reject));
};
exports.getRequestLimit = dni => {
	return new Promise((resolve, reject) => getRequestLimit(dni, resolve, reject));
};
exports.updateRequestLimit = (dni, newValues) => {
	return new Promise((resolve, reject) => updateRequestLimit(dni, newValues, resolve, reject));
};

function createRequestLimit(dni, resolve, reject) {
	const newRequestLimit = new requestLimit({dni});
	newRequestLimit.save()
		.then(() => {
			resolve && resolve(newRequestLimit);
		})
		.catch(error => reject && reject(error));
}

function getRequestLimit(dni, resolve, reject) {
	requestLimit.find({dni}, requestLimitProj)
		.then(result => {
			if(result.length === 0) {
				reject && reject(new Error('documentNotFound'));
			}
			resolve && resolve(result[0]);
		})
		.catch(error => reject && reject(error));
}

function updateRequestLimit(dni, newValues, resolve, reject) {
	requestLimit.updateOne({dni}, newValues)
		.then(result => {
			resolve && resolve(result);
		})
		.catch(error => reject && reject(error));
}