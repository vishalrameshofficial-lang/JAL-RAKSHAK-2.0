import React from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  Cpu,
  Droplets,
  FileText,
  Gauge,
  MapPin,
  Settings,
  Radio,
  Wifi,
  Shield,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'live', label: 'Live Monitoring', icon: Activity, badge: 'LIVE' },
  { id: 'quality', label: 'Water Quality', icon: Droplets },
  { id: 'history', label: 'Historical Data', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell, hasAlerts: true },
  { id: 'device', label: 'Device Status', icon: Cpu },
  { id: 'map', label: 'Station Map', icon: MapPin },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, setActivePage, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const { isEsp32Live, activeAlertsCount, isBackendOnline, stationName } = useWater();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 flex flex-col justify-between
          glass-panel-deep border-r border-aqua-primary/15
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Logo Brand */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActivePage('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aqua-primary via-cyan-500 to-aqua-seafoam p-[2px] shadow-glow-cyan shrink-0">
              <div className="w-full h-full bg-abyss-950 rounded-[10px] flex items-center justify-center">
                <Droplets className="w-5 h-5 text-aqua-primary animate-pulse" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold tracking-wider text-base text-slate-100 font-mono flex items-center gap-1">
                  JAL-RAKSHAK
                </span>
                <span className="text-[9px] text-aqua-seafoam font-semibold tracking-widest uppercase">
                  Monitor • Detect • Protect
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-aqua-primary/20 via-aqua-primary/10 to-transparent text-aqua-primary border-l-4 border-aqua-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-aqua-primary' : 'text-slate-400 group-hover:text-aqua-seafoam'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {/* Badge or Alert count */}
                {!isCollapsed && item.hasAlerts && activeAlertsCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-glow-critical animate-pulse">
                    {activeAlertsCount}
                  </span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-abyss-950 text-xs text-slate-200 rounded-md border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Hardware & Connection Pill */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-abyss-950/60">
          {!isCollapsed ? (
            <>
              <div className="bg-abyss-900/80 border border-white/5 rounded-xl p-2.5 text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Cpu className="w-3.5 h-3.5 text-slate-300" /> ESP32 Link
                  </span>
                  <span
                    className={`text-[10px] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded ${
                      isEsp32Live
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isEsp32Live ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                    {isEsp32Live ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Wifi className="w-3.5 h-3.5 text-slate-300" /> Wi-Fi RSSI
                  </span>
                  <span className="text-[10px] text-aqua-seafoam font-medium">
                    {isEsp32Live ? '-58 dBm' : 'NO LINK'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Database className="w-3.5 h-3.5 text-slate-300" /> Storage
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    CONNECTED
                  </span>
                </div>
              </div>

              <div className="text-[9px] text-center text-slate-400 tracking-wider">
                NODE: <span className="text-slate-300">{stationName}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isEsp32Live ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500'
                }`}
                title={isEsp32Live ? 'ESP32 ONLINE' : 'ESP32 OFFLINE'}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
