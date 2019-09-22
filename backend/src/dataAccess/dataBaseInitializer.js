
const config = require('../resources/config');
const initAmmount = config.DBInitializer.initUsersAmmount;
const firstDni = config.DBInitializer.firstDNI;
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
	for(let i = 0; i < initAmmount; i++) {
		usersModel.createUser({
			dni: firstDni + i,
			email: `${firstDni + i}@tpfullstack.com`,
			password: '123456',
			creditScore: Math.floor(Math.random() * 5) + 1
		}, false);
	}
	console.log(`${initAmmount} users created`);
}