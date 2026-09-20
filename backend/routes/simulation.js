const express = require('express');
const router = express.Router();
const simulatorService = require('../services/simulatorService');

// GET /api/simulation/status
router.get('/status', (req, res) => {
  return res.status(200).json({
    success: true,
    data: simulatorService.getStatus()
  });
});

// POST /api/simulation/toggle
router.post('/toggle', (req, res) => {
  const { action } = req.body; // 'start', 'pause', or 'toggle'
  if (action === 'pause') {
    simulatorService.pause();
  } else if (action === 'start') {
    simulatorService.resume();
  } else {
    if (simulatorService.isRunning) simulatorService.pause();
    else simulatorService.resume();
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('simulation_state_changed', simulatorService.getStatus());
  }

  return res.status(200).json({
    success: true,
    message: `Simulator is now ${simulatorService.isRunning ? 'RUNNING' : 'PAUSED'}`,
    data: simulatorService.getStatus()
  });
});

// POST /api/simulation/anomaly
router.post('/anomaly', (req, res) => {
  const { mode } = req.body; // 'TURBIDITY_SURGE', 'ACID_RUNOFF', 'TEMP_SPIKE', 'LOW_WATER', 'NONE'
  simulatorService.setAnomaly(mode || 'TURBIDITY_SURGE');

  const io = req.app.get('io');
  if (io) {
    io.emit('simulation_anomaly_injected', { mode, timestamp: new Date() });
  }

  return res.status(200).json({
    success: true,
    message: `Anomaly injected: ${mode}`,
    data: simulatorService.getStatus()
  });
});

// POST /api/simulation/reset
router.post('/reset', (req, res) => {
  simulatorService.reset();

  const io = req.app.get('io');
  if (io) {
    io.emit('simulation_reset', { timestamp: new Date() });
  }

  return res.status(200).json({
    success: true,
    message: 'Simulation and memory reset to clean baseline.',
    data: simulatorService.getStatus()
  });
});

module.exports = router;
