const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// POST /api/sensor-data - Ingest ESP32 or simulated sensor telemetry
router.post('/', sensorController.postSensorData);

// GET /api/sensor-data/latest - Fetch latest reading and connection state
router.get('/latest', sensorController.getLatestSensorData);

// GET /api/sensor-data/history - Fetch filtered historical time-series
router.get('/history', sensorController.getSensorHistory);

// GET /api/sensor-data/export - Export dataset as CSV
router.get('/export', sensorController.exportSensorDataCsv);

module.exports = router;
