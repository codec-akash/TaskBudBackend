const express = require('express');
const router = express.Router();

const check_auth = require('../middleware/checkAuth');

const userController = require('../controller/userController');

router.get('/', userController.getAllUser);

router.post('/register', userController.register);

router.post('/login', userController.loginUser);

router.patch('/resetPassword', check_auth, userController.updatePassword);

router.patch('/forgotPassword', userController.forgotPassword);

module.exports = router;