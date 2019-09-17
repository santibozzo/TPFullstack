
const loginController = require('../controllers/loginController');
const express = require('express');
const router = express.Router();

router.post('', loginController.login);

module.exports = router;