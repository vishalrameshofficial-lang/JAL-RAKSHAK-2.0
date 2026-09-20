const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
    default: 'JR001'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ph: {
    type: Number,
    required: true
  },
  tds: {
    type: Number,
    required: true
  },
  turbidity: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  waterLevel: {
    type: Number,
    required: true
  },
  isSimulated: {
    type: Boolean,
    default: false
  },
  healthScore: {
    type: Number,
    default: 85
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
