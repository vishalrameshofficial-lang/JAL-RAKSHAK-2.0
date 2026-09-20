import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  Activity,
  Droplets,
  Eye,
  Thermometer,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { useWater } from '../context/WaterContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function HistoricalData() {
  const { stationName } = useWater();
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedParam, setSelectedParam] = useState('turbidity');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const paramConfigs = {
    turbidity: {
      name: 'Turbidity',
      unit: 'NTU',
      color: '#00D4FF',
      threshold: 4.0,
      critical: 8.0,
      icon: Eye
    },
    ph: {
      name: 'pH Level',
      unit: 'pH',
      color: '#38BDF8',
      threshold: 8.5,
      minThreshold: 6.5,
      icon: Activity
    },
    tds: {
      name: 'Total Dissolved Solids',
      unit: 'ppm',
      color: '#20E3C2',
      threshold: 300,
      critical: 500,
      icon: Droplets
    },
    temperature: {
      name: 'Water Temperature',
      unit: '°C',
      color: '#F59E0B',
      threshold: 32.0,
      icon: Thermometer
    },
    waterLevel: {
      name: 'Water Level',
      unit: '%',
      color: '#A855F7',
      threshold: 25.0,
      icon: Layers
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getSensorHistory({ timeRange, limit: 300 });
      if (res.success && res.data) {
        const formatted = res.data.map((d) => ({
          time: new Date(d.timestamp).toLocaleTimeString([], {
            month: timeRange === '7d' || timeRange === '30d' ? 'short' : undefined,
            day: timeRange === '7d' || timeRange === '30d' ? 'numeric' : undefined,
            hour: '2-digit',
            minute: '2-digit'
          }),
          timestamp: d.timestamp,
          ph: d.ph,
          tds: d.tds,
          turbidity: d.turbidity,
          temperature: d.temperature,
          waterLevel: d.waterLevel,
          healthScore: d.healthScore
        }));
        setHistoryData(formatted);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [timeRange]);

  // Compute Statistics
  const values = historyData.map((d) => Number(d[selectedParam])).filter((v) => !isNaN(v));
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 0;
  const avgVal = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const latestVal = values.length ? values[values.length - 1] : 0;

  const currentCfg = paramConfigs[selectedParam];

  const handleDownloadCsv = () => {
    const url = api.getExportCsvUrl({ timeRange });
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector & CSV Export */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
            <BarChart3 className="w-4 h-4" />
            HISTORICAL ANALYTICS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
            Sensor Telemetry Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Time-series telemetry archive for {stationName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Filter Buttons */}
          <div className="flex bg-abyss-950/80 border border-white/10 rounded-xl p-1 text-xs font-mono">
            {['1h', '6h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-aqua-primary/20 text-aqua-primary border border-aqua-primary/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-aqua-primary/20 border border-aqua-primary/40 text-aqua-primary hover:text-slate-100 hover:border-aqua-primary font-mono text-xs font-bold transition-all shadow-glow-cyan"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Parameter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {Object.entries(paramConfigs).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isActive = selectedParam === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedParam(key)}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-aqua-primary/15 border-aqua-primary/50 text-aqua-primary shadow-glow-cyan font-bold'
                  : 'bg-abyss-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cfg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">LATEST RECORDING</span>
          <div className="text-2xl font-bold text-slate-100">
            {latestVal.toFixed(2)} <span className="text-xs text-slate-400">{currentCfg.unit}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">WINDOW AVERAGE</span>
          <div className="text-2xl font-bold text-aqua-primary">
            {avgVal.toFixed(2)} <span className="text-xs text-slate-400">{currentCfg.unit}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">RECORDED MINIMUM</span>
          <div className="text-2xl font-bold text-emerald-400">
            {minVal.toFixed(2)} <span className="text-xs text-slate-400">{currentCfg.unit}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">RECORDED MAXIMUM</span>
          <div className="text-2xl font-bold text-amber-400">
            {maxVal.toFixed(2)} <span className="text-xs text-slate-400">{currentCfg.unit}</span>
          </div>
        </div>
      </div>

      {/* Responsive Chart Container */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-aqua-primary" />
            <h3 className="text-sm font-bold text-slate-100 font-sans">
              {currentCfg.name} ({currentCfg.unit}) vs Time
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Points: {historyData.length} samples
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentCfg.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentCfg.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
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
                  borderColor: currentCfg.color,
                  borderRadius: '0.75rem',
                  color: '#F1F5F9',
                  fontFamily: 'monospace',
                  fontSize: '11px'
                }}
              />
              {currentCfg.threshold && (
                <ReferenceLine
                  y={currentCfg.threshold}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: `Warning Threshold (${currentCfg.threshold} ${currentCfg.unit})`,
                    fill: '#F59E0B',
                    fontSize: 10,
                    fontFamily: 'monospace'
                  }}
                />
              )}
              {currentCfg.critical && (
                <ReferenceLine
                  y={currentCfg.critical}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{
                    value: `Critical Threshold (${currentCfg.critical} ${currentCfg.unit})`,
                    fill: '#EF4444',
                    fontSize: 10,
                    fontFamily: 'monospace'
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey={selectedParam}
                stroke={currentCfg.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
