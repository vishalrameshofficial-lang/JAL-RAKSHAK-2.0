const storageService = require('./storageService');

/**
 * Alert Evaluation Engine
 * Evaluates water-quality indicators against configured thresholds.
 * Strictly adheres to scientific communication guidelines:
 * - Does NOT claim chemical or pathogen detection without dedicated sensors
 * - Frames readings as indicative indicators for continuous monitoring
 * - Formulates warnings as "Potential water-quality anomaly detected — further laboratory verification recommended"
 */
class AlertEngine {
  async evaluateReading(reading, io = null) {
    const settings = await storageService.getSettings();
    const thresholds = settings.thresholds;
    const deviceId = reading.deviceId || 'JR001';
    const alertsToTrigger = [];

    // 1. Turbidity evaluation
    if (reading.turbidity >= thresholds.turbidity.critical) {
      alertsToTrigger.push({
        deviceId,
        type: 'TURBIDITY_ANOMALY',
        severity: 'CRITICAL',
        parameter: 'turbidity',
        triggerValue: reading.turbidity,
        thresholdValue: thresholds.turbidity.critical,
        message: 'Rapid change in water-quality indicators detected — elevated optical turbidity.',
        recommendedAction: 'Inspect water source, verify probe optics, and initiate prompt laboratory verification.'
      });
    } else if (reading.turbidity >= thresholds.turbidity.warning) {
      alertsToTrigger.push({
        deviceId,
        type: 'TURBIDITY_ANOMALY',
        severity: 'WARNING',
        parameter: 'turbidity',
        triggerValue: reading.turbidity,
        thresholdValue: thresholds.turbidity.warning,
        message: 'Abnormal turbidity variation detected.',
        recommendedAction: 'Inspect water source and consider laboratory verification.'
      });
    }

    // 2. pH evaluation
    if (reading.ph <= thresholds.ph.minCritical || reading.ph >= thresholds.ph.maxCritical) {
      alertsToTrigger.push({
        deviceId,
        type: 'PH_ANOMALY',
        severity: 'CRITICAL',
        parameter: 'ph',
        triggerValue: reading.ph,
        thresholdValue: reading.ph <= thresholds.ph.minCritical ? thresholds.ph.minCritical : thresholds.ph.maxCritical,
        message: 'Critical water-quality indicator deviation — acute pH imbalance.',
        recommendedAction: 'Inspect inflow basin, re-calibrate probe, and perform laboratory chemical analysis.'
      });
    } else if (reading.ph < thresholds.ph.minWarning || reading.ph > thresholds.ph.maxWarning) {
      alertsToTrigger.push({
        deviceId,
        type: 'PH_ANOMALY',
        severity: 'WARNING',
        parameter: 'ph',
        triggerValue: reading.ph,
        thresholdValue: reading.ph < thresholds.ph.minWarning ? thresholds.ph.minWarning : thresholds.ph.maxWarning,
        message: 'Potential water-quality anomaly detected — indicative pH deviation.',
        recommendedAction: 'Monitor trend and verify probe calibration.'
      });
    }

    // 3. TDS evaluation
    if (reading.tds >= thresholds.tds.critical) {
      alertsToTrigger.push({
        deviceId,
        type: 'TDS_ANOMALY',
        severity: 'CRITICAL',
        parameter: 'tds',
        triggerValue: reading.tds,
        thresholdValue: thresholds.tds.critical,
        message: 'Elevated total dissolved solids (TDS) anomaly detected.',
        recommendedAction: 'Check for upstream runoff or salinity shifts and schedule laboratory validation.'
      });
    } else if (reading.tds >= thresholds.tds.warning) {
      alertsToTrigger.push({
        deviceId,
        type: 'TDS_ANOMALY',
        severity: 'WARNING',
        parameter: 'tds',
        triggerValue: reading.tds,
        thresholdValue: thresholds.tds.warning,
        message: 'Moderate TDS increase detected above baseline monitoring threshold.',
        recommendedAction: 'Observe continuous trend for further deviation.'
      });
    }

    // 4. Temperature evaluation
    if (reading.temperature >= thresholds.temperature.maxCritical || reading.temperature <= thresholds.temperature.minCritical) {
      alertsToTrigger.push({
        deviceId,
        type: 'TEMPERATURE_ANOMALY',
        severity: 'CRITICAL',
        parameter: 'temperature',
        triggerValue: reading.temperature,
        thresholdValue: reading.temperature >= thresholds.temperature.maxCritical ? thresholds.temperature.maxCritical : thresholds.temperature.minCritical,
        message: 'Extreme thermal variation detected in monitoring reservoir.',
        recommendedAction: 'Check ambient weather conditions and water sensor immersion depth.'
      });
    } else if (reading.temperature >= thresholds.temperature.maxWarning || reading.temperature <= thresholds.temperature.minWarning) {
      alertsToTrigger.push({
        deviceId,
        type: 'TEMPERATURE_ANOMALY',
        severity: 'WARNING',
        parameter: 'temperature',
        triggerValue: reading.temperature,
        thresholdValue: reading.temperature >= thresholds.temperature.maxWarning ? thresholds.temperature.maxWarning : thresholds.temperature.minWarning,
        message: 'Thermal anomaly: Water temperature outside normal baseline.',
        recommendedAction: 'Verify thermal sensor integrity and sun exposure.'
      });
    }

    // 5. Water Level evaluation
    if (reading.waterLevel <= thresholds.waterLevel.lowCritical) {
      alertsToTrigger.push({
        deviceId,
        type: 'WATER_LEVEL_ANOMALY',
        severity: 'CRITICAL',
        parameter: 'waterLevel',
        triggerValue: reading.waterLevel,
        thresholdValue: thresholds.waterLevel.lowCritical,
        message: 'Critical low water level detected — reservoir depletion risk.',
        recommendedAction: 'Check intake supply, verify sensor probe submersion, and inspect for leaks.'
      });
    } else if (reading.waterLevel <= thresholds.waterLevel.lowWarning) {
      alertsToTrigger.push({
        deviceId,
        type: 'WATER_LEVEL_ANOMALY',
        severity: 'WARNING',
        parameter: 'waterLevel',
        triggerValue: reading.waterLevel,
        thresholdValue: thresholds.waterLevel.lowWarning,
        message: 'Low water level alert — reservoir below nominal monitoring depth.',
        recommendedAction: 'Monitor supply intake rates.'
      });
    } else if (reading.waterLevel >= thresholds.waterLevel.highCritical) {
      alertsToTrigger.push({
        deviceId,
        type: 'WATER_LEVEL_ANOMALY',
        severity: 'CRITICAL',
        parameter: 'waterLevel',
        triggerValue: reading.waterLevel,
        thresholdValue: thresholds.waterLevel.highCritical,
        message: 'Overflow risk: Water level exceeds critical maximum capacity.',
        recommendedAction: 'Inspect discharge outlets and catchment overflows.'
      });
    }

    // Deduplicate against existing active alerts from the last 60 seconds to avoid flooding
    const recentAlerts = await storageService.getAlerts({ status: 'ACTIVE', limit: 20 });
    const newAlertsRecorded = [];

    for (const alertData of alertsToTrigger) {
      const isDuplicate = recentAlerts.some(
        a => a.type === alertData.type &&
             a.severity === alertData.severity &&
             (Date.now() - new Date(a.timestamp).getTime()) < 60000
      );

      if (!isDuplicate) {
        const savedAlert = await storageService.addAlert(alertData);
        newAlertsRecorded.push(savedAlert);
        console.log(`[ALERT] ${alertData.severity} generated: ${alertData.message}`);
        if (io) {
          io.emit('alert_triggered', savedAlert);
        }
      }
    }

    return newAlertsRecorded;
  }
}

module.exports = new AlertEngine();
