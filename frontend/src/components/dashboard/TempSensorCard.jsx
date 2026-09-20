import React from 'react';
import { Thermometer, ArrowDownRight, ArrowUpRight, Minus, Info } from 'lucide-react';

export default function TempSensorCard({ value, delta = null }) {
  const hasData = value !== null && value !== undefined && !isNaN(value);
  const temp = hasData ? parseFloat(Number(value).toFixed(1)) : null;

  let status = 'WAITING';
  let badgeColor = 'bg-slate-800 text-slate-400 border-white/10';

  if (hasData) {
    if (temp < 10.0 || temp > 38.0) {
      status = 'CRITICAL';
      badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    } else if (temp < 15.0 || temp > 32.0) {
      status = 'WARNING';
      badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    } else {
      status = 'NORMAL';
      badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  }

  const percent = hasData ? Math.min(100, Math.max(0, (temp / 50) * 100)) : 0;

  return (
    <div className="glass-card-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              TEMPERATURE
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">DS18B20 Sealed</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
            ● {status}
          </span>
          <div className="relative group/tempinfo">
            <Info className="w-3.5 h-3.5 text-slate-500 hover:text-amber-400 cursor-pointer" />
            <div className="absolute right-0 top-5 w-60 p-2.5 bg-abyss-950/95 border border-white/10 rounded-lg text-[10px] text-slate-300 shadow-xl opacity-0 group-hover/tempinfo:opacity-100 transition-opacity pointer-events-none z-30">
              Water temperature modulates biochemical kinetics, dissolved oxygen capacity, and sensor baseline calibration factors.
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric */}
      <div className="my-3 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight transition-all">
            {hasData ? temp.toFixed(1) : '--'}
          </span>
          <span className="text-xs font-semibold text-slate-400 font-mono">°C</span>
        </div>

        <div className="flex items-center text-xs font-mono">
          {hasData && delta !== null && delta !== 0 ? (
            delta > 0 ? (
              <span className="text-amber-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{delta}°C
              </span>
            ) : (
              <span className="text-cyan-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> {delta}°C
              </span>
            )
          ) : (
            <span className="text-slate-500 flex items-center">
              <Minus className="w-3.5 h-3.5" /> --
            </span>
          )}
        </div>
      </div>

      {/* Thermal Gradient Bar */}
      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>0°C</span>
          <span className="text-amber-400 font-medium">Ambient (20-30°C)</span>
          <span>50°C</span>
        </div>
        <div className="h-2 w-full bg-abyss-950 rounded-full overflow-hidden border border-white/10 p-[1px]">
          {hasData && (
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500 transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          )}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
        <span>Standard: 18 - 32 °C</span>
        <span>{hasData ? 'Live DS18B20' : 'Waiting for sensor'}</span>
      </div>
    </div>
  );
}
