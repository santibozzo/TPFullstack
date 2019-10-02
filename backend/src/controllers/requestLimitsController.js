
const requesLimitsModel = require('../models/requestLimitsModel');

exports.getRequestLimit = (req, res) => {
	if(req.params.dni === res.locals.dni) {
		requesLimitsModel.getRequestLimit(req.params.dni)
			.then(requestLimit => {
				res.status(200).send(requestLimit.toObject());
			})
			.catch(error => {
				res.sendStatus(500);
			});
	}else {
		res.status(401).send('You can only see your own request limit');
	}
};

exports.updateLimit = (req, res) => {
	if((req.params.dni === res.locals.dni) && req.body.limit) {
		requesLimitsModel.updateRequestLimit(req.params.dni, {limit: req.body.limit, uses: 0})
			.then(result => {
				if(result.n > 0) {
					res.sendStatus(200);
				}else {
					res.sendStatus(500);
				}
			})
			.catch(error => {
				if(error.name === 'CastError' || error.name === 'ValidationError') {
					res.sendStatus(400);
				}else {
					res.sendStatus(500);
				}
			});
	}else if(!req.body.limit) {
		res.sendStatus(400);
	}else {
		res.status(401).send('You can only change your own request limit');
	}
};