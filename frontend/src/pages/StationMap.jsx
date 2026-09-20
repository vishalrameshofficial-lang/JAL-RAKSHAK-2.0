import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Radio,
  Activity,
  Droplets,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Info,
  Navigation
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

export default function StationMap() {
  const { telemetry, isEsp32Live, stationName, activeAlertsCount } = useWater();
  const [activeStationId, setActiveStationId] = useState('JR001');

  // Multi-station mock telemetry nodes showing architecture scalability
  const stations = [
    {
      id: 'JR001',
      name: stationName || 'JAL-RAKSHAK NODE 01',
      location: 'Hydrology Basin Station Alpha (Reference Node)',
      coordinates: '28.6139° N, 77.2090° E',
      xPercent: 48,
      yPercent: 42,
      status: isEsp32Live ? 'ONLINE' : 'OFFLINE',
      health: telemetry.healthScore,
      turbidity: telemetry.turbidity,
      ph: telemetry.ph,
      tds: telemetry.tds,
      isPrimary: true
    },
    {
      id: 'JR002',
      name: 'JAL-RAKSHAK NODE 02 (Telemetry Cluster)',
      location: 'River Confluence Reach Beta',
      coordinates: '28.6542° N, 77.2410° E',
      xPercent: 62,
      yPercent: 35,
      status: 'EXPANSION / STANDBY',
      health: 86,
      turbidity: 2.1,
      ph: 7.3,
      tds: 220,
      isPrimary: false
    },
    {
      id: 'JR003',
      name: 'JAL-RAKSHAK NODE 03 (Telemetry Cluster)',
      location: 'Agricultural Outflow Canal Gamma',
      coordinates: '28.5810° N, 77.1650° E',
      xPercent: 35,
      yPercent: 60,
      status: 'EXPANSION / STANDBY',
      health: 79,
      turbidity: 3.4,
      ph: 7.45,
      tds: 285,
      isPrimary: false
    }
  ];

  const selectedStation = stations.find((s) => s.id === activeStationId) || stations[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
            <MapPin className="w-4 h-4" />
            GEOSPATIAL TELEMETRY
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
            Monitoring Stations Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Catchment mapping and multi-node sensor telemetry grid
          </p>
        </div>

        <div className="flex items-center gap-2 bg-abyss-950/80 border border-white/10 rounded-2xl px-4 py-2 text-xs font-mono">
          <Navigation className="w-4 h-4 text-aqua-primary animate-pulse" />
          <span className="text-slate-300">Basin Coordinates:</span>
          <span className="text-aqua-seafoam font-bold">28.6139° N, 77.2090° E</span>
        </div>
      </div>

      {/* Main Map Viewport & Station Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive GIS Hydrology Radar Canvas */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* SVG Map Grid Background with Topographic River Ribbons */}
          <div className="absolute inset-0 bg-gradient-to-b from-abyss-950 via-abyss-900 to-abyss-950 pointer-events-none">
            {/* Topographic River Vector */}
            <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="50%" stopColor="#00B8D9" />
                  <stop offset="100%" stopColor="#20E3C2" />
                </linearGradient>
              </defs>
              {/* Coordinate Grid Lines */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#082C3A" strokeWidth="0.8" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Sinuous River Stream */}
              <path
                d="M 20 80 Q 200 120 280 240 T 540 320 T 800 440"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="18"
                strokeLinecap="round"
                className="blur-[2px]"
              />
              <path
                d="M 20 80 Q 200 120 280 240 T 540 320 T 800 440"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="4"
                strokeDasharray="10 5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Top Map Overlay Controls */}
          <div className="relative z-10 flex items-center justify-between font-mono text-xs text-slate-300">
            <span className="bg-abyss-950/80 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              GIS TELEMETRY RADAR
            </span>
            <span className="bg-abyss-950/80 px-3 py-1 rounded-lg border border-white/10 text-slate-400">
              Multi-Node Grid
            </span>
          </div>

          {/* Interactive Station Markers */}
          <div className="relative z-10 flex-1 my-8">
            {stations.map((st) => {
              const isSelected = activeStationId === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setActiveStationId(st.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all"
                  style={{ left: `${st.xPercent}%`, top: `${st.yPercent}%` }}
                >
                  {/* Glowing Animated Water Ripple Rings */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-12 h-12 rounded-full bg-aqua-primary/20 animate-ping pointer-events-none" />
                    <span className="absolute w-8 h-8 rounded-full bg-aqua-seafoam/30 pointer-events-none" />
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                        isSelected
                          ? 'bg-aqua-primary text-abyss-950 scale-125 ring-4 ring-aqua-primary/40'
                          : 'bg-abyss-900 border-2 border-aqua-primary text-aqua-primary group-hover:scale-110'
                      }`}
                    >
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Marker Popup Label */}
                  <div
                    className={`mt-2 font-mono text-[11px] px-2.5 py-1 rounded-lg border backdrop-blur-md whitespace-nowrap shadow-xl transition-all ${
                      isSelected
                        ? 'bg-abyss-950 text-aqua-primary border-aqua-primary font-bold'
                        : 'bg-abyss-950/80 text-slate-300 border-white/10 opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {st.name.split(' (')[0]} • {st.health}/100
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Info Footer */}
          <div className="relative z-10 p-3 bg-abyss-950/85 rounded-xl border border-white/10 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Geospatial Station Coordinates: Verified GPS Mesh (Configurable in Settings)</span>
            <span className="text-aqua-primary font-semibold">Ready for LoRa / Multi-Basin Expansion</span>
          </div>
        </div>

        {/* Selected Station Telemetry Card */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-aqua-seafoam font-bold uppercase">
                STATION TELEMETRY
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  selectedStation.status === 'ONLINE'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                }`}
              >
                ● {selectedStation.status}
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <h3 className="text-lg font-bold text-slate-100 font-sans">
                {selectedStation.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {selectedStation.location}
              </p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                GPS: {selectedStation.coordinates}
              </div>
            </div>

            {/* Health Score Pill */}
            <div className="my-4 p-4 rounded-2xl bg-abyss-950/70 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">WATER HEALTH</span>
                <div className="text-3xl font-bold font-mono text-slate-100">
                  {selectedStation.health} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                OPTIMAL
              </span>
            </div>

            {/* Telemetry Breakdown */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-abyss-900/60 border border-white/5">
                <span className="text-slate-400">Turbidity:</span>
                <span className="text-slate-100 font-bold">{selectedStation.turbidity} NTU</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-abyss-900/60 border border-white/5">
                <span className="text-slate-400">pH Level:</span>
                <span className="text-slate-100 font-bold">{selectedStation.ph}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-abyss-900/60 border border-white/5">
                <span className="text-slate-400">TDS:</span>
                <span className="text-slate-100 font-bold">{selectedStation.tds} ppm</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-abyss-950/80 rounded-xl border border-white/5 text-[11px] text-slate-400 font-mono">
            Notice: Station node telemetry streams autonomously via Wi-Fi gateway. LoRa multi-hop supported in firmware architecture.
          </div>
        </div>
      </div>
    </div>
  );
}
