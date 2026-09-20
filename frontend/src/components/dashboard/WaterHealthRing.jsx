import React from 'react';
import { Info, Waves, Radio } from 'lucide-react';

export default function WaterHealthRing({ score }) {
  const hasData = score !== null && score !== undefined && !isNaN(score);
  const cleanScore = hasData ? Math.max(0, Math.min(100, Math.round(score))) : null;

  // SVG parameters
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = hasData
    ? circumference - (cleanScore / 100) * circumference
    : circumference;

  let statusText = 'WAITING FOR SENSORS';
  let colorHex = '#00B8D9';
  let glowClass = '';
  let badgeBg = 'bg-slate-800 text-slate-300 border-white/10';

  if (hasData) {
    if (cleanScore < 60) {
      statusText = 'CRITICAL ATTENTION';
      colorHex = '#EF4444';
      glowClass = 'drop-shadow-[0_0_14px_rgba(239,68,68,0.6)]';
      badgeBg = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    } else if (cleanScore < 75) {
      statusText = 'MONITORING WARNING';
      colorHex = '#F59E0B';
      glowClass = 'drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]';
      badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    } else if (cleanScore < 90) {
      statusText = 'GOOD';
      colorHex = '#00D4FF';
      glowClass = 'drop-shadow-[0_0_12px_rgba(0,212,255,0.5)]';
      badgeBg = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    } else {
      statusText = 'OPTIMAL';
      colorHex = '#20E3C2';
      glowClass = 'drop-shadow-[0_0_12px_rgba(32,227,194,0.5)]';
      badgeBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-between relative border border-aqua-primary/20 shadow-glass-card group">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 text-aqua-seafoam font-mono font-semibold tracking-wider uppercase text-[11px]">
          <Waves className="w-3.5 h-3.5" />
          WATER HEALTH
        </div>

        <div className="relative group/tooltip">
          <button className="text-slate-400 hover:text-aqua-primary transition-colors">
            <Info className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-6 w-64 p-3 bg-abyss-950/95 border border-aqua-primary/30 rounded-xl text-[11px] text-slate-300 shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 backdrop-blur-md">
            <div className="font-bold text-aqua-primary mb-1 flex items-center gap-1">
              <Info className="w-3 h-3" /> Indicative Monitoring Score
            </div>
            This score calculates continuous sensor readings (pH, TDS, Turbidity, Temp, Level) received from the ESP32. It does not replace laboratory testing.
          </div>
        </div>
      </div>

      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center my-3">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke="#082C3A"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={colorHex}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease'
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={glowClass}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight transition-all">
            {hasData ? cleanScore : '--'}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {hasData ? 'INDEX / 100' : 'NO TELEMETRY'}
          </span>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="w-full flex flex-col items-center text-center mt-2 space-y-1">
        <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider border ${badgeBg}`}>
          {statusText}
        </div>
        <p className="text-[11px] text-slate-400 italic">
          {hasData ? 'Indicative live score' : 'Awaiting ESP32 hardware packet'}
        </p>
      </div>
    </div>
  );
}
