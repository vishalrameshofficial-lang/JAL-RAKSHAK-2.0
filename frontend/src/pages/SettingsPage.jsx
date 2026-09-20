import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sliders,
  AlertTriangle,
  Code,
  Copy,
  Check,
  Save,
  Radio,
  Wifi,
  Info
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { api } from '../services/api';

export default function SettingsPage() {
  const {
    settings,
    refreshSettings
  } = useWater();

  // Threshold form state
  const [thresholds, setThresholds] = useState({
    phMin: 6.5,
    phMax: 8.5,
    tdsWarning: 300,
    tdsCritical: 500,
    turbidityWarning: 4.0,
    turbidityCritical: 8.0,
    tempMax: 32.0,
    waterLevelLow: 25.0
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (settings && settings.thresholds) {
      setThresholds({
        phMin: settings.thresholds.ph?.minWarning || 6.5,
        phMax: settings.thresholds.ph?.maxWarning || 8.5,
        tdsWarning: settings.thresholds.tds?.warning || 300,
        tdsCritical: settings.thresholds.tds?.critical || 500,
        turbidityWarning: settings.thresholds.turbidity?.warning || 4.0,
        turbidityCritical: settings.thresholds.turbidity?.critical || 8.0,
        tempMax: settings.thresholds.temperature?.maxWarning || 32.0,
        waterLevelLow: settings.thresholds.waterLevel?.lowWarning || 25.0
      });
    }
  }, [settings]);

  const handleSaveThresholds = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        thresholds: {
          ph: { minWarning: thresholds.phMin, maxWarning: thresholds.phMax },
          tds: { warning: thresholds.tdsWarning, critical: thresholds.tdsCritical },
          turbidity: { warning: thresholds.turbidityWarning, critical: thresholds.turbidityCritical },
          temperature: { maxWarning: thresholds.tempMax },
          waterLevel: { lowWarning: thresholds.waterLevelLow }
        }
      });
      setSaveSuccess(true);
      await refreshSettings();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update thresholds:', err);
    } finally {
      setSaving(false);
    }
  };

  const sampleArduinoCode = `// ESP32 Telemetry Transmit snippet
#include <WiFi.h>
#include <HTTPClient.h>

const char* SERVER_URL = "http://YOUR_SERVER_IP:5000/api/sensor-data";

void sendSensorData(float ph, int tds, float turb, float temp, int level) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    String json = "{\\"deviceId\\":\\"JR001\\",\\"ph\\":" + String(ph, 2) + 
                  ",\\"tds\\":" + String(tds) + 
                  ",\\"turbidity\\":" + String(turb, 2) + 
                  ",\\"temperature\\":" + String(temp, 1) + 
                  ",\\"waterLevel\\":" + String(level) + "}";

    int code = http.POST(json);
    http.end();
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleArduinoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
            <Settings className="w-4 h-4" />
            STATION CONFIGURATION & HARDWARE CALIBRATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
            System & Sensor Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Calibrate real-time monitoring indicator thresholds, configure alert limits, and manage ESP32 hardware API endpoints
          </p>
        </div>
      </div>

      {/* Sensor Indicator Monitoring Thresholds */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-aqua-primary" />
            <h3 className="text-base font-bold text-slate-100 font-sans">
              Configurable Monitoring Thresholds
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Node JR001 Reference Parameters
          </span>
        </div>

        {/* Scientific Label Alert */}
        <div className="p-3 bg-abyss-950/70 border border-white/10 rounded-xl text-xs text-slate-300 font-mono flex items-start gap-2.5">
          <Info className="w-4 h-4 text-aqua-seafoam shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Clearly designated as configurable early-warning monitoring thresholds rather than universal statutory drinking-water standards.
          </span>
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-abyss-950/60 rounded-xl border border-white/5 space-y-1.5">
              <label className="text-slate-400 font-bold block">pH Warning Min</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.phMin}
                onChange={(e) => setThresholds({ ...thresholds, phMin: parseFloat(e.target.value) })}
                className="w-full bg-abyss-900 border border-white/10 rounded-lg p-2 text-slate-100 focus:border-aqua-primary focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">Nominal baseline: 6.5</span>
            </div>

            <div className="p-3 bg-abyss-950/60 rounded-xl border border-white/5 space-y-1.5">
              <label className="text-slate-400 font-bold block">pH Warning Max</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.phMax}
                onChange={(e) => setThresholds({ ...thresholds, phMax: parseFloat(e.target.value) })}
                className="w-full bg-abyss-900 border border-white/10 rounded-lg p-2 text-slate-100 focus:border-aqua-primary focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">Nominal baseline: 8.5</span>
            </div>

            <div className="p-3 bg-abyss-950/60 rounded-xl border border-white/5 space-y-1.5">
              <label className="text-slate-400 font-bold block">TDS Warning (ppm)</label>
              <input
                type="number"
                step="10"
                value={thresholds.tdsWarning}
                onChange={(e) => setThresholds({ ...thresholds, tdsWarning: parseInt(e.target.value, 10) })}
                className="w-full bg-abyss-900 border border-white/10 rounded-lg p-2 text-slate-100 focus:border-aqua-primary focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">Warning threshold: 300 ppm</span>
            </div>

            <div className="p-3 bg-abyss-950/60 rounded-xl border border-white/5 space-y-1.5">
              <label className="text-slate-400 font-bold block">Turbidity Warning (NTU)</label>
              <input
                type="number"
                step="0.5"
                value={thresholds.turbidityWarning}
                onChange={(e) => setThresholds({ ...thresholds, turbidityWarning: parseFloat(e.target.value) })}
                className="w-full bg-abyss-900 border border-white/10 rounded-lg p-2 text-slate-100 focus:border-aqua-primary focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">Threshold: 4.0 NTU</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {saveSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                <Check className="w-4 h-4" /> Thresholds successfully updated!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-aqua-deep via-aqua-primary to-aqua-seafoam text-abyss-950 font-bold uppercase tracking-wider shadow-glow-cyan hover:opacity-95 transition-all text-xs"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Monitoring Thresholds'}
            </button>
          </div>
        </form>
      </div>

      {/* ESP32 Arduino Integration Guide & Code Viewer */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-aqua-seafoam" />
            <h3 className="text-base font-bold text-slate-100 font-sans">
              ESP32 Edge Microcontroller Ingestion Snippet
            </h3>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-abyss-950 border border-white/10 text-xs font-mono text-slate-300 hover:text-slate-100 hover:border-aqua-primary transition-all"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? 'Copied' : 'Copy Arduino Snippet'}
          </button>
        </div>

        <pre className="p-4 bg-abyss-950 rounded-2xl border border-white/10 overflow-x-auto text-[11px] font-mono text-aqua-seafoam leading-relaxed">
          {sampleArduinoCode}
        </pre>
      </div>
    </div>
  );
}
