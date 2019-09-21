
const requestLimitsController = require('../controllers/requestLimitsController');
const authInterceptor = require('../interceptors/authInterceptor');
const express = require('express');
const router = express.Router();

router.patch('/:dni', authInterceptor.validateToken, requestLimitsController.updateLimit);

module.exports = router;