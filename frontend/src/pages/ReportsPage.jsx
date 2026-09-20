import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useWater } from '../context/WaterContext';

export default function ReportsPage() {
  const { stationName } = useWater();
  const [reportType, setReportType] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const res = await api.getReport(type);
      if (res.success && res.report) {
        setReportData(res.report);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(reportType);
  }, [reportType]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
            <FileText className="w-4 h-4" />
            COMPLIANCE & HYDROLOGY REPORTING
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
            Water Quality Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Structured environmental observation reports for hydrological assessment
          </p>
        </div>

        {/* Print / Download Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-aqua-deep via-aqua-primary to-aqua-seafoam text-abyss-950 font-mono text-xs font-bold tracking-wider uppercase shadow-glow-cyan hover:opacity-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Report Option Tabs */}
      <div className="flex bg-abyss-950/80 border border-white/10 rounded-2xl p-1.5 font-mono text-xs max-w-xl">
        {[
          { id: 'daily', label: 'Daily Monitoring Report (24h)' },
          { id: 'weekly', label: 'Weekly Quality Report (7d)' },
          { id: 'monthly', label: 'Monthly Summary (30d)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all ${
              reportType === tab.id
                ? 'bg-aqua-primary/20 text-aqua-primary border border-aqua-primary/40 font-bold shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Generated Report Sheet */}
      {reportData && (
        <div className="glass-panel-deep rounded-3xl p-6 sm:p-10 border border-aqua-primary/25 shadow-2xl space-y-8 font-sans">
          {/* Official Document Header */}
          <div className="border-b border-white/15 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
                JAL-RAKSHAK ENVIRONMENTAL INTELLIGENCE
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono tracking-tight mt-1">
                {reportData.title}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Report ID: {reportData.reportId} • Generated:{' '}
                {new Date(reportData.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-abyss-900/80 rounded-xl border border-white/10 text-right font-mono text-xs">
              <span className="text-slate-400">MONITORING PERIOD:</span>
              <p className="text-slate-200 font-bold">{reportData.periodTitle}</p>
            </div>
          </div>

          {/* Station & Edge Hardware Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-abyss-950/70 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400">Monitoring Station:</span>
              <p className="text-slate-100 font-bold text-sm">{reportData.station.name}</p>
              <p className="text-slate-400 text-[11px]">{reportData.station.location}</p>
            </div>

            <div className="p-4 bg-abyss-950/70 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400">Edge Hardware Platform:</span>
              <p className="text-slate-100 font-bold">{reportData.station.hardware}</p>
              <p className="text-slate-400 text-[11px]">Firmware: {reportData.station.firmware}</p>
            </div>

            <div className="p-4 bg-abyss-950/70 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400">Average Water Health:</span>
              <p className="text-emerald-400 font-bold text-lg">
                {reportData.monitoringSummary.averageWaterHealthScore} / 100
              </p>
              <p className="text-slate-400 text-[11px]">
                Classification: {reportData.monitoringSummary.healthClassification}
              </p>
            </div>
          </div>

          {/* Sensor Parameter Summary Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-aqua-primary" />
              Sensor Indicator Statistical Summary
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-white/10 rounded-xl overflow-hidden">
                <thead className="bg-abyss-950 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">PARAMETER</th>
                    <th className="p-3">NOMINAL RANGE</th>
                    <th className="p-3">MINIMUM</th>
                    <th className="p-3">AVERAGE</th>
                    <th className="p-3">MAXIMUM</th>
                    <th className="p-3 text-right">LATEST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-abyss-900/40">
                  {Object.entries(reportData.parameters).map(([key, p]) => (
                    <tr key={key} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-slate-200 capitalize">
                        {key === 'waterLevel' ? 'Water Level' : key} ({p.unit})
                      </td>
                      <td className="p-3 text-slate-400">{p.normalRange}</td>
                      <td className="p-3 text-emerald-400 font-medium">{p.min} {p.unit}</td>
                      <td className="p-3 text-aqua-primary font-bold">{p.avg} {p.unit}</td>
                      <td className="p-3 text-amber-400 font-medium">{p.max} {p.unit}</td>
                      <td className="p-3 text-right text-slate-100 font-bold">{p.current} {p.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Anomaly & Early-Warning Incidents */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Detected Indicator Anomalies ({reportData.anomalies.totalTriggered})
            </h3>

            {reportData.anomalies.events.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {reportData.anomalies.events.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-abyss-950/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded mr-2 ${
                          evt.severity === 'CRITICAL'
                            ? 'bg-rose-500/15 text-rose-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {evt.severity}
                      </span>
                      <span className="font-semibold text-slate-200">{evt.message}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] shrink-0">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 text-center">
                Zero critical contamination or threshold anomalies detected during this monitoring window.
              </div>
            )}
          </div>

          {/* Scientific Disclaimer Footer Required by Prompt */}
          <div className="pt-4 border-t border-white/10 text-xs font-mono text-slate-400 leading-relaxed space-y-1">
            <p>
              <strong className="text-slate-300">Notice & Limitation:</strong> {reportData.monitoringSummary.disclaimer}
            </p>
            <p className="text-[10px] text-slate-400">
              JAL-RAKSHAK Autonomous Hydrology Intelligence System • Smart India Hackathon Prototype Architecture
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
