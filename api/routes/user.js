const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.get('/', userController.getAllUser);

router.post('/register', userController.register);

router.post('/login', userController.loginUser);

module.exports = router;