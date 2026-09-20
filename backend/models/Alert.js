const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    default: 'JR001'
  },
  type: {
    type: String,
    required: true,
    enum: ['TURBIDITY_ANOMALY', 'PH_ANOMALY', 'TDS_ANOMALY', 'TEMPERATURE_ANOMALY', 'WATER_LEVEL_ANOMALY', 'DEVICE_OFFLINE', 'MULTIPLE_INDICATORS_ANOMALY']
  },
  severity: {
    type: String,
    enum: ['NORMAL', 'WARNING', 'CRITICAL'],
    default: 'WARNING'
  },
  parameter: {
    type: String,
    default: 'turbidity'
  },
  triggerValue: {
    type: Number
  },
  thresholdValue: {
    type: Number
  },
  message: {
    type: String,
    required: true
  },
  recommendedAction: {
    type: String,
    default: 'Inspect water source and consider laboratory verification.'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'],
    default: 'ACTIVE'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
