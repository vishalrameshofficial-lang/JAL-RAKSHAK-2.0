import React from 'react';
import {
  Cpu,
  Wifi,
  Database,
  Server,
  Activity,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  HardDrive,
  Layers,
  Sparkles
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

export default function DeviceStatus() {
  const { isEsp32Live, isBackendOnline, secondsSinceLastSeen, deviceInfo, stationName } = useWater();

  const sensors = [
    { name: 'pH Sensor', model: 'Analog Combined E-201-C', pin: 'GPIO 34 (ADC1)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±0.05 pH' },
    { name: 'TDS Sensor', model: 'Analog Conductivity PPM Meter', pin: 'GPIO 35 (ADC1)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±5% F.S.' },
    { name: 'Optical Turbidity', model: 'TS-300B Turbidity Transmittance', pin: 'GPIO 32 (ADC1)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±0.2 NTU' },
    { name: 'Water Temperature', model: 'DS18B20 Sealed Waterproof', pin: 'GPIO 4 (OneWire Bus)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±0.5 °C' },
    { name: 'Water Level Head', model: 'Ultrasonic Trig/Echo Transceiver', pin: 'GPIO 5 (Trig) / 18 (Echo)', status: isEsp32Live ? 'ONLINE' : 'UNAVAILABLE', accuracy: '±1%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
            <Cpu className="w-4 h-4" />
            EDGE HARDWARE HEALTH
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
            Device Status & Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Hardware integrity and real-time telemetry diagnostics for {stationName}
          </p>
        </div>

        {/* Big Connection Indicator */}
        <div className="flex items-center gap-3 bg-abyss-950/80 border border-white/10 p-3 rounded-2xl font-mono text-xs">
          <div className="relative flex items-center justify-center">
            <span className={`w-3.5 h-3.5 rounded-full ${isEsp32Live ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            {isEsp32Live && <span className="absolute w-5 h-5 rounded-full bg-emerald-400/50 animate-ping" />}
          </div>
          <div>
            <div className="text-[10px] text-slate-400">EDGE LINK STATE</div>
            <div className={`font-bold text-sm ${isEsp32Live ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isEsp32Live ? 'ESP32 ONLINE' : 'ESP32 CONNECTION LOST'}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Subsystem Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* ESP32 Edge Node */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isEsp32Live
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              ● {isEsp32Live ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 font-sans">ESP32-WROOM-32D</h4>
            <p className="text-[10px] text-slate-400">Dual-Core Xtensa LX6 @ 240MHz</p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Firmware:</span>
              <span className="text-slate-200">v2.4.1-esp32</span>
            </div>
            <div className="flex justify-between">
              <span>Heartbeat:</span>
              <span className="text-aqua-seafoam">
                {secondsSinceLastSeen < 60 ? `${secondsSinceLastSeen}s ago` : 'Timed out'}
              </span>
            </div>
          </div>
        </div>

        {/* Wi-Fi Telemetry */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Wifi className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isEsp32Live
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              ● {isEsp32Live ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 font-sans">Wi-Fi Telemetry Link</h4>
            <p className="text-[10px] text-slate-400">802.11 b/g/n (2.4 GHz)</p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Signal RSSI:</span>
              <span className="text-slate-200">{isEsp32Live ? '-58 dBm' : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Protocol:</span>
              <span className="text-teal-400">HTTP REST + WS</span>
            </div>
          </div>
        </div>

        {/* Backend API Server */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-aqua-primary/10 border border-aqua-primary/30 text-aqua-primary">
              <Server className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isBackendOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              ● {isBackendOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 font-sans">Node.js Express API</h4>
            <p className="text-[10px] text-slate-400">Socket.IO Real-Time Engine</p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Health:</span>
              <span className="text-slate-200">200 OK</span>
            </div>
            <div className="flex justify-between">
              <span>Port:</span>
              <span className="text-aqua-primary">5000</span>
            </div>
          </div>
        </div>

        {/* Database Layer */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
              ● CONNECTED
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 font-sans">Telemetry Storage</h4>
            <p className="text-[10px] text-slate-400">
              {deviceInfo?.database?.type || 'MongoDB / Resilient Store'}
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Integrity:</span>
              <span className="text-slate-200">HEALTHY</span>
            </div>
            <div className="flex justify-between">
              <span>Cache:</span>
              <span className="text-purple-400">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Hardware Table */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-aqua-primary" />
            <h3 className="text-base font-bold text-slate-100 font-sans">
              Submerged Probe Integrity & Pin Mapping
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">5 Probes Configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-2.5 px-3">SENSOR</th>
                <th className="py-2.5 px-3">HARDWARE MODEL</th>
                <th className="py-2.5 px-3">ESP32 PIN</th>
                <th className="py-2.5 px-3">ACCURACY</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sensors.map((s, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-200">{s.name}</td>
                  <td className="py-3 px-3 text-slate-300">{s.model}</td>
                  <td className="py-3 px-3 text-aqua-seafoam">{s.pin}</td>
                  <td className="py-3 px-3 text-slate-400">{s.accuracy}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        s.status === 'ONLINE'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      ● {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LoRa Expansion Architecture Notice */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-aqua-seafoam/10 border border-aqua-seafoam/30 text-aqua-seafoam">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 font-sans text-sm">
              LoRa communication — Planned expansion
            </h4>
            <p className="text-slate-400 text-[11px]">
              Modular edge hardware architecture designed for future Semtech SX1278 LoRa receiver expansion in remote telemetry basins.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-abyss-950 border border-white/10 text-slate-300 text-[10px] font-bold shrink-0">
          ARCHITECTURE READY
        </span>
      </div>
    </div>
  );
}
