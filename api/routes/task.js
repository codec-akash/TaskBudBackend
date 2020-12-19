const express = require('express');
const app = require('../../app');
const router = express.Router();

const taskController = require('../controller/taskController');

router.post('/addTask', taskController.addTask);

module.exports = router;