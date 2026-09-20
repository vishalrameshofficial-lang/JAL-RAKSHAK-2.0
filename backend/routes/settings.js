const express = require('express');
const router = express.Router();
const storageService = require('../services/storageService');

// GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    const settings = await storageService.getSettings();
    return res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

// POST /api/settings - Update threshold configurations
router.post('/', async (req, res, next) => {
  try {
    const updates = req.body;
    const updated = await storageService.updateSettings(updates);
    const io = req.app.get('io');
    if (io) {
      io.emit('settings_updated', updated);
    }
    return res.status(200).json({
      success: true,
      message: 'Monitoring thresholds updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
