const express = require('express');
const app = require('../../app');
const router = express.Router();

const check_auth = require('../middleware/checkAuth');
const taskController = require('../controller/taskController');

router.post('/addTask', check_auth, taskController.addTask);

router.get("/", check_auth, taskController.getUserTask);

module.exports = router;