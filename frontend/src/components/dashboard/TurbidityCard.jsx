import React from 'react';
import { Eye, ArrowDownRight, ArrowUpRight, Minus, Info, AlertTriangle } from 'lucide-react';

export default function TurbidityCard({ value, delta = null }) {
  const hasData = value !== null && value !== undefined && !isNaN(value);
  const turb = hasData ? parseFloat(Number(value).toFixed(2)) : null;

  let status = 'WAITING';
  let badgeColor = 'bg-slate-800 text-slate-400 border-white/10';
  let clarityText = 'Awaiting ESP32 hardware reading';
  let waterContainerBg = 'bg-abyss-950/80 border-white/10';
  let hazeOpacity = 0.0;

  if (hasData) {
    if (turb >= 8.0) {
      status = 'CRITICAL';
      badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      clarityText = 'Severe Turbidity / Heavy Suspended Matter';
      waterContainerBg = 'bg-gradient-to-b from-amber-800/40 via-yellow-900/60 to-amber-950/70 border-rose-500/40';
      hazeOpacity = 0.85;
    } else if (turb >= 4.0) {
      status = 'WARNING';
      badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      clarityText = 'Cloudy / Suspended Colloidal Particulates';
      waterContainerBg = 'bg-gradient-to-b from-amber-600/25 via-yellow-700/35 to-stone-800/50 border-amber-500/40';
      hazeOpacity = 0.45;
    } else {
      status = 'NORMAL';
      badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      clarityText = 'Crystal Clear (Pristine)';
      waterContainerBg = 'bg-gradient-to-b from-cyan-400/20 via-sky-500/30 to-blue-600/40 border-cyan-400/30';
      hazeOpacity = 0.05;
    }
  }

  return (
    <div className="glass-card-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-aqua-primary/15 border border-aqua-primary/30 flex items-center justify-center text-aqua-primary">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              TURBIDITY SENSOR
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Optical TS-300B</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
            ● {status}
          </span>
          <div className="relative group/turbinfo">
            <Info className="w-3.5 h-3.5 text-slate-500 hover:text-aqua-primary cursor-pointer" />
            <div className="absolute right-0 top-5 w-60 p-2.5 bg-abyss-950/95 border border-white/10 rounded-lg text-[10px] text-slate-300 shadow-xl opacity-0 group-hover/turbinfo:opacity-100 transition-opacity pointer-events-none z-30">
              Measures light scattering by suspended particles in Nephelometric Turbidity Units (NTU). Rapid spikes signal run-off or contamination events.
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Display */}
      <div className="my-3 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight transition-all">
            {hasData ? turb.toFixed(2) : '--'}
          </span>
          <span className="text-xs font-semibold text-slate-400 font-mono">NTU</span>
        </div>

        <div className="flex items-center text-xs font-mono">
          {hasData && delta !== null && delta !== 0 ? (
            delta > 0 ? (
              <span className="text-rose-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{delta} NTU
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> {delta} NTU
              </span>
            )
          ) : (
            <span className="text-slate-500 flex items-center">
              <Minus className="w-3.5 h-3.5" /> --
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Animated Water Clarity Chamber */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-400">Optical Clarity:</span>
          <span className={status === 'NORMAL' ? 'text-cyan-400' : 'text-slate-400'}>
            {clarityText}
          </span>
        </div>

        <div
          className={`h-8 w-full rounded-xl relative overflow-hidden border transition-all duration-700 flex items-center justify-center ${waterContainerBg}`}
        >
          {hasData && (
            <>
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_120%,rgba(0,212,255,0.4),transparent)] animate-pulse" />
              <div
                className="absolute inset-0 bg-yellow-900/60 backdrop-blur-[2px] transition-opacity duration-700 pointer-events-none"
                style={{ opacity: hazeOpacity }}
              />
              <div className="relative z-10 flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-200">
                {status !== 'NORMAL' && <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-bounce" />}
                <span className="drop-shadow">{turb.toFixed(2)} NTU</span>
              </div>
            </>
          )}
          {!hasData && (
            <span className="text-[10px] text-slate-500 font-mono">Waiting for optical sensor</span>
          )}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
        <span>Baseline: &lt; 4.0 NTU</span>
        <span>{hasData ? 'Live TS-300B' : 'Waiting for sensor'}</span>
      </div>
    </div>
  );
}
