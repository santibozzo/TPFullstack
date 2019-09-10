
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	username: {type: String, unique: true},
	age: Number
});
const user = mongoose.model('users', userSchema);

exports.createUser = (username, age) => {
	const newUser = new user({username, age});
	newUser.save()
		.then(() => console.log('New user created'))
		.catch(error => console.error(error));
};