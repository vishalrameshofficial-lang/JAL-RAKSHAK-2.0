import React from 'react';
import {
  Droplets,
  Radio,
  Clock,
  MapPin,
  Wifi,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import WaterHealthRing from '../components/dashboard/WaterHealthRing';
import PhSensorCard from '../components/dashboard/PhSensorCard';
import TdsSensorCard from '../components/dashboard/TdsSensorCard';
import TurbidityCard from '../components/dashboard/TurbidityCard';
import TempSensorCard from '../components/dashboard/TempSensorCard';
import WaterLevelTankCard from '../components/dashboard/WaterLevelTankCard';
import FieldMonitoringNode3D from '../components/three/FieldMonitoringNode3D';

export default function Overview({ setActivePage }) {
  const {
    telemetry,
    deltas,
    isEsp32Live,
    stationName,
    secondsSinceLastSeen,
    activeAlertsCount,
    alerts,
    eventStream
  } = useWater();

  const formatLastSeen = (sec) => {
    if (sec === null || sec === undefined) return 'Waiting for first transmission...';
    if (sec === 0 || sec === 1) return 'Just now';
    if (sec < 60) return `${sec}s ago`;
    return `${Math.floor(sec / 60)}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Dashboard Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-aqua-primary/20 shadow-glass-card relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-aqua-primary/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-aqua-primary/10 border border-aqua-primary/30 text-aqua-primary">
                <Droplets className="w-5 h-5 animate-bounce" />
              </div>
              <span className="text-xs font-mono font-bold text-aqua-seafoam uppercase tracking-widest">
                Real-Time IoT Hydrology
              </span>
              <span className="text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Pure Hardware Mode
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight font-sans">
              Water Intelligence Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Real-time monitoring of water quality directly from physical sensors and your ESP32 microcontroller.
            </p>
          </div>

          {/* Node Metadata Station Badge */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-abyss-950/70 border border-white/10 rounded-2xl p-4 font-mono text-xs shadow-inner">
            <div className="space-y-1 pr-3 border-r border-white/10">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Active Station
              </div>
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isEsp32Live ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                {stationName}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" /> Basin Station Alpha
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Edge Link State
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    isEsp32Live
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}
                >
                  ● {isEsp32Live ? 'ONLINE (LIVE)' : 'WAITING FOR ESP32'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {formatLastSeen(secondsSinceLastSeen)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* When waiting for ESP32 hardware, display instructional banner */}
      {!isEsp32Live && (
        <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-xs font-mono text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-sky-300 block text-sm">
                Waiting for ESP32 connection...
              </span>
              <span className="text-slate-400 text-[11px]">
                Power on your ESP32. It will post sensor readings to{' '}
                <code className="text-aqua-seafoam bg-abyss-950 px-1.5 py-0.5 rounded border border-white/10">
                  http://&lt;YOUR_IP&gt;:5000/api/sensor-data
                </code>
              </span>
            </div>
          </div>

          <button
            onClick={() => setActivePage('settings')}
            className="px-3 py-1.5 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-200 text-xs hover:bg-sky-500/30 transition-all shrink-0"
          >
            View Arduino Code Snippet
          </button>
        </div>
      )}

      {/* Top Metrics Grid: Water Health Ring + 5 Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Central Water Health Ring */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1">
          <WaterHealthRing score={telemetry?.healthScore} />
        </div>

        {/* 1. pH Sensor Card */}
        <PhSensorCard
          value={telemetry?.ph}
          delta={deltas.ph}
        />

        {/* 2. TDS Sensor Card */}
        <TdsSensorCard
          value={telemetry?.tds}
          delta={deltas.tds}
        />

        {/* 3. Turbidity Sensor Card */}
        <TurbidityCard
          value={telemetry?.turbidity}
          delta={deltas.turbidity}
        />

        {/* 4. Temperature Sensor Card */}
        <TempSensorCard
          value={telemetry?.temperature}
          delta={deltas.temperature}
        />

        {/* 5. Water Level Sensor Card */}
        <WaterLevelTankCard
          value={telemetry?.waterLevel}
          delta={deltas.waterLevel}
        />
      </div>

      {/* Interactive 3D Field Station Digital Twin + Live Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Field Monitoring Node Visualizer */}
        <div className="lg:col-span-7">
          <FieldMonitoringNode3D />
        </div>

        {/* Right Column: Live Event Log & Alerts */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-aqua-primary/20 shadow-glass-card flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${activeAlertsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
                <h3 className="text-sm font-bold text-slate-100 font-sans">
                  Early-Warning Alert Status
                </h3>
              </div>
              <button
                onClick={() => setActivePage('alerts')}
                className="text-xs text-aqua-primary hover:text-aqua-seafoam font-mono flex items-center gap-1 transition-colors"
              >
                View all ({alerts.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-3 space-y-2.5">
              {alerts.filter(a => a.status === 'ACTIVE').slice(0, 2).map((alert) => (
                <div
                  key={alert._id}
                  className={`p-3 rounded-xl border text-xs space-y-1 font-mono transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-glow-critical'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-glow-warning'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                      {alert.severity} ANOMALY
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="font-sans font-medium text-slate-200">
                    {alert.message}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Action: {alert.recommendedAction}
                  </p>
                </div>
              ))}

              {alerts.filter(a => a.status === 'ACTIVE').length === 0 && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300 space-y-1 font-mono">
                  <ShieldCheck className="w-6 h-6 mx-auto text-emerald-400" />
                  <p className="font-bold">Hardware Alert Monitor Clear</p>
                  <p className="text-[10px] text-slate-400 font-normal">
                    {isEsp32Live ? 'All live sensor indicators operating in normal range.' : 'Awaiting sensor stream.'}
                  </p>
                </div>
              )}
            </div>

            {/* Live Streaming Event Feed */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-aqua-primary">
                  <Activity className="w-3.5 h-3.5" /> LIVE TELEMETRY LOG
                </span>
                <span className="text-[10px] bg-abyss-950 px-2 py-0.5 rounded border border-white/5">
                  Real-Time
                </span>
              </div>

              <div className="space-y-1 max-h-28 overflow-y-auto font-mono text-[10px] text-slate-400 pr-1">
                {eventStream.slice(0, 4).map((evt) => (
                  <div key={evt.id} className="flex items-center gap-2 py-0.5 border-b border-white/5">
                    <span className="text-slate-500">{evt.time}</span>
                    <span className="text-slate-300 truncate">{evt.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
