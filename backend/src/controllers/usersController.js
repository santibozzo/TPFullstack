
const usersModel = require('../models/usersModel');

exports.createUser = (req, res) => {
	usersModel.createUser(req.body)
		.then(response => {
			const user = response.toObject();
			obfuscateUser(user);
			res.status(201).send(user);
		})
		.catch(error => {
			console.error(error.message);
			if(error.code === 11000) {
				res.status(400).send('DNI already in use');
			}else if(error.name === 'ValidationError') {
				res.status(400).send('Invalid user structure');
			}else {
				res.sendStatus(500);
			}
		});
};

exports.getUser = (req, res) => {
	usersModel.getUser(req.params.dni)
		.then(response => {
			const user = response.toObject();
			obfuscateUser(user);
			res.status(200).send(user);
		})
		.catch(error => {
			console.error(error.message);
			if(error.message === 'documentNotFound') {
				res.status(404).send('User not found');
			}else if(error.name === 'CastError') {
				res.status(400).send('Invalid user DNI');
			}else {
				res.sendStatus(500);
			}
		});
};

function obfuscateUser(user) {
	delete user._id;
	delete user.__v;
	delete user.password;
}