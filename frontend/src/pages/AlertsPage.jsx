import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Info,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

export default function AlertsPage() {
  const { alerts, activeAlertsCount, criticalAlertsCount, acknowledgeAlert, resolveAlert, stationName } = useWater();
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'ACTIVE', 'RESOLVED'
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL', 'WARNING', 'CRITICAL'

  const filteredAlerts = alerts.filter((a) => {
    if (filterTab === 'ACTIVE' && a.status === 'RESOLVED') return false;
    if (filterTab === 'RESOLVED' && a.status !== 'RESOLVED') return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
            <Bell className="w-4 h-4" />
            EARLY-WARNING TRIAGE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
            Anomaly & Early-Warning Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Continuous threshold verification and incident management for {stationName}
          </p>
        </div>

        {/* Severity Count Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Critical: <strong className="text-sm">{criticalAlertsCount}</strong>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Active: <strong className="text-sm">{activeAlertsCount}</strong>
          </div>
        </div>
      </div>

      {/* Scientific Notice Banner */}
      <div className="p-3.5 bg-sky-950/40 border border-sky-500/30 rounded-2xl flex items-start gap-3 text-xs text-slate-300 font-mono leading-relaxed">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sky-300">Observation Protocol:</strong> Alerts signal empirical parameter deviations and potential contamination anomalies detected by electronic sensors. They trigger rapid field investigation and laboratory verification protocols.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex bg-abyss-950/80 border border-white/10 rounded-xl p-1">
          {['ALL', 'ACTIVE', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterTab === tab
                  ? 'bg-aqua-primary/20 text-aqua-primary border border-aqua-primary/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Alerts' : tab === 'ACTIVE' ? 'Active Events' : 'Resolved History'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-abyss-950 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-aqua-primary"
          >
            <option value="ALL">All Levels</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isResolved = alert.status === 'RESOLVED';

          return (
            <div
              key={alert._id}
              className={`glass-panel rounded-2xl p-5 border transition-all ${
                isResolved
                  ? 'border-white/5 opacity-70'
                  : isCritical
                  ? 'border-rose-500/40 shadow-glow-critical'
                  : 'border-amber-500/40 shadow-glow-warning'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl border ${
                      isCritical
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      ● {alert.severity} SEVERITY
                    </span>
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      Parameter: {alert.parameter?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      alert.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : alert.status === 'ACKNOWLEDGED'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Message and Action */}
              <div className="my-3 space-y-2">
                <h4 className="text-sm font-bold text-slate-100 font-sans">
                  {alert.message}
                </h4>

                <div className="p-3 bg-abyss-950/70 rounded-xl border border-white/5 text-xs text-slate-300 font-mono flex items-start gap-2">
                  <span className="text-aqua-seafoam font-bold shrink-0">RECOMMENDED ACTION:</span>
                  <span>{alert.recommendedAction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400 text-[11px]">
                  Station: {alert.deviceId || 'JR001'} ({stationName})
                </span>

                <div className="flex items-center gap-2">
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => acknowledgeAlert(alert._id)}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 transition-all text-xs font-bold"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => resolveAlert(alert._id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-aqua-primary/20">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-100 font-sans">
              No Alerts In This Category
            </h3>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
              All environmental telemetry indicators are operating within normal baseline limits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
