import React from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Minus, Info } from 'lucide-react';

export default function PhSensorCard({ value, delta = null }) {
  const hasData = value !== null && value !== undefined && !isNaN(value);
  const ph = hasData ? Number(value) : null;

  let status = 'WAITING';
  let badgeColor = 'bg-slate-800 text-slate-400 border-white/10';

  if (hasData) {
    if (ph < 6.0 || ph > 9.0) {
      status = 'CRITICAL';
      badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    } else if (ph < 6.5 || ph > 8.5) {
      status = 'WARNING';
      badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    } else {
      status = 'NORMAL';
      badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  }

  const markerPercent = hasData ? Math.max(0, Math.min(100, (ph / 14) * 100)) : 50;

  return (
    <div className="glass-card-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              pH SENSOR
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Analog E-201-C</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
            ● {status}
          </span>
          <div className="relative group/phinfo">
            <Info className="w-3.5 h-3.5 text-slate-500 hover:text-sky-400 cursor-pointer" />
            <div className="absolute right-0 top-5 w-56 p-2.5 bg-abyss-950/95 border border-white/10 rounded-lg text-[10px] text-slate-300 shadow-xl opacity-0 group-hover/phinfo:opacity-100 transition-opacity pointer-events-none z-30">
              Hydrogen ion activity indicator. Continuous monitoring parameter. Does not verify potability alone.
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Display */}
      <div className="my-3 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight transition-all">
            {hasData ? ph.toFixed(2) : '--'}
          </span>
          <span className="text-xs font-semibold text-slate-400 font-mono">pH</span>
        </div>

        <div className="flex items-center text-xs font-mono">
          {hasData && delta !== null && delta !== 0 ? (
            delta > 0 ? (
              <span className="text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{delta}%
              </span>
            ) : (
              <span className="text-amber-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> {delta}%
              </span>
            )
          ) : (
            <span className="text-slate-500 flex items-center">
              <Minus className="w-3.5 h-3.5" /> --
            </span>
          )}
        </div>
      </div>

      {/* 0 - 7 - 14 pH Scale Visualization */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400 font-semibold px-0.5">
          <span>0 (Acidic)</span>
          <span className="text-emerald-400 font-bold">7 (Neutral)</span>
          <span>14 (Alkaline)</span>
        </div>

        <div className="relative h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-600 p-[1px] opacity-70">
          {hasData && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-abyss-950 shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-all duration-500"
              style={{ left: `calc(${markerPercent}% - 8px)` }}
            />
          )}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
        <span>Target: 6.5 - 8.5 pH</span>
        <span className="italic">{hasData ? 'Live ESP32' : 'Waiting for sensor'}</span>
      </div>
    </div>
  );
}
