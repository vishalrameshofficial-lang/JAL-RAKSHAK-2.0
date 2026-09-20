const mongoose = require('mongoose');
const SensorReading = require('../models/SensorReading');
const Device = require('../models/Device');
const Alert = require('../models/Alert');
const Settings = require('../models/Settings');

// Default initial settings
const defaultSettings = {
  key: 'global_settings',
  thresholds: {
    ph: { minWarning: 6.5, maxWarning: 8.5, minCritical: 6.0, maxCritical: 9.0 },
    tds: { warning: 300, critical: 500 },
    turbidity: { warning: 4.0, critical: 8.0 },
    temperature: { minWarning: 15.0, maxWarning: 32.0, minCritical: 10.0, maxCritical: 38.0 },
    waterLevel: { lowWarning: 25.0, lowCritical: 15.0, highWarning: 90.0, highCritical: 95.0 }
  },
  station: {
    deviceId: 'JR001',
    name: 'JAL-RAKSHAK NODE 01',
    location: 'Indus Environmental Hydrology Basin, Station Alpha',
    latitude: 28.6139,
    longitude: 77.2090,
    offlineTimeoutSeconds: 20
  },
  notifications: {
    emailAlerts: false,
    browserPush: true,
    soundEnabled: true
  }
};

// Initial device state - OFFLINE until ESP32 connects
const defaultDevice = {
  deviceId: 'JR001',
  name: 'JAL-RAKSHAK NODE 01',
  status: 'OFFLINE',
  lastSeen: null,
  firmwareVersion: 'v2.4.1-esp32',
  location: {
    name: 'Indus Environmental Hydrology Basin, Station Alpha',
    latitude: 28.6139,
    longitude: 77.2090
  },
  wifi: {
    ssid: 'JalRakshak-Secure-IoT',
    rssi: null,
    ip: null
  },
  sensors: {
    ph: { status: 'WAITING', calibratedAt: null },
    tds: { status: 'WAITING', calibratedAt: null },
    turbidity: { status: 'WAITING', calibratedAt: null },
    temperature: { status: 'WAITING', calibratedAt: null },
    waterLevel: { status: 'WAITING', calibratedAt: null }
  },
  hardware: {
    mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
    powerSupply: 'Solar 12V LiFePO4 + Buck Converter',
    loraModule: 'Planned Expansion Socket (SX1278)'
  }
};

// Helper: Calculate indicative Water Health Score (0-100)
function calculateWaterHealthScore(reading) {
  if (!reading || reading.ph === undefined || reading.turbidity === undefined) {
    return null;
  }

  let score = 100;
  
  // pH penalty (optimal 6.8 - 7.6)
  const ph = Number(reading.ph);
  if (ph < 6.5 || ph > 8.5) {
    score -= Math.min(30, Math.abs(ph - 7.2) * 15);
  } else if (ph < 6.8 || ph > 7.6) {
    score -= Math.abs(ph - 7.2) * 6;
  }

  // Turbidity penalty (optimal < 3 NTU)
  const turb = Number(reading.turbidity);
  if (turb > 8.0) score -= 35;
  else if (turb > 4.0) score -= 18;
  else if (turb > 2.5) score -= (turb - 2.5) * 4;

  // TDS penalty (optimal 150 - 300 ppm)
  const tds = Number(reading.tds);
  if (tds > 500) score -= 25;
  else if (tds > 300) score -= 12;

  // Temp penalty (optimal 20 - 30 °C)
  const temp = Number(reading.temperature);
  if (temp < 15 || temp > 35) score -= 15;

  return Math.max(15, Math.min(99, Math.round(score)));
}

// In-Memory store for fast access and fallback - Starts completely EMPTY
class MemoryStore {
  constructor() {
    this.readings = [];
    this.device = { ...defaultDevice };
    this.settings = JSON.parse(JSON.stringify(defaultSettings));
    this.alerts = [];
  }

  clearAllData() {
    this.readings = [];
    this.alerts = [];
    this.device.lastSeen = null;
    this.device.status = 'OFFLINE';
  }

