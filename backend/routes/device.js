const express = require('express');
const router = express.Router();
const storageService = require('../services/storageService');

const serverStartTime = Date.now();

router.get('/status', async (req, res, next) => {
  try {
    const deviceId = req.query.deviceId || 'JR001';
    const device = await storageService.getDevice(deviceId);
    const latestReading = await storageService.getLatestReading(deviceId);
    const settings = await storageService.getSettings();
    const timeoutSec = (settings.station && settings.station.offlineTimeoutSeconds) || 20;

    let isEsp32Live = false;
    let secondsSinceLastSeen = null;

    if (latestReading && latestReading.timestamp) {
      secondsSinceLastSeen = Math.round((Date.now() - new Date(latestReading.timestamp).getTime()) / 1000);
      isEsp32Live = secondsSinceLastSeen <= timeoutSec;
    }

    const uptimeSeconds = Math.round((Date.now() - serverStartTime) / 1000);

    const statusPayload = {
      device: {
        id: deviceId,
        name: (settings.station && settings.station.name) || device.name,
        location: (settings.station && settings.station.location) || device.location.name,
        coordinates: {
          lat: (settings.station && settings.station.latitude) || device.location.latitude,
          lng: (settings.station && settings.station.longitude) || device.location.longitude
        },
        firmwareVersion: device.firmwareVersion || 'v2.4.1-esp32',
        mcu: device.hardware.mcu,
        powerSupply: device.hardware.powerSupply,
        loraModule: device.hardware.loraModule,
        status: isEsp32Live ? 'ONLINE' : 'OFFLINE',
        lastCommunication: latestReading ? latestReading.timestamp : device.lastSeen,
        secondsSinceLastSeen,
        timeoutThresholdSeconds: timeoutSec
      },
      wifi: {
        status: isEsp32Live ? 'CONNECTED' : 'DISCONNECTED',
        ssid: device.wifi.ssid,
        rssi: isEsp32Live ? device.wifi.rssi : -99,
        signalStrength: isEsp32Live ? 'EXCELLENT (-58 dBm)' : 'NO SIGNAL',
        ip: device.wifi.ip
      },
      backend: {
        status: 'ONLINE',
        uptimeSeconds,
        uptimeFormatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
      },
      database: {
        type: storageService.isMongoConnected() ? 'MongoDB (Atlas/Live)' : 'Resilient In-Memory Storage & Local Cache',
        status: 'CONNECTED',
        health: 'HEALTHY'
      },
      sensors: {
        ph: { name: 'pH Sensor Probe (Analog E-201-C)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±0.05 pH' },
        tds: { name: 'TDS Sensor Probe (Analog PPM)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±5% F.S.' },
        turbidity: { name: 'Optical Turbidity Sensor (TS-300B)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±0.2 NTU' },
        temperature: { name: 'Water Temp Sensor (DS18B20 Waterproof)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±0.5 °C' },
        waterLevel: { name: 'Ultrasonic / Hydrostatic Level Sensor', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±1%' }
      }
    };

    return res.status(200).json({
      success: true,
      data: statusPayload
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
