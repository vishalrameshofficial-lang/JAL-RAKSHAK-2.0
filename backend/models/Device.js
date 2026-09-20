const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    default: 'JR001'
  },
  name: {
    type: String,
    default: 'JAL-RAKSHAK NODE 01'
  },
  status: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'SIMULATION', 'MAINTENANCE'],
    default: 'ONLINE'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  firmwareVersion: {
    type: String,
    default: 'v2.4.1-esp32'
  },
  location: {
    name: { type: String, default: 'Hydrology Monitoring Basin Alpha' },
    latitude: { type: Number, default: 28.6139 },
    longitude: { type: Number, default: 77.2090 }
  },
  wifi: {
    ssid: { type: String, default: 'JalRakshak-Secure-IoT' },
    rssi: { type: Number, default: -58 },
    ip: { type: String, default: '192.168.1.142' }
  },
  sensors: {
    ph: { status: { type: String, default: 'ONLINE' }, calibratedAt: Date },
    tds: { status: { type: String, default: 'ONLINE' }, calibratedAt: Date },
    turbidity: { status: { type: String, default: 'ONLINE' }, calibratedAt: Date },
    temperature: { status: { type: String, default: 'ONLINE' }, calibratedAt: Date },
    waterLevel: { status: { type: String, default: 'ONLINE' }, calibratedAt: Date }
  },
  hardware: {
    mcu: { type: String, default: 'ESP32-WROOM-32D (Dual-Core 240MHz)' },
    powerSupply: { type: String, default: 'Solar 12V LiFePO4 + Buck Converter' },
    loraModule: { type: String, default: 'Planned Expansion Socket (SX1278)' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Device', deviceSchema);
