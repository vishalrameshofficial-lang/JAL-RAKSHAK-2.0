import React, { useState, useEffect } from 'react';
import {
  Menu,
  Wifi,
  Bell,
  Cpu,
  User,
  Radio
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

export default function Topbar({ activePage, setActivePage, isCollapsed, setIsMobileOpen, onSignOut }) {
  const {
    isEsp32Live,
    incomingPulse,
    activeAlertsCount,
    secondsSinceLastSeen,
    stationName
  } = useWater();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitles = {
    overview: 'Water Intelligence Center',
    live: 'Live Sensor Stream & Telemetry',
    quality: 'Water Quality & Parameter Analysis',
    history: 'Historical Sensor Telemetry & Analytics',
    alerts: 'Anomaly & Early-Warning Alerts',
    device: 'Node Hardware & Edge Diagnostics',
    map: 'Telemetry Station Geo-Mapping',
    reports: 'Hydrological Compliance & Environmental Reports',
    settings: 'Threshold Calibration & Station Settings'
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-aqua-primary/15 px-4 lg:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/5"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                {pageTitles[activePage] || 'Environmental Center'}
              </h1>
              {incomingPulse && (
                <span className="w-2 h-2 rounded-full bg-aqua-primary animate-ping" title="Telemetry pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {stationName} • PURE LIVE SENSOR TELEMETRY MODE
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Live Hardware Link Indicator */}
          <div className="flex items-center gap-2 bg-abyss-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono">
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isEsp32Live ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
              {isEsp32Live && incomingPulse && (
                <span className="absolute w-4 h-4 rounded-full bg-aqua-primary/60 animate-ping" />
              )}
            </div>
            <span className="font-semibold text-slate-200 hidden sm:inline">
              {isEsp32Live ? 'ESP32 ONLINE (LIVE)' : 'WAITING FOR ESP32'}
            </span>
            <Wifi className={`w-3.5 h-3.5 ${isEsp32Live ? 'text-aqua-primary' : 'text-slate-500'}`} />
          </div>

          {/* Digital Clock */}
          <div className="hidden xl:flex flex-col text-right font-mono text-[11px] leading-tight text-slate-400">
            <span className="text-slate-200 font-medium">
              {currentTime.toLocaleTimeString()}
            </span>
            <span className="text-[10px]">
              {currentTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setActivePage('alerts')}
            className="relative p-2 rounded-xl bg-abyss-950/70 border border-white/10 text-slate-300 hover:text-aqua-primary hover:border-aqua-primary/40 transition-all"
            title="View Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-glow-critical animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-abyss-950/70 border border-white/10 hover:border-aqua-primary/40 transition-all text-xs"
            title="Sign out / Switch to landing"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-aqua-deep to-aqua-primary flex items-center justify-center text-abyss-950 font-bold text-[10px]">
              JR
            </div>
            <span className="font-medium text-slate-200 hidden sm:inline">Telemetry Officer</span>
          </button>
        </div>
      </div>
    </header>
  );
}
