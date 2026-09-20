const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// GET /api/alerts - Query alerts with status/severity filters
router.get('/', alertController.getAlerts);

// POST /api/alerts - Create an alert
router.post('/', alertController.createAlert);

// PATCH /api/alerts/:id - Acknowledge or resolve an alert
router.patch('/:id', alertController.updateAlertStatus);

module.exports = router;
