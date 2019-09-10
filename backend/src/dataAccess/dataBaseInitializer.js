
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
	usersModel.createUser('santibozzo', 24);
}