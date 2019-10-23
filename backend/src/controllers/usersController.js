
const usersModel = require('../models/usersModel');
const requestLimitsModel = require('../models/requestLimitsModel');

exports.createUser = (req, res) => {
	usersModel.createUser(req.body)
		.then(response => {
			res.status(201).send(response);
		})
		.catch(error => {
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
	checkInfoRequestLimit(1, res.locals.dni)
		.then(isUnderLimit => {
			if(isUnderLimit) {
				usersModel.getUser(req.params.dni)
					.then(user => {
						const userInfo = user.toObject();
						delete userInfo.password;
						updateInfoRequestUses(1, res.locals.dni);
						res.status(200).send(userInfo);
					})
					.catch(error => {
						if(error.message === 'documentNotFound') {
							res.status(404).send('User not found');
						}else if(error.name === 'CastError') {
							res.status(400).send('Invalid user DNI');
						}else {
							res.sendStatus(500);
						}
					});
			}else {
				res.status(401).send('User\'s info requests limit overpassed');
			}
		})
		.catch(error => res.sendStatus(500));
};

exports.getUsersList = (req, res) => {
	checkInfoRequestLimit(req.body.length, res.locals.dni)
		.then(isUnderLimit => {
			if(isUnderLimit) {
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
					.then(users => {
						updateInfoRequestUses(req.body.length, res.locals.dni);
						res.status(200).send(users);
					})
					.catch(error => {
						console.error(error);
						res.sendStatus(500);
					});
			}else {
				res.status(401).send('User\'s info requests limit overpassed');
			}
		})
		.catch(error => res.sendStatus(500));
};

exports.deleteUser = (req, res) => {
	if(req.params.dni !== res.locals.dni) {
		res.status(401).send('Can only delete own user');
	}else {
		usersModel.deleteUser(req.params.dni)
			.then(result => {
				requestLimitsModel.deleteRequestLimit(req.params.dni);
				res.status(200).send(`User ${req.params.dni} deleted`);
			})
			.catch(error => {
				if(error.message === 'documentNotFound') {
					res.status(404).send('User not found');
				}else {
					res.sendStatus(500);
				}
			});
	}
};

function hasValidDni(user) {
	return user.dni && Number.isInteger(user.dni);
}

function hasValidCuit(user) {
	if(user.cuit) {
		const parts = user.cuit.toString().split('-');
		return (
			parts.length === 3 &&
			parts[0].length === 2 &&
			parts[1].length === 8 &&
			parts[2].length === 1 &&
			Number.isInteger(parseInt(parts[1], 10))
		);
	}
	return false;
}

function checkInfoRequestLimit(ammountToProcess, dni) {
	return new Promise((resolve, reject) => {
		requestLimitsModel.getRequestLimit(dni)
			.then(requestLimit => {
				if((ammountToProcess + requestLimit.infoRequestUses) > requestLimit.infoRequestLimit) {
					resolve && resolve(false);
				}else {
					resolve && resolve(true);
				}
			})
			.catch(error => reject && reject(error));
	});
}

function updateInfoRequestUses(usesToAdd, dni) {
	requestLimitsModel.getRequestLimit(dni)
		.then(requestLimit => requestLimitsModel.updateRequestLimit(dni, {infoRequestUses: requestLimit.infoRequestUses + usesToAdd}));
}
