import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import WaterCanvasBackground from '../three/WaterCanvasBackground';

export default function Layout({ children, activePage, setActivePage, onSignOut }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712]/50 text-slate-100 flex relative overflow-x-hidden">
      {/* 3D Dynamic Live Water Simulation */}
      <WaterCanvasBackground opacity={0.9} interactive={true} />

      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Topbar
          activePage={activePage}
          setActivePage={setActivePage}
          isCollapsed={isCollapsed}
          setIsMobileOpen={setIsMobileOpen}
          onSignOut={onSignOut}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Global Hydrological Footer */}
        <footer className="glass-panel border-t border-white/5 py-4 px-6 text-center text-xs text-slate-400 font-mono">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              JAL-RAKSHAK Smart Water Quality Platform • Powered by ESP32 IoT Node 01
            </span>
            <span className="text-slate-400 text-[11px] italic">
              Indicative environmental observation & early anomaly warning • Not certified lab testing
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
