
const requesLimitsModel = require('../models/requestLimitsModel');

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
				console.error(error.message);
				if(error.name === 'CastError') {
					res.sendStatus(400);
				}else {
					res.sendStatus(500);
				}
			});
	}else if(!req.body.limit) {
		res.sendStatus(400);
	}else {
		res.status(401).send('You can only change your own request limit.');
	}
};