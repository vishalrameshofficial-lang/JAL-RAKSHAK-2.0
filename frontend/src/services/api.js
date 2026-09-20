const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error [${options.method || 'GET'} ${url}]:`, err.message);
    throw err;
  }
}

export const api = {
  baseUrl: API_BASE,

  // Health
  getHealth: () => fetchJson(`${API_BASE}/api/health`),

  // Telemetry
  getLatestReading: (deviceId = 'JR001') =>
    fetchJson(`${API_BASE}/api/sensor-data/latest?deviceId=${deviceId}`),

  getSensorHistory: ({ deviceId = 'JR001', timeRange = '24h', limit = 300 } = {}) =>
    fetchJson(`${API_BASE}/api/sensor-data/history?deviceId=${deviceId}&timeRange=${timeRange}&limit=${limit}`),

  getExportCsvUrl: ({ deviceId = 'JR001', timeRange = '30d' } = {}) =>
    `${API_BASE}/api/sensor-data/export?deviceId=${deviceId}&timeRange=${timeRange}`,

  // Alerts
  getAlerts: ({ status, severity, limit = 50 } = {}) => {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (severity) query.append('severity', severity);
    if (limit) query.append('limit', limit);
    return fetchJson(`${API_BASE}/api/alerts?${query.toString()}`);
  },

  updateAlertStatus: (id, status) =>
    fetchJson(`${API_BASE}/api/alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  createAlert: (alertData) =>
    fetchJson(`${API_BASE}/api/alerts`, {
      method: 'POST',
      body: JSON.stringify(alertData)
    }),

  // Device & Node
  getDeviceStatus: (deviceId = 'JR001') =>
    fetchJson(`${API_BASE}/api/device/status?deviceId=${deviceId}`),

  // Settings & Thresholds
  getSettings: () => fetchJson(`${API_BASE}/api/settings`),

  updateSettings: (settingsData) =>
    fetchJson(`${API_BASE}/api/settings`, {
      method: 'POST',
      body: JSON.stringify(settingsData)
    }),

  // Reports
  getReport: (type = 'daily', deviceId = 'JR001') =>
    fetchJson(`${API_BASE}/api/reports/generate?type=${type}&deviceId=${deviceId}`)
};
