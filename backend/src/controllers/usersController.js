
const usersModel = require('../models/usersModel');

exports.createUser = (req, res) => {
	usersModel.createUser(req.body)
		.then(response => {
			res.status(201).send(response);
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
		.then(user => {
			const userInfo = user.toObject();
			delete userInfo.password;
			res.status(200).send(userInfo);
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

exports.getUsersList = (req, res) => {
	const dniList = [];
	for(let user of req.body) {
		if(hasValidDni(user)) {
			dniList.push(user.dni);
		}else if(hasValidCuit(user)) {
			dniList.push(parseInt(user.cuit.split('-')[1], 10));
		}else {
			res.status(400).send('Invalid user structure');
			return;
		}
	}
	usersModel.getUsersList(dniList)
		.then(users => res.status(200).send(users))
		.catch(error => {
			console.error(error);
			res.sendStatus(500);
		});
};

function hasValidDni(user) {
	return user.dni && Number.isInteger(user.dni);
}

function hasValidCuit(user) {
	return user.cuit &&
		user.cuit.toString().split('-').length === 3 &&
		Number.isInteger(parseInt(user.cuit.split('-')[1], 10));
}
