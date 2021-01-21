const express = require('express');
const app = require('../../app');
const router = express.Router();

const appDataController = require('../controller/appDataController');

router.get('/', appDataController.getAppData);

// router.post('/', appDataController.addAppData);

router.patch('/', appDataController.updateAppData);

module.exports = router;