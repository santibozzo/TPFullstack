
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	dni: {type: Number, unique: true, required: true, validate: dni => dni.toString().length === 8},
	email: {type: String, required: true},
	password: {type: String, required: true},
	creditScore: {type: Number, required: true, validate: score => 0 <= score && score <= 5}
});
const user = mongoose.model('users', userSchema);
const userCreditScoreProj = {_id: false, __v: false, email: false, password: false};
const userInfoProj = {_id: false, __v: false};

exports.createUser = (userInfo, log = true) => {
	return new Promise((resolve, reject) => createUser(userInfo, log, resolve, reject));
};
exports.getUser = dni => {
	return new Promise((resolve, reject) => getUser(dni, resolve, reject));
};
exports.getUsersList = dniList => {
	return new Promise((resolve, reject) => getUsersList(dniList, resolve, reject));
};

function createUser(userInfo, log, resolve, reject) {
	const newUser = new user(userInfo);
	newUser.save()
		.then(() => {
			log && console.log(`User ${userInfo.dni} created`);
			resolve && resolve(`User ${userInfo.dni} created`);
		})
		.catch(error => reject && reject(error));
}

function getUser(dni, resolve, reject) {
	user.find({dni}, userInfoProj)
		.then(result => {
			if(result.length === 0) {
				reject && reject(new Error('documentNotFound'));
			}
			resolve && resolve(result[0]);
		})
		.catch(error => reject && reject(error));
}

function getUsersList(dniList, resolve, reject) {
	user.find({dni: {$in: dniList}}, userCreditScoreProj)
		.then(result => resolve && resolve(result))
		.catch(error => reject && reject(error));
}