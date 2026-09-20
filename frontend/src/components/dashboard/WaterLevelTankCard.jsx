import React from 'react';
import { Layers, ArrowDownRight, ArrowUpRight, Minus, Info } from 'lucide-react';

export default function WaterLevelTankCard({ value, delta = null }) {
  const hasData = value !== null && value !== undefined && !isNaN(value);
  const level = hasData ? Math.round(Number(value)) : null;

  let status = 'WAITING';
  let badgeColor = 'bg-slate-800 text-slate-400 border-white/10';
  let waterGrad = 'from-aqua-primary/40 via-cyan-500/50 to-blue-600/70';

  if (hasData) {
    if (level <= 15) {
      status = 'CRITICAL LOW';
      badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      waterGrad = 'from-rose-500/50 via-amber-500/50 to-red-700/70';
    } else if (level <= 25) {
      status = 'LOW';
      badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      waterGrad = 'from-amber-400/50 via-yellow-500/50 to-orange-600/70';
    } else if (level >= 95) {
      status = 'OVERFLOW RISK';
      badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      waterGrad = 'from-purple-400/50 via-indigo-500/50 to-blue-700/70';
    } else if (level >= 90) {
      status = 'HIGH';
      badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    } else {
      status = 'NORMAL';
      badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  }

  return (
    <div className="glass-card-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              WATER LEVEL
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Hydrostatic Head</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
            ● {status}
          </span>
          <div className="relative group/levelinfo">
            <Info className="w-3.5 h-3.5 text-slate-500 hover:text-purple-400 cursor-pointer" />
            <div className="absolute right-0 top-5 w-60 p-2.5 bg-abyss-950/95 border border-white/10 rounded-lg text-[10px] text-slate-300 shadow-xl opacity-0 group-hover/levelinfo:opacity-100 transition-opacity pointer-events-none z-30">
              Continuously measures reservoir column capacity. Prevents dry-run pump damage and catchment flooding.
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric & Tank Visual Row */}
      <div className="my-2 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight transition-all">
              {hasData ? level : '--'}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-mono">%</span>
          </div>

          <div className="flex items-center text-xs font-mono mt-1">
            {hasData && delta !== null && delta !== 0 ? (
              delta > 0 ? (
                <span className="text-cyan-400 flex items-center">
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
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {hasData ? `Effective: ~${(level * 12.5).toFixed(0)} L` : 'Reservoir Volume: --'}
          </div>
        </div>

        {/* Animated Vertical Water Tank Visualization */}
        <div className="w-16 h-20 rounded-xl bg-abyss-950/80 border-2 border-aqua-primary/30 relative overflow-hidden flex flex-col justify-end p-0.5 shadow-inner">
          <div className="absolute left-1 top-2 w-1.5 h-[1px] bg-white/30 z-20"></div>
          <div className="absolute left-1 top-6 w-2 h-[1px] bg-white/40 z-20"></div>
          <div className="absolute left-1 top-10 w-1.5 h-[1px] bg-white/30 z-20"></div>
          <div className="absolute left-1 top-14 w-2 h-[1px] bg-white/40 z-20"></div>

          {hasData && (
            <div
              className={`w-full rounded-b-lg bg-gradient-to-t ${waterGrad} relative transition-all duration-700`}
              style={{ height: `${Math.max(8, Math.min(100, level))}%` }}
            >
              <div className="absolute -top-1.5 left-0 right-0 h-3 bg-aqua-primary/60 rounded-full blur-[1px] animate-wave-flow" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2),transparent)]" />
            </div>
          )}

          {!hasData && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[9px] text-slate-500 font-mono text-center">Empty</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-1 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
        <span>Capacity: 50% - 90%</span>
        <span>{hasData ? 'Live Level' : 'Waiting for sensor'}</span>
      </div>
    </div>
  );
}
