const INIT_USERS = 50;

const usersModel = require('../models/usersModel');
const mongoose = require('mongoose');
const connection = mongoose.connection;

exports.initializeDataBase = () => {
	connection.db.collection('users').countDocuments()
		.then(count => count === 0 && populateUsers())
		.catch(error => console.error(error));
};

function populateUsers() {
	console.log('Populating users collection...');
	for(let i = 0; i < INIT_USERS; i++) {
		usersModel.createUser({
			dni: 50000000 + i,
			email: `${50000000 + i}@tpfullstack.com`,
			password: '123456',
			creditScore: Math.floor(Math.random() * 5) + 1
		}, false);
	}
	console.log(`${INIT_USERS} users created`);
}