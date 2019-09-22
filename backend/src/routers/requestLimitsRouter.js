
const requestLimitsController = require('../controllers/requestLimitsController');
const authInterceptor = require('../interceptors/authInterceptor');
const express = require('express');
const router = express.Router();

router.get('/:dni', authInterceptor.validateToken, requestLimitsController.getRequestLimit);
router.patch('/:dni', authInterceptor.validateToken, requestLimitsController.updateLimit);

module.exports = router;