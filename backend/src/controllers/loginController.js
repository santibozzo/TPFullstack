const SECRET = 'secretKey';

const usersModel = require('../models/usersModel');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
	if(req.body.dni && Number.isInteger(req.body.dni) && req.body.password) {
		usersModel.getUser(req.body.dni)
			.then(user => {
				if(user.password === req.body.password) {
					const token = jwt.sign({dni: req.body.dni}, SECRET, {expiresIn: '1h'});
					res.status(200).send({token});
				}else {
					res.status(401).send('Wrong password');
				}
			})
			.catch(error => {
				console.error(error.message);
				if(error.message === 'documentNotFound') {
					res.status(404).send('User not found');
				}else {
					res.sendStatus(500);
				}
			});
	}else {
		res.status(400).send('Invalid body structure');
	}
};
