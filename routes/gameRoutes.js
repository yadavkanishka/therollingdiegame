const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');

router.get('/inventory', gameController.showInventory);

module.exports = router;