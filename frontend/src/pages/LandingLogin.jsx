import React, { useState } from 'react';
import { Droplets, ShieldCheck, ArrowRight, ArrowLeft, Activity, Sparkles, Key, Mail, Cpu } from 'lucide-react';
import WaterCanvasBackground from '../components/three/WaterCanvasBackground';

export default function LandingLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('officer@jal-rakshak.org');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 400);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-[#030712]/50">
      {/* 3D Interactive Water Background */}
      <WaterCanvasBackground opacity={0.9} interactive={true} />

      {/* Main Glassmorphism Presentation Container */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-aqua-primary via-cyan-500 to-aqua-seafoam p-[2px] shadow-glow-cyan mb-2">
            <div className="w-full h-full bg-abyss-950 rounded-[14px] flex items-center justify-center">
              <Droplets className="w-8 h-8 text-aqua-primary animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-slate-100 font-mono">
            JAL-RAKSHAK
          </h1>

          <p className="text-sm font-semibold text-aqua-seafoam tracking-widest uppercase">
            Smart Water Quality Monitoring & Early-Warning Platform
          </p>

          <p className="text-xs text-slate-400 font-medium italic">
            "Monitor. Detect. Protect."
          </p>
        </div>

        {/* Glassmorphism Login Card */}
        <div className="w-full glass-panel-deep rounded-3xl p-6 sm:p-8 border border-aqua-primary/25 shadow-2xl space-y-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-aqua-primary" />
              TELEMETRY PORTAL
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              SYSTEM ONLINE
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Authorized Officer Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-abyss-950/70 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-aqua-primary/60 focus:ring-1 focus:ring-aqua-primary/50 transition-all font-mono"
                  placeholder="name@domain.gov.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Security Passcode
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-abyss-950/70 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-aqua-primary/60 focus:ring-1 focus:ring-aqua-primary/50 transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-aqua-deep via-aqua-primary to-aqua-seafoam text-abyss-950 font-bold font-mono text-sm tracking-wider uppercase shadow-glow-cyan hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Entering Command Center...' : 'Enter Live Telemetry Center'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="p-3 bg-abyss-950/80 rounded-xl border border-white/5 text-[11px] text-slate-400 leading-relaxed text-center font-mono">
            <span className="text-aqua-seafoam font-semibold">Live Hardware Mode Active:</span> Listening for ESP32 microcontroller transmissions on port 5000.
          </div>
        </div>

        {/* Back to Landing */}
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 flex items-center gap-2 mx-auto text-sm text-slate-400 hover:text-aqua-primary transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Jal Rakshak
          </button>
        )}

        {/* Bottom Tagline */}
        <div className="mt-4 text-center text-xs font-mono text-slate-400 space-y-1">
          <p className="text-slate-300 font-semibold tracking-wider">
            Powered by ESP32 • IoT • Real-Time Water Intelligence
          </p>
          <p className="text-[11px] text-slate-400">
            Node-to-Cloud Telemetry Engine • Low Latency Edge Ingestion
          </p>
        </div>
      </div>
    </div>
  );
}
