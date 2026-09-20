const storageService = require('../services/storageService');

exports.getAlerts = async (req, res, next) => {
  try {
    const { status, severity, limit = 50 } = req.query;
    const alerts = await storageService.getAlerts({ status, severity, limit: parseInt(limit, 10) });

    const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
    const criticalCount = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;
    const warningCount = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'WARNING').length;

    return res.status(200).json({
      success: true,
      counts: {
        active: activeCount,
        critical: criticalCount,
        warning: warningCount,
        totalReturned: alerts.length
      },
      data: alerts
    });
  } catch (err) {
    next(err);
  }
};

exports.createAlert = async (req, res, next) => {
  try {
    const { type, severity, message, parameter, triggerValue, thresholdValue, recommendedAction } = req.body;
    if (!type || !message) {
      return res.status(400).json({ success: false, message: 'Type and message are required.' });
    }

    const alert = await storageService.addAlert({
      deviceId: req.body.deviceId || 'JR001',
      type,
      severity: severity || 'WARNING',
      parameter: parameter || 'general',
      triggerValue,
      thresholdValue,
      message,
      recommendedAction: recommendedAction || 'Inspect water source and consider laboratory verification.'
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('alert_triggered', alert);
    }

    return res.status(201).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
};

exports.updateAlertStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACKNOWLEDGED' or 'RESOLVED'

    if (!['ACKNOWLEDGED', 'RESOLVED', 'ACTIVE'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Choose ACTIVE, ACKNOWLEDGED, or RESOLVED.' });
    }

    const updates = { status };
    if (status === 'RESOLVED') {
      updates.resolvedAt = new Date();
    }

    const updated = await storageService.updateAlert(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('alert_status_changed', updated);
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
