
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	dni: {type: Number, unique: true, required: true, validate: dni => dni.toString().length === 8},
	email: {type: String, required: true},
	password: {type: String, required: true},
	creditScore: {type: Number, required: true, validate: score => 0 <= score && score <= 5}
});
const user = mongoose.model('users', userSchema);

exports.createUser = (userInfo, log = true) => {
	return new Promise((resolve, reject) => createUser(userInfo, log, resolve, reject));
};
exports.getUser = dni => {
	return new Promise((resolve, reject) => getUser(dni, resolve, reject));
};

function createUser(userInfo, log, resolve, reject) {
	const newUser = new user(userInfo);
	newUser.save()
		.then(() => {
			log && console.log(`User ${userInfo.dni} created`);
			resolve && resolve(newUser);
		})
		.catch(error => reject && reject(error));
}

function getUser(dni, resolve, reject) {
	user.find({dni})
		.then(result => {
			if(result.length === 0) {
				reject && reject(new Error('documentNotFound'));
			}
			resolve && resolve(result[0]);
		})
		.catch(error => reject && reject(error));
}