const express = require('express');
const router = express.Router();
const storageService = require('../services/storageService');

router.get('/generate', async (req, res, next) => {
  try {
    const { type = 'daily', deviceId = 'JR001' } = req.query; // 'daily', 'weekly', 'monthly'
    
    let timeRange = '24h';
    let periodTitle = 'Daily Monitoring Period (Past 24 Hours)';
    if (type === 'weekly') {
      timeRange = '7d';
      periodTitle = 'Weekly Water Quality Analysis Period (Past 7 Days)';
    } else if (type === 'monthly') {
      timeRange = '30d';
      periodTitle = 'Monthly Environmental Hydrology Summary (Past 30 Days)';
    }

    const [history, alerts, settings, device] = await Promise.all([
      storageService.getHistory({ deviceId, timeRange, limit: 1000 }),
      storageService.getAlerts({ limit: 100 }),
      storageService.getSettings(),
      storageService.getDevice(deviceId)
    ]);

    // Compute statistics for each parameter
    const calculateStats = (arr, key) => {
      if (!arr || arr.length === 0) return { min: 0, max: 0, avg: 0, current: 0 };
      const values = arr.map(item => Number(item[key])).filter(v => !isNaN(v));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const current = values[values.length - 1];
      return {
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        avg: parseFloat(avg.toFixed(2)),
        current: parseFloat(current.toFixed(2))
      };
    };

    const stats = {
      ph: calculateStats(history, 'ph'),
      tds: calculateStats(history, 'tds'),
      turbidity: calculateStats(history, 'turbidity'),
      temperature: calculateStats(history, 'temperature'),
      waterLevel: calculateStats(history, 'waterLevel'),
      healthScore: calculateStats(history, 'healthScore')
    };

    // Filter alerts in this time window
    const relevantAlerts = alerts.filter(a => {
      const ms = Date.now() - new Date(a.timestamp).getTime();
      if (type === 'daily') return ms <= 24 * 3600 * 1000;
      if (type === 'weekly') return ms <= 7 * 24 * 3600 * 1000;
      return ms <= 30 * 24 * 3600 * 1000;
    });

    const report = {
      reportId: `JR-REP-${Date.now().toString(36).toUpperCase()}`,
      generatedAt: new Date(),
      type,
      title: type.toUpperCase() + ' WATER QUALITY MONITORING REPORT',
      periodTitle,
      station: {
        id: deviceId,
        name: (settings.station && settings.station.name) || device.name,
        location: (settings.station && settings.station.location) || device.location.name,
        coordinates: `${settings.station.latitude}° N, ${settings.station.longitude}° E`,
        firmware: device.firmwareVersion,
        hardware: device.hardware.mcu,
        telemetryProtocol: 'Wi-Fi / HTTP REST & Socket.IO (LoRa Expansion Ready)'
      },
      monitoringSummary: {
        totalDataPoints: history.length,
        averageWaterHealthScore: stats.healthScore.avg,
        healthClassification: stats.healthScore.avg >= 80 ? 'OPTIMAL' : (stats.healthScore.avg >= 65 ? 'ACCEPTABLE' : 'ACTION REQUIRED'),
        uptimePercentage: 99.8,
        disclaimer: 'Notice: Data herein reflects continuous electronic sensor telemetry for anomaly detection. This document does not constitute certified laboratory drinking water verification.'
      },
      parameters: {
        ph: { ...stats.ph, unit: 'pH', normalRange: '6.5 - 8.5' },
        tds: { ...stats.tds, unit: 'ppm', normalRange: '150 - 300 ppm' },
        turbidity: { ...stats.turbidity, unit: 'NTU', normalRange: '0.5 - 4.0 NTU' },
        temperature: { ...stats.temperature, unit: '°C', normalRange: '18.0 - 30.0 °C' },
        waterLevel: { ...stats.waterLevel, unit: '%', normalRange: '50 - 90 %' }
      },
      anomalies: {
        totalTriggered: relevantAlerts.length,
        criticalCount: relevantAlerts.filter(a => a.severity === 'CRITICAL').length,
        warningCount: relevantAlerts.filter(a => a.severity === 'WARNING').length,
        events: relevantAlerts.slice(0, 10)
      }
    };

    return res.status(200).json({
      success: true,
      report
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
