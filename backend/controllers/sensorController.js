const storageService = require('../services/storageService');
const alertEngine = require('../services/alertEngine');

/**
 * Sensor Controller
 * Handles ingestion from physical ESP32 or gateways, latest state, time series, and CSV exports.
 */
exports.postSensorData = async (req, res, next) => {
  try {
    const { deviceId, ph, tds, turbidity, temperature, waterLevel } = req.body;

    // Validate sensor payload
    if (ph === undefined || tds === undefined || turbidity === undefined || temperature === undefined || waterLevel === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: ph, tds, turbidity, temperature, and waterLevel are required numbers.'
      });
    }

    const readingData = {
      deviceId: deviceId || 'JR001',
      ph: parseFloat(ph),
      tds: parseFloat(tds),
      turbidity: parseFloat(turbidity),
      temperature: parseFloat(temperature),
      waterLevel: parseFloat(waterLevel),
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
      isSimulated: false
    };

    console.log(`[ESP32] Sensor data received from ${readingData.deviceId}: pH=${readingData.ph}, TDS=${readingData.tds}ppm, Turb=${readingData.turbidity}NTU, Temp=${readingData.temperature}°C, Level=${readingData.waterLevel}%`);

    const io = req.app.get('io');
    const saved = await storageService.saveReading(readingData);

    // Evaluate early warning indicators
    await alertEngine.evaluateReading(saved, io);

    // Stream real-time update to dashboard
    if (io) {
      io.emit('sensor_update', saved);
    }

    return res.status(200).json({
      success: true,
      message: 'Sensor data received',
      readingId: saved._id,
      healthScore: saved.healthScore
    });
  } catch (err) {
    next(err);
  }
};

exports.getLatestSensorData = async (req, res, next) => {
  try {
    const deviceId = req.query.deviceId || 'JR001';
    const latest = await storageService.getLatestReading(deviceId);
    const settings = await storageService.getSettings();
    const timeoutSec = (settings.station && settings.station.offlineTimeoutSeconds) || 20;

    let isLive = false;
    let secondsSinceLastSeen = null;

    if (latest && latest.timestamp) {
      secondsSinceLastSeen = Math.round((Date.now() - new Date(latest.timestamp).getTime()) / 1000);
      isLive = secondsSinceLastSeen <= timeoutSec;
    }

    return res.status(200).json({
      success: true,
      data: latest,
      connection: {
        isLive,
        secondsSinceLastSeen,
        timeoutThresholdSeconds: timeoutSec,
        status: isLive ? 'LIVE' : 'OFFLINE',
        stationName: settings.station ? settings.station.name : 'JAL-RAKSHAK NODE 01'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getSensorHistory = async (req, res, next) => {
  try {
    const { deviceId = 'JR001', timeRange = '24h', parameter, limit = 300 } = req.query;
    const history = await storageService.getHistory({
      deviceId,
      timeRange,
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      timeRange,
      data: history
    });
  } catch (err) {
    next(err);
  }
};

exports.exportSensorDataCsv = async (req, res, next) => {
  try {
    const { deviceId = 'JR001', timeRange = '30d' } = req.query;
    const history = await storageService.getHistory({
      deviceId,
      timeRange,
      limit: 5000
    });

    let csv = 'Timestamp,DeviceID,pH,TDS_ppm,Turbidity_NTU,Temperature_C,WaterLevel_Pct,HealthScore,IsSimulated\n';
    for (const r of history) {
      csv += `"${new Date(r.timestamp).toISOString()}","${r.deviceId}",${r.ph},${r.tds},${r.turbidity},${r.temperature},${r.waterLevel},${r.healthScore || '--'},${r.isSimulated ? 'YES' : 'NO'}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=jal_rakshak_${deviceId}_${timeRange}_${Date.now()}.csv`);
    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
