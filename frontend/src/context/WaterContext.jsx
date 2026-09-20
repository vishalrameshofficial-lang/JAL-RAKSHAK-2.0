import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { socketService } from '../services/socket';

const WaterContext = createContext(null);

export function WaterProvider({ children }) {
  // Pure live hardware telemetry - starts null until ESP32 transmits
  const [telemetry, setTelemetry] = useState(null);

  // Previous telemetry for live delta calculation
  const [prevTelemetry, setPrevTelemetry] = useState(null);

  // Live delta indicators
  const [deltas, setDeltas] = useState({
    ph: null,
    tds: null,
    turbidity: null,
    temperature: null,
    waterLevel: null
  });

  // Hardware connection states
  const [isEsp32Live, setIsEsp32Live] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [stationName, setStationName] = useState('JAL-RAKSHAK NODE 01');
  const [lastHeartbeat, setLastHeartbeat] = useState(null);
  const [secondsSinceLastSeen, setSecondsSinceLastSeen] = useState(null);

  // Real-time Event Stream from hardware
  const [eventStream, setEventStream] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      text: 'JAL-RAKSHAK System Online — Listening for live ESP32 microcontroller telemetry...',
      type: 'info'
    }
  ]);

  // Alerts
  const [alerts, setAlerts] = useState([]);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [criticalAlertsCount, setCriticalAlertsCount] = useState(0);

  // Device status
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [settings, setSettings] = useState(null);

  // Telemetry incoming pulse
  const [incomingPulse, setIncomingPulse] = useState(false);
  const pulseTimeoutRef = useRef(null);

  // Process live hardware reading
  const handleNewReading = useCallback((newReading) => {
    if (!newReading) return;

    setTelemetry((current) => {
      setPrevTelemetry(current);

      if (current) {
        setDeltas({
          ph: parseFloat((newReading.ph - current.ph).toFixed(2)),
          tds: Math.round(newReading.tds - current.tds),
          turbidity: parseFloat((newReading.turbidity - current.turbidity).toFixed(2)),
          temperature: parseFloat((newReading.temperature - current.temperature).toFixed(1)),
          waterLevel: Math.round(newReading.waterLevel - current.waterLevel)
        });
      }

      return newReading;
    });

    const now = Date.now();
    setLastHeartbeat(now);
    setSecondsSinceLastSeen(0);
    setIsEsp32Live(true);

    // Visual pulse
    setIncomingPulse(true);
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => setIncomingPulse(false), 800);

    // Event Log
    const nowStr = new Date().toLocaleTimeString();
    setEventStream((prev) => [
      {
        id: Date.now() + Math.random(),
        time: nowStr,
        text: `[ESP32 LIVE] pH: ${newReading.ph} | TDS: ${newReading.tds} ppm | Turbidity: ${newReading.turbidity} NTU | Temp: ${newReading.temperature}°C | Level: ${newReading.waterLevel}%`,
        type: newReading.turbidity > 4 || newReading.ph < 6.5 ? 'warning' : 'telemetry'
      },
      ...prev.slice(0, 49)
    ]);
  }, []);

  // Offline detection timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastHeartbeat) {
        const elapsed = Math.round((Date.now() - lastHeartbeat) / 1000);
        setSecondsSinceLastSeen(elapsed);
        if (elapsed > 20) {
          setIsEsp32Live(false);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastHeartbeat]);

  // Real-time socket subscription
  useEffect(() => {
    socketService.connect();

    const unsubReading = socketService.on('sensor_update', (data) => {
      handleNewReading(data);
    });

    const unsubAlert = socketService.on('alert_triggered', (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      setActiveAlertsCount((c) => c + 1);
      if (newAlert.severity === 'CRITICAL') {
        setCriticalAlertsCount((c) => c + 1);
      }
      setEventStream((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          text: `[${newAlert.severity}] ${newAlert.message}`,
          type: newAlert.severity.toLowerCase()
        },
        ...prev
      ]);
    });

    const unsubAlertStatus = socketService.on('alert_status_changed', (updated) => {
      setAlerts((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      refreshAlerts();
    });

    refreshData();
    refreshAlerts();
    refreshSettings();
    refreshDeviceStatus();

    return () => {
      unsubReading();
      unsubAlert();
      unsubAlertStatus();
      socketService.disconnect();
    };
  }, [handleNewReading]);

  const refreshData = async () => {
    try {
      const res = await api.getLatestReading();
      if (res.success) {
        if (res.data) {
          handleNewReading(res.data);
        } else {
          setTelemetry(null);
        }
        setIsBackendOnline(true);
        if (res.connection) {
          setIsEsp32Live(res.connection.isLive);
          if (res.connection.stationName) setStationName(res.connection.stationName);
        }
      }
    } catch (err) {
      setIsBackendOnline(false);
    }
  };

  const refreshAlerts = async () => {
    try {
      const res = await api.getAlerts({ limit: 50 });
      if (res.success && res.data) {
        setAlerts(res.data);
        setActiveAlertsCount(res.counts.active);
        setCriticalAlertsCount(res.counts.critical);
      }
    } catch (err) {
      console.warn('Could not fetch alerts:', err.message);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch settings:', err.message);
    }
  };

  const refreshDeviceStatus = async () => {
    try {
      const res = await api.getDeviceStatus();
      if (res.success && res.data) {
        setDeviceInfo(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch device status:', err.message);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      await api.updateAlertStatus(alertId, 'ACKNOWLEDGED');
      await refreshAlerts();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await api.updateAlertStatus(alertId, 'RESOLVED');
      await refreshAlerts();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  return (
    <WaterContext.Provider
      value={{
        telemetry,
        prevTelemetry,
        deltas,
        isEsp32Live,
        isBackendOnline,
        stationName,
        secondsSinceLastSeen,
        incomingPulse,
        eventStream,
        alerts,
        activeAlertsCount,
        criticalAlertsCount,
        deviceInfo,
        settings,
        acknowledgeAlert,
        resolveAlert,
        refreshData,
        refreshAlerts,
        refreshSettings,
        refreshDeviceStatus
      }}
    >
      {children}
    </WaterContext.Provider>
  );
}

export function useWater() {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
}
