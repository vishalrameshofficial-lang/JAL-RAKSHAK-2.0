const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global_settings'
  },
  thresholds: {
    ph: {
      minWarning: { type: Number, default: 6.5 },
      maxWarning: { type: Number, default: 8.5 },
      minCritical: { type: Number, default: 6.0 },
      maxCritical: { type: Number, default: 9.0 }
    },
    tds: {
      warning: { type: Number, default: 300 },
      critical: { type: Number, default: 500 }
    },
    turbidity: {
      warning: { type: Number, default: 4.0 },
      critical: { type: Number, default: 8.0 }
    },
    temperature: {
      minWarning: { type: Number, default: 15.0 },
      maxWarning: { type: Number, default: 32.0 },
      minCritical: { type: Number, default: 10.0 },
      maxCritical: { type: Number, default: 38.0 }
    },
    waterLevel: {
      lowWarning: { type: Number, default: 25.0 },
      lowCritical: { type: Number, default: 15.0 },
      highWarning: { type: Number, default: 90.0 },
      highCritical: { type: Number, default: 95.0 }
    }
  },
  station: {
    deviceId: { type: String, default: 'JR001' },
    name: { type: String, default: 'JAL-RAKSHAK NODE 01' },
    location: { type: String, default: 'Indus Environmental Hydrology Basin, Station Alpha' },
    latitude: { type: Number, default: 28.6139 },
    longitude: { type: Number, default: 77.2090 },
    offlineTimeoutSeconds: { type: Number, default: 15 }
  },
  notifications: {
    emailAlerts: { type: Boolean, default: false },
    browserPush: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true }
  },
  simulation: {
    enabled: { type: Boolean, default: true },
    intervalMs: { type: Number, default: 3000 },
    anomalyMode: { type: String, default: 'NONE' } // NONE, TURBIDITY_SURGE, ACID_RUNOFF, TEMP_SPIKE, LOW_WATER
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
