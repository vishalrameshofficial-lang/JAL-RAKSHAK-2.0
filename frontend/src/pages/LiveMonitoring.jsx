import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Terminal,
  Zap,
  RefreshCw,
  Droplets,
  Layers,
  Thermometer,
  Eye,
  Cpu
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function LiveMonitoring() {
  const {
    telemetry,
    prevTelemetry,
    deltas,
    isEsp32Live,
    stationName,
    eventStream
  } = useWater();

  const [livePoints, setLivePoints] = useState([]);
  const [selectedChartParam, setSelectedChartParam] = useState('turbidity');

  useEffect(() => {
    if (!telemetry) return;
    const point = {
      time: new Date(telemetry.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ph: telemetry.ph,
      tds: telemetry.tds,
      turbidity: telemetry.turbidity,
      temperature: telemetry.temperature,
      waterLevel: telemetry.waterLevel
    };

    setLivePoints((prev) => {
      const next = [...prev, point];
      if (next.length > 25) return next.slice(next.length - 25);
      return next;
    });
  }, [telemetry]);

  const paramConfigs = {
    turbidity: { name: 'Turbidity (NTU)', color: '#00D4FF', unit: 'NTU' },
    ph: { name: 'pH Value', color: '#38BDF8', unit: 'pH' },
    tds: { name: 'Total Dissolved Solids (ppm)', color: '#20E3C2', unit: 'ppm' },
    temperature: { name: 'Temperature (°C)', color: '#F59E0B', unit: '°C' },
    waterLevel: { name: 'Water Level (%)', color: '#A855F7', unit: '%' }
  };

  const sensorCards = [
    {
      id: 'ph',
      title: 'pH Sensor Probe',
      probe: 'Analog E-201-C (GPIO 34)',
      value: telemetry ? telemetry.ph.toFixed(2) : '--',
      unit: 'pH',
      prev: prevTelemetry ? prevTelemetry.ph.toFixed(2) : '--',
      delta: deltas.ph,
      status: telemetry ? (telemetry.ph < 6.5 || telemetry.ph > 8.5 ? 'WARNING' : 'NORMAL') : 'WAITING',
      icon: Activity,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/30'
    },
    {
      id: 'tds',
      title: 'TDS Sensor Probe',
      probe: 'Conductivity Meter (GPIO 35)',
      value: telemetry ? telemetry.tds : '--',
      unit: 'ppm',
      prev: prevTelemetry ? prevTelemetry.tds : '--',
      delta: deltas.tds,
      status: telemetry ? (telemetry.tds > 300 ? 'WARNING' : 'NORMAL') : 'WAITING',
      icon: Droplets,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/30'
    },
    {
      id: 'turbidity',
      title: 'Turbidity Sensor Probe',
      probe: 'Optical TS-300B (GPIO 32)',
      value: telemetry ? telemetry.turbidity.toFixed(2) : '--',
      unit: 'NTU',
      prev: prevTelemetry ? prevTelemetry.turbidity.toFixed(2) : '--',
      delta: deltas.turbidity,
      status: telemetry ? (telemetry.turbidity > 4.0 ? 'WARNING' : 'NORMAL') : 'WAITING',
      icon: Eye,
      color: 'text-aqua-primary',
      bgColor: 'bg-aqua-primary/10 border-aqua-primary/30'
    },
    {
      id: 'temperature',
      title: 'Water Temperature Probe',
      probe: 'DS18B20 Sealed (GPIO 4)',
      value: telemetry ? telemetry.temperature.toFixed(1) : '--',
      unit: '°C',
      prev: prevTelemetry ? prevTelemetry.temperature.toFixed(1) : '--',
      delta: deltas.temperature,
      status: telemetry ? (telemetry.temperature > 32 || telemetry.temperature < 15 ? 'WARNING' : 'NORMAL') : 'WAITING',
      icon: Thermometer,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'waterLevel',
      title: 'Reservoir Level Head',
      probe: 'Ultrasonic (GPIO 5, 18)',
      value: telemetry ? telemetry.waterLevel : '--',
      unit: '%',
      prev: prevTelemetry ? prevTelemetry.waterLevel : '--',
      delta: deltas.waterLevel,
      status: telemetry ? (telemetry.waterLevel < 25 ? 'WARNING' : 'NORMAL') : 'WAITING',
      icon: Layers,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
              HARDWARE TELEMETRY STREAM
            </span>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isEsp32Live
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isEsp32Live ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              {isEsp32Live ? 'DATA STREAM ACTIVE' : 'WAITING FOR ESP32 STREAM'}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
            Live Water Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            {isEsp32Live
              ? `Real-time sensor stream streaming from ${stationName} via WebSockets`
              : 'Listening on port 5000 for incoming ESP32 HTTP POST / WebSocket packets...'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-abyss-950/80 border border-white/10 p-3 rounded-2xl font-mono text-xs">
          <Zap className="w-4 h-4 text-aqua-primary animate-bounce" />
          <div>
            <div className="text-[10px] text-slate-400">TELEMETRY LINK</div>
            <div className="text-slate-100 font-bold">{isEsp32Live ? 'LIVE' : 'IDLE / LISTENING'}</div>
          </div>
        </div>
      </div>

      {/* 5 Large Live Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sensorCards.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div
              key={sensor.id}
              className={`glass-panel rounded-2xl p-5 border transition-all ${
                sensor.status === 'WARNING'
                  ? 'border-amber-500/40 shadow-glow-warning'
                  : 'border-aqua-primary/15'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl border ${sensor.bgColor} ${sensor.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    sensor.status === 'WARNING'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : sensor.status === 'NORMAL'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-white/10'
                  }`}
                >
                  ● {sensor.status}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400 font-semibold">{sensor.title}</div>
              <div className="text-[10px] font-mono text-slate-400">{sensor.probe}</div>

              {/* Current Value Display */}
              <div className="my-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
                  {sensor.value}
                </span>
                <span className="text-xs font-mono text-slate-400">{sensor.unit}</span>
              </div>

              {/* Previous & Delta */}
              <div className="pt-2 border-t border-white/5 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Previous:</span>
                  <span className="text-slate-200">{sensor.prev} {sensor.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Delta:</span>
                  <span className="flex items-center font-bold">
                    {sensor.delta !== null && sensor.delta !== undefined && sensor.delta !== 0 ? (
                      sensor.delta > 0 ? (
                        <span className="text-amber-400 flex items-center">
                          <ArrowUpRight className="w-3 h-3" /> +{sensor.delta}
                        </span>
                      ) : (
                        <span className="text-cyan-400 flex items-center">
                          <ArrowDownRight className="w-3 h-3" /> {sensor.delta}
                        </span>
                      )
                    ) : (
                      <span className="text-slate-500 flex items-center">
                        <Minus className="w-3 h-3" /> --
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Chart Stream & Scrolling Event Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-Time Chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-aqua-primary/20 shadow-glass-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                <Activity className="w-4 h-4 text-aqua-primary" />
                Live Hardware Telemetry Oscilloscope
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {livePoints.length > 0
                  ? `${livePoints.length} live hardware points plotted`
                  : 'Awaiting first packet from ESP32 to plot oscilloscope trace...'}
              </p>
            </div>

            <div className="flex bg-abyss-950/80 border border-white/10 rounded-lg p-0.5 text-xs font-mono">
              {Object.keys(paramConfigs).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedChartParam(key)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    selectedChartParam === key
                      ? 'bg-aqua-primary/20 text-aqua-primary border border-aqua-primary/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {livePoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={livePoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#082C3A" />
                  <XAxis
                    dataKey="time"
                    stroke="#475569"
                    tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    stroke="#475569"
                    tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#03131F',
                      borderColor: '#00D4FF',
                      borderRadius: '0.75rem',
                      color: '#F1F5F9',
                      fontFamily: 'monospace',
                      fontSize: '11px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedChartParam}
                    name={paramConfigs[selectedChartParam].name}
                    stroke={paramConfigs[selectedChartParam].color}
                    strokeWidth={2.5}
                    dot={{ fill: paramConfigs[selectedChartParam].color, r: 3 }}
                    activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center font-mono text-xs text-slate-500 space-y-2">
                <Cpu className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <p>Waiting for ESP32 packet transmission to render oscilloscope trace.</p>
                <p className="text-[10px] text-slate-600">
                  Data endpoint: <code>POST http://localhost:5000/api/sensor-data</code>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Terminal Scrolling Event Stream */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-aqua-primary/20 shadow-glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-aqua-seafoam" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                Hardware Telemetry Event Log
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-abyss-950 px-2 py-0.5 rounded border border-white/5">
              AUTO-STREAM
            </span>
          </div>

          <div className="my-3 space-y-1.5 h-64 overflow-y-auto font-mono text-[11px] pr-2">
            {eventStream.map((evt) => (
              <div
                key={evt.id}
                className={`p-2 rounded-lg border flex items-start gap-2.5 transition-all ${
                  evt.type === 'warning' || evt.type === 'critical'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : evt.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-abyss-950/60 border-white/5 text-slate-300'
                }`}
              >
                <span className="text-slate-500 shrink-0 font-medium">{evt.time}</span>
                <span className="break-all">{evt.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Buffer: 50 Real Packets</span>
            <span className="text-aqua-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-aqua-primary animate-ping"></span>
              Listening on ws://
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
