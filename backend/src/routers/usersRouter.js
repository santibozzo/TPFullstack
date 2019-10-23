
const usersController = require('../controllers/usersController');
const authInterceptor = require('../interceptors/authInterceptor');
const express = require('express');
const router = express.Router();

router.post('', usersController.createUser);
router.get('/:dni', authInterceptor.validateToken, usersController.getUser);
router.post('/get', authInterceptor.validateToken, usersController.getUsersList);
router.delete('/:dni', authInterceptor.validateToken, usersController.deleteUser);

module.exports = router;
