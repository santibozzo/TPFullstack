const SECRET = 'secretKey';

const requestLimitsModel = require('../models/requestLimitsModel');
const moment = require('moment');
const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
	let token = req.headers['authorization'];
	if(token && token.startsWith('Bearer ')) {
		token = token.splice(7, token);
	}
	if(token) {
		jwt.verify(token, SECRET, (err, decoded) => {
			if(decoded) {
				const dni = decoded.dni;
				checkRequestLimit(dni, res, next);
			}else {
				res.status(401).send('Invalid token');
			}
		});
	}else {
		res.status(401).send('Token not supplied');
	}
};

function checkRequestLimit(dni, res, next) {
	requestLimitsModel.getRequestLimit(dni)
		.then(requesLimit => {
			if(moment().isAfter(moment(requesLimit.lastRefresh, 'DD/MM-HH:mm').add(1, 'days'))) {
				requestLimitsModel.updateRequestLimit(dni, {uses: 0, lastRefresh: moment().format('DD/MM-HH:mm')});
				next();
			}else if(requesLimit.uses < requesLimit.limit) {
				requestLimitsModel.updateRequestLimit(dni, {uses: requesLimit.uses + 1});
				next();
			}else {
				res.status(401).send('Requests limit reached');
			}
		})
		.catch(error => {
			console.error(error.message);
			if(error.message === 'documentNotFound') {
				requestLimitsModel.createRequestLimit(dni)
					.then(response => checkRequestLimit(dni, res, next))
					.catch(error => res.sendStatus(500));
			}else {
				res.sendStatus(500);
			}
		});
}