  async saveReading(data) {
    const reading = {
      _id: 'live_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...data,
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      isSimulated: false,
      healthScore: calculateWaterHealthScore(data)
    };
    this.readings.push(reading);
    if (this.readings.length > 5000) {
      this.readings.splice(0, this.readings.length - 5000);
    }
    this.device.lastSeen = reading.timestamp;
    this.device.status = 'ONLINE';
    this.device.sensors.ph.status = 'ONLINE';
    this.device.sensors.tds.status = 'ONLINE';
    this.device.sensors.turbidity.status = 'ONLINE';
    this.device.sensors.temperature.status = 'ONLINE';
    this.device.sensors.waterLevel.status = 'ONLINE';
    return reading;
  }

  async getLatestReading(deviceId = 'JR001') {
    for (let i = this.readings.length - 1; i >= 0; i--) {
      if (this.readings[i].deviceId === deviceId) {
        return this.readings[i];
      }
    }
    return null; // Return null when no data received yet
  }

  async getHistory({ deviceId = 'JR001', timeRange = '24h', limit = 300 }) {
    if (this.readings.length === 0) return [];

    const now = Date.now();
    let msRange = 24 * 3600 * 1000;
    if (timeRange === '1h') msRange = 3600 * 1000;
    else if (timeRange === '6h') msRange = 6 * 3600 * 1000;
    else if (timeRange === '24h') msRange = 24 * 3600 * 1000;
    else if (timeRange === '7d') msRange = 7 * 24 * 3600 * 1000;
    else if (timeRange === '30d') msRange = 30 * 24 * 3600 * 1000;

    const cutoff = new Date(now - msRange);
    const filtered = this.readings.filter(
      r => r.deviceId === deviceId && new Date(r.timestamp) >= cutoff
    );

    if (filtered.length > limit) {
      const step = Math.ceil(filtered.length / limit);
      const downsampled = [];
      for (let i = 0; i < filtered.length; i += step) {
        downsampled.push(filtered[i]);
      }
      return downsampled;
    }
    return filtered;
  }

  async getDevice(deviceId = 'JR001') {
    return this.device;
  }

  async updateDevice(deviceId, updates) {
    this.device = { ...this.device, ...updates };
    return this.device;
  }

  async getAlerts({ status, severity, limit = 50 } = {}) {
    let list = [...this.alerts];
    if (status) list = list.filter(a => a.status === status);
    if (severity) list = list.filter(a => a.severity === severity);
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
  }

  async addAlert(alertData) {
    const alert = {
      _id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...alertData,
      status: alertData.status || 'ACTIVE',
      timestamp: alertData.timestamp || new Date()
    };
    this.alerts.unshift(alert);
    return alert;
  }

  async updateAlert(alertId, updates) {
    const alert = this.alerts.find(a => a._id === alertId);
    if (alert) {
      Object.assign(alert, updates);
      return alert;
    }
    return null;
  }

  async getSettings() {
    return this.settings;
  }

  async updateSettings(updates) {
    this.settings = {
      ...this.settings,
      ...updates,
      thresholds: { ...this.settings.thresholds, ...(updates.thresholds || {}) },
      station: { ...this.settings.station, ...(updates.station || {}) },
      notifications: { ...this.settings.notifications, ...(updates.notifications || {}) }
    };
    return this.settings;
  }
}

const memoryStore = new MemoryStore();
let isMongoConnected = false;

async function initDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[DATABASE] Pure Live Mode: Resilient storage active. Awaiting ESP32 hardware telemetry.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('[DATABASE] MongoDB connected successfully.');
  } catch (err) {
    console.warn('[DATABASE] Operating in Resilient Local Storage Engine.');
    isMongoConnected = false;
  }
}

