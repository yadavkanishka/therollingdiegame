const express = require('express');
const router = express.Router();

const managerController = require('../controllers/managerController');
const { requireManager } = require('../middleware/authMiddleware');

// Protect all manager routes
router.use(requireManager);

// Display the manager dashboard
router.get('/manager', managerController.showDashboard);

// Display the Add Game form
router.get('/manager/games/add', managerController.showAddGame);

// Process the Add Game form
router.post('/manager/games/add', managerController.addGame);

module.exports = router;