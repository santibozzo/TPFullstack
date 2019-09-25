
const async = require('async');
const config = require('../resources/config');
const initAmmount = config.DBInitializer.initUsersAmmount;
const firstDni = config.DBInitializer.firstDNI;
const usersModel = require('../models/usersModel');
const mongoose = require('mongoose');
const connection = mongoose.connection;

exports.initializeDataBase = () => {
	return new Promise((resolve, reject) => initializeDataBase(resolve, reject));
};

function initializeDataBase(resolve, reject) {
	connection.db.collection('users').countDocuments()
		.then(count => {
			if(count === 0) {
				populateUsers(resolve, reject);
			}else {
				resolve && resolve('DB already populated');
			}
		})
		.catch(error => {
			console.error(error);
			reject && reject(error);
		});
}

function populateUsers(resolve, reject) {
	console.log('Populating users collection...');
	const tasks = [];
	for(let i = 0; i < initAmmount; i++) {
		tasks.push((callback) => {
			usersModel.createUser({
				dni: firstDni + i,
				email: `${firstDni + i}@tpfullstack.com`,
				password: '123456',
				creditScore: Math.floor(Math.random() * 5) + 1
			}, false)
				.then(result => callback(null, result))
				.catch(error => callback(error.message));
		});
	}
	async.parallel(tasks)
		.then(results => {
			console.log(`${results.length} users created`);
			resolve && resolve(results);
		})
		.catch(error => {
			console.error(error);
			reject && reject(error);
		});
}