module.exports = {
  initDatabase,
  calculateWaterHealthScore,
  isMongoConnected: () => isMongoConnected,

  async saveReading(data) {
    const healthScore = calculateWaterHealthScore(data);
    const readingPayload = {
      ...data,
      healthScore,
      isSimulated: false,
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
    };

    const memSaved = await memoryStore.saveReading(readingPayload);

    if (isMongoConnected) {
      try {
        const doc = new SensorReading(readingPayload);
        await doc.save();
        await Device.findOneAndUpdate(
          { deviceId: data.deviceId || 'JR001' },
          { lastSeen: readingPayload.timestamp, status: 'ONLINE' },
          { upsert: true }
        );
      } catch (err) {
        console.error('[DATABASE] Error saving reading to MongoDB:', err.message);
      }
    }
    return memSaved;
  },

  async getLatestReading(deviceId = 'JR001') {
    if (isMongoConnected) {
      try {
        const doc = await SensorReading.findOne({ deviceId }).sort({ timestamp: -1 });
        if (doc) return doc;
      } catch (err) {
        console.warn('[DATABASE] Fallback to memory for latest reading:', err.message);
      }
    }
    return memoryStore.getLatestReading(deviceId);
  },

  async getHistory(params) {
    if (isMongoConnected) {
      try {
        const now = Date.now();
        let msRange = 24 * 3600 * 1000;
        if (params.timeRange === '1h') msRange = 3600 * 1000;
        else if (params.timeRange === '6h') msRange = 6 * 3600 * 1000;
        else if (params.timeRange === '24h') msRange = 24 * 3600 * 1000;
        else if (params.timeRange === '7d') msRange = 7 * 24 * 3600 * 1000;
        else if (params.timeRange === '30d') msRange = 30 * 24 * 3600 * 1000;

        const cutoff = new Date(now - msRange);
        const docs = await SensorReading.find({
          deviceId: params.deviceId || 'JR001',
          timestamp: { $gte: cutoff }
        }).sort({ timestamp: 1 }).limit(params.limit || 300);

        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('[DATABASE] Fallback to memory for history:', err.message);
      }
    }
    return memoryStore.getHistory(params);
  },

  async getDevice(deviceId = 'JR001') {
    if (isMongoConnected) {
      try {
        const doc = await Device.findOne({ deviceId });
        if (doc) return doc;
      } catch (err) {
        console.warn('[DATABASE] Fallback to memory for device status:', err.message);
      }
    }
    return memoryStore.getDevice(deviceId);
  },

  async getAlerts(filter) {
    if (isMongoConnected) {
      try {
        const query = {};
        if (filter.status) query.status = filter.status;
        if (filter.severity) query.severity = filter.severity;
        const docs = await Alert.find(query).sort({ timestamp: -1 }).limit(filter.limit || 50);
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('[DATABASE] Fallback to memory for alerts:', err.message);
      }
    }
    return memoryStore.getAlerts(filter);
  },

  async addAlert(alertData) {
    const memAlert = await memoryStore.addAlert(alertData);
    if (isMongoConnected) {
      try {
        const doc = new Alert(alertData);
        await doc.save();
      } catch (err) {
        console.error('[DATABASE] Error persisting alert in MongoDB:', err.message);
      }
    }
    return memAlert;
  },

  async updateAlert(alertId, updates) {
    const memUpdated = await memoryStore.updateAlert(alertId, updates);
    if (isMongoConnected) {
      try {
        await Alert.findByIdAndUpdate(alertId, updates);
      } catch (err) {
        console.error('[DATABASE] Error updating alert in MongoDB:', err.message);
      }
    }
    return memUpdated;
  },

  async getSettings() {
    if (isMongoConnected) {
      try {
        const doc = await Settings.findOne({ key: 'global_settings' });
        if (doc) return doc;
      } catch (err) {
        console.warn('[DATABASE] Fallback to memory for settings:', err.message);
      }
    }
    return memoryStore.getSettings();
  },

  async updateSettings(updates) {
    const memUpdated = await memoryStore.updateSettings(updates);
    if (isMongoConnected) {
      try {
        await Settings.findOneAndUpdate(
          { key: 'global_settings' },
          { $set: updates },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('[DATABASE] Error saving settings to MongoDB:', err.message);
      }
    }
    return memUpdated;
  },

  clearAllData() {
    memoryStore.clearAllData();
  }
};
