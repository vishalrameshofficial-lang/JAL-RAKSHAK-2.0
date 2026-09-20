import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Droplets, Shield, Activity, Zap, Radio, Cpu, Gauge,
  Waves, ThermometerSun, FlaskConical, Radar, Wifi,
  Satellite, BatteryCharging, ArrowRight, CheckCircle2,
  Globe2, Factory, Building2, Landmark, Server, Lock,
  ChevronRight, ExternalLink, Mail, Phone, MapPin,
  Github, Twitter, Linkedin, Menu, X, Eye, AlertTriangle,
  TrendingUp, Layers, Pipette, Beaker, Database, Cloud,
  Siren, CircuitBoard, ShieldAlert
} from 'lucide-react';
import WaterBackground3D from '../components/landing/WaterBackground3D';

/* ─── Utility ─── */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/* ─── Oscilloscopic Soundwave SVG ─── */
function AcousticOscilloscope({ data, height = 52 }) {
  const w = 280;
  if (!data || data.length < 2) return null;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - minVal) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} className="w-full">
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,${height} ${pts.join(' ')} ${w},${height}`}
        fill="#00f0ff"
        opacity="0.08"
      />
    </svg>
  );
}

/* ─── Section Container ─── */
function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative z-10 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

/* ─── Section Heading ─── */
function SectionHeading({ overline, title, subtitle }) {
  return (
    <div className="text-center mb-14 space-y-3">
      <p className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-[0.25em]">{overline}</p>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f8fafc] leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-[#94a3b8] max-w-3xl mx-auto leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN JAL RAKSHAK SAAS LANDING COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function SaaSLanding({ onEnterDashboard }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [pilotSubmitted, setPilotSubmitted] = useState(false);

  /* ─── 1. Live Sensor Telemetry (4 Cards, 2.5s jitter) ─── */
  const [sensors, setSensors] = useState({
    acidity: 7.28,
    turbidity: 0.38,
    velocity: 412.8,
    pressure: 4.2,
  });

  const [acousticWave, setAcousticWave] = useState(
    Array.from({ length: 48 }, (_, i) => Math.sin(i * 0.4) * 25 + 50 + Math.random() * 8)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) => ({
        acidity: +(clamp(prev.acidity + (Math.random() - 0.5) * 0.04, 7.15, 7.42)).toFixed(2),
        turbidity: +(clamp(prev.turbidity + (Math.random() - 0.5) * 0.03, 0.28, 0.46)).toFixed(2),
        velocity: +(clamp(prev.velocity + (Math.random() - 0.5) * 6.5, 398.0, 428.5)).toFixed(1),
        pressure: +(clamp(prev.pressure + (Math.random() - 0.5) * 0.08, 4.05, 4.35)).toFixed(1),
      }));

      setAcousticWave((prev) => {
        const t = Date.now() * 0.003;
        return prev.map((_, i) =>
          Math.sin(i * 0.45 + t) * 24 + Math.cos(i * 0.85 + t * 1.5) * 12 + 50 + (Math.random() - 0.5) * 6
        );
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  /* ─── 2. Jal Shuddhi Diagnostic Lab Sliders & Potability ─── */
  const [labTds, setLabTds] = useState(240); // 50 to 1000 ppm
  const [labDo, setLabDo] = useState(8.4);   // 2 to 12 mg/L
  const [labChlorine, setLabChlorine] = useState(0.65); // 0.1 to 3.0 mg/L

  const potabilityScore = useMemo(() => {
    let score = 100;
    // TDS penalty: optimal is 100-300 ppm. Over 500 is poor.
    if (labTds > 500) score -= ((labTds - 500) / 500) * 45;
    else if (labTds > 300) score -= ((labTds - 300) / 200) * 15;
    else if (labTds < 80) score -= (80 - labTds) * 0.2;

    // Dissolved Oxygen: optimal is > 6.5 mg/L. < 4 is critical.
    if (labDo < 5) score -= (5 - labDo) * 12;
    else if (labDo < 6.5) score -= (6.5 - labDo) * 5;

    // Chlorine: optimal is 0.2 to 1.2 mg/L. > 2.0 or < 0.15 drops score.
    if (labChlorine < 0.2) score -= (0.2 - labChlorine) * 70;
    else if (labChlorine > 1.5) score -= (labChlorine - 1.5) * 30;

    return Math.max(0, Math.min(100, Math.round(score)));
  }, [labTds, labDo, labChlorine]);

  const isCriticalTrip = potabilityScore < 70;
  const isOptimalSafe = potabilityScore > 85;

  /* ─── 3. Sector Telemetry Tabs ─── */
  const [activeTab, setActiveTab] = useState(0);
  const sectorTabs = [
    {
      id: 'municipal',
      title: 'Municipal Networks',
      icon: Building2,
      subtitle: 'Urban Pipeline Leak Interception & NRW Reduction',
      protocols: ['4G/NB-IoT Uplink', 'Modbus RS-485', 'MQTT TLS 1.3', 'Acoustic Sounders'],
      diagramTitle: 'City Distro Pressure District (DMA Architecture)',
      diagramNodes: [
        { label: 'Intake Waterworks', status: 'Optimal (7.2 pH)', color: '#10b981' },
        { label: 'Trunk Main A-4', status: 'Acoustic Cavitation Free', color: '#00f0ff' },
        { label: 'DMA Zone 12 Sub-Station', status: 'Pressure: 4.2 BAR', color: '#0284c7' },
        { label: 'Consumer Tap Array', status: 'Residual Cl: 0.6 mg/L', color: '#10b981' },
      ],
      benefits: [
        'Non-Revenue Water (NRW) losses cut by up to 34% via acoustic pinpointing',
        'Automated pressure reduction valves prevent midnight pipe bursts',
        'Sub-second GIS pinpointing of main rupture anomalies (<120ms edge detection)',
        'Full SCADA integration into municipal command and control centers (ICCC)',
      ],
    },
    {
      id: 'gramin',
      title: 'Jal Jeevan / Rural Grids',
      icon: Globe2,
      subtitle: 'Solar Telemetry for Village Borewells & Community Tanks',
      protocols: ['LoRaWAN Mesh (868/865 MHz)', 'Solar MPPT RTU', 'SMS Alerts', 'Satellite Uplink'],
      diagramTitle: 'Panchayat Overhead Tank & Borewell Cluster',
      diagramNodes: [
        { label: 'Solar Deep Borewell', status: 'Static Head: 64m', color: '#00f0ff' },
        { label: 'Chlorination Feeder', status: 'Dosing: Active', color: '#10b981' },
        { label: 'Gram Panchayat ESR Tank', status: 'Level: 88% Full', color: '#0284c7' },
        { label: 'Community Standposts', status: 'Potability Certified', color: '#10b981' },
      ],
      benefits: [
        'Tamper-proof IP67 solar RTU nodes with 72-hour battery autonomy',
        'Zero-dependency LoRaWAN backhaul for remote non-cellular valleys',
        'Real-time automated SMS dispatched to village water sanitation committees',
        'Strict conformance to JJM (Jal Jeevan Mission) digital reporting standards',
      ],
    },
    {
      id: 'industrial',
      title: 'Industrial Effluent / ZLD',
      icon: Factory,
      subtitle: 'Zero Liquid Discharge (ZLD) & Heavy Metal Interception',
      protocols: ['Modbus TCP', 'OPC UA', 'CPCB Cloud Connect', 'Optical Turbidity'],
      diagramTitle: 'Effluent Treatment Plant (ETP) Continuous Monitoring',
      diagramNodes: [
        { label: 'Primary Clarifier', status: 'Influent COD: 420 ppm', color: '#0284c7' },
        { label: 'RO Polishing Stage', status: 'Membrane Flux: Normal', color: '#00f0ff' },
        { label: 'ZLD Evaporator Loop', status: 'Condensate Recycled', color: '#10b981' },
        { label: 'State PCB Auto-Upload', status: 'Encrypted Heartbeat', color: '#10b981' },
      ],
      benefits: [
        'Continuous automated online upload to State Pollution Control Board servers',
        'Instant valve cutoff upon detecting toxic heavy metal surges or low pH spikes',
        'Zero Liquid Discharge volumetric balance validation with 99.4% precision',
        'Reduces regulatory audit penalties through tamper-proof immutable audit logs',
      ],
    },
    {
      id: 'canals',
      title: 'Canals & Reservoirs',
      icon: Landmark,
      subtitle: 'Inflow / Outflow Ultrasound Level & Spillway Velocity Analytics',
      protocols: ['Ultrasonic Radar', 'Doppler Flow Profiler', 'IR Satellite', 'Cellular LTE-M'],
      diagramTitle: 'Reservoir Catchment & Barrage Telemetry Grid',
      diagramNodes: [
        { label: 'Upstream Basin Sensor', status: 'Discharge: 1,840 m³/s', color: '#00f0ff' },
        { label: 'Spillway Gate Actuator', status: 'Gate 3: Open 1.2m', color: '#0284c7' },
        { label: 'Canal Head Regulator', status: 'Velocity: 1.4 m/s', color: '#10b981' },
        { label: 'Tail-End Sluice Sensor', status: 'Equitable Head Verified', color: '#10b981' },
      ],
      benefits: [
        'Non-contact FMCW radar sensors measure water levels with ±2mm accuracy',
        'Predictive flood inundation modeling driven by catchment rainfall telemetry',
        'Equitable tail-end canal distribution monitoring for agricultural fairness',
        'Siltation and bathymetric capacity tracking across seasonal monsoon transitions',
      ],
    },
  ];

  /* ─── 4. Pricing / Deployment State ─── */
  const [isAnnual, setIsAnnual] = useState(true); // Default Annual (Save 20%)

  const pricingPlans = [
    {
      name: 'Gramin Pilot Grid',
      badge: 'Rural Panchayats & Clusters',
      priceMonthly: '₹2,499',
      priceAnnual: '₹1,999',
      unit: '/node/mo',
      desc: 'Engineered for village water schemes, localized overhead storage reservoirs, and remote agricultural borewells.',
      features: [
        'Up to 15 Solar-Backed RTU Nodes',
        'LoRaWAN & 2G/4G Fallback Connectivity',
        'Borewell Level & Flow Telemetry',
        'Automated Chlorination & TDS Tracking',
        'Weekly Panchayat WhatsApp & SMS Briefs',
        'Jal Jeevan Mission Standard Schema Support',
      ],
      cta: 'Deploy Gramin Grid',
      highlight: false,
    },
    {
      name: 'Urban Utility Grid',
      badge: 'Most Deployed',
      priceMonthly: '₹11,900',
      priceAnnual: '₹9,500',
      unit: '/zone/mo',
      desc: 'Full-scale distribution surveillance for municipal corporations, smart cities, and district water supply boards.',
      features: [
        'Up to 120 Multi-Sensor Telemetry Nodes',
        'Acoustic Ultrasound Pipeline Leak Detection',
        'Live GIS Hydraulic Pressure Mapping',
        'Non-Revenue Water (NRW) Anomaly Engine',
        'Sub-120ms Edge Actuator Trip Logic',
        'SCADA / REST API / OPC-UA Integration',
        'Dedicated 24/7 Grid Support Engineer',
      ],
      cta: 'Request Utility Pilot',
      highlight: true,
    },
    {
      name: 'Sovereign SCADA',
      badge: 'State-Wide & Strategic',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      unit: 'enterprise tier',
      desc: 'Dedicated hydrological defense infrastructure for state water boards, river basins, and national telemetry grids.',
      features: [
        'Unlimited Nodes & Basin-Wide Deployment',
        'Satellite Backhaul & Private APN Mesh',
        'Multi-Tenant Government Command Portal',
        'Hydrodynamic AI Burst & Contaminant Prediction',
        'On-Premise Sovereign Cloud Deployment Option',
        'BIS 10500 & CPCB Automated Regulatory Audits',
        'Custom Hardware Enclosure & Sensor Bus',
      ],
      cta: 'Consult Solutions Architect',
      highlight: false,
    },
  ];

  /* ─── Smooth Navigation ─── */
  const scrollTo = useCallback((id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const navLinks = [
    { label: 'Surveillance Grid', target: 'surveillance-grid' },
    { label: 'Live Telemetry', target: 'telemetry-grid' },
    { label: 'Diagnostic Lab', target: 'diagnostic-lab' },
    { label: 'Network Specs', target: 'network-specs' },
    { label: 'Deployment', target: 'pricing' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#030712] text-[#f8fafc] font-sans relative overflow-x-hidden selection:bg-[#00f0ff]/30 selection:text-[#00f0ff]">
      {/* Three.js Background Canvas */}
      <WaterBackground3D />

      {/* ═══════════════════════════════════════════════
          1. NAVIGATION BAR (Sticky Glassmorphic)
          ═══════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-landing-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Brand Logo & Badges */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollTo('hero')}
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#0284c7] flex items-center justify-center shadow-lg shadow-[#00f0ff]/20 group-hover:shadow-[#00f0ff]/40 transition-all duration-300">
              <Droplets className="w-5 h-5 text-[#030712]" />
              <span className="animate-ping absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">
                  Jal Rakshak
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                  AI TELEMETRY
                </span>
              </div>
              <span className="block text-[9px] font-mono text-[#00f0ff]/60 tracking-widest -mt-0.5">
                जल रक्षक • SMART HYDROLOGY
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-1 bg-[#0b192c]/50 p-1.5 rounded-full border border-white/[0.06] backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-[#94a3b8] hover:text-[#00f0ff] hover:bg-white/[0.04] transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Status Pill & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
              </span>
              <span className="text-[11px] font-mono font-bold text-[#10b981] tracking-wide">
                Grid Health: 99.98% Normal
              </span>
            </div>

            {/* Launch Dashboard Button */}
            <button
              onClick={onEnterDashboard}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/15 text-xs font-semibold text-[#f8fafc] hover:border-[#00f0ff]/40 hover:bg-white/[0.05] transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
              Live Console
            </button>

            {/* CTA Button */}
            <button
              onClick={() => setPilotModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0284c7] text-[#030712] text-xs font-extrabold shadow-lg shadow-[#00f0ff]/25 hover:shadow-[#00f0ff]/45 hover:scale-[1.03] transition-all duration-200"
            >
              Request Pilot
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-[#94a3b8] hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-landing border-t border-white/[0.06] px-4 py-4 space-y-1.5">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-[#94a3b8] hover:text-[#00f0ff] hover:bg-white/[0.04] rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-2">
              <button
                onClick={onEnterDashboard}
                className="w-full py-2.5 rounded-xl border border-[#00f0ff]/30 text-xs font-bold text-[#00f0ff] text-center"
              >
                Open Live Monitoring Console
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════
          2. HERO SECTION
          ═══════════════════════════════════════════════ */}
      <section id="hero" className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Chip */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono font-bold text-[#00f0ff] tracking-wider">
                <Radar className="w-3.5 h-3.5 animate-spin text-[#00f0ff]" style={{ animationDuration: '4s' }} />
                National Hydrological Telemetry & Contaminant Defense
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-extrabold leading-[1.08] tracking-tight">
                <span className="text-[#f8fafc]">Autonomous Water </span>
                <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#10b981] bg-clip-text text-transparent">
                  Guarding
                </span>
                <br />
                <span className="text-[#f8fafc]">& Quality Telemetry </span>
                <span className="bg-gradient-to-r from-[#10b981] to-[#00f0ff] bg-clip-text text-transparent">
                  at National Scale
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl leading-relaxed">
                Jal Rakshak pairs edge IoT sensors with hydrodynamic AI models — detecting contaminants,
                pinpointing subsurface leaks, and securing clean water distribution in real time.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onEnterDashboard}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0284c7] text-[#030712] text-sm font-extrabold shadow-xl shadow-[#00f0ff]/25 hover:shadow-[#00f0ff]/40 hover:scale-[1.03] transition-all duration-200"
                >
                  <Activity className="w-4 h-4" />
                  Launch Live Console
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollTo('telemetry-grid')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl glass-landing border border-white/15 text-sm font-bold text-[#f8fafc] hover:bg-white/[0.06] hover:border-[#00f0ff]/40 transition-all duration-200"
                >
                  <Gauge className="w-4 h-4 text-[#00f0ff]" />
                  Inspect Telemetry Grid
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-[#94a3b8]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> 99.98% Uptime SLA
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#00f0ff]" /> ISO 27001 Certified
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0284c7]" /> BIS 10500 Compliant
                </span>
              </div>
            </div>

            {/* Right Column: Floating Oscilloscopic Monitor Card */}
            <div className="lg:col-span-5">
              <div className="glass-landing rounded-3xl p-6 sm:p-7 border border-[#00f0ff]/20 glow-cyan relative overflow-hidden landing-float">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff]">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Acoustic Pipeline Cavitation Monitor
                      </h4>
                      <p className="text-[10px] font-mono text-[#94a3b8]">Transducer Node #RTU-4089 • 24.8 kHz</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-[10px] font-mono font-bold">
                    NOMINAL
                  </span>
                </div>

                {/* Live Oscilloscopic Waveform */}
                <div className="bg-[#030712]/70 rounded-2xl p-4 border border-white/[0.05] mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8] mb-2">
                    <span>ULTRASOUND FREQUENCY RESPONSE</span>
                    <span className="text-[#00f0ff] animate-pulse">● LIVE 60 FPS</span>
                  </div>
                  <AcousticOscilloscope data={acousticWave} height={56} />
                </div>

                {/* Sub-Metrics Inside Card */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="block text-[9px] font-mono text-[#94a3b8]">LEAK PROBABILITY</span>
                    <span className="text-sm font-mono font-bold text-[#10b981]">0.04%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="block text-[9px] font-mono text-[#94a3b8]">WALL STRESS</span>
                    <span className="text-sm font-mono font-bold text-[#00f0ff]">28.4 MPa</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="block text-[9px] font-mono text-[#94a3b8]">LINE HEAD</span>
                    <span className="text-sm font-mono font-bold text-[#f8fafc]">42.8 m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. LIVE SENSOR TELEMETRY DASHBOARD (4-Card Grid)
          ═══════════════════════════════════════════════ */}
      <Section id="telemetry-grid" className="py-16 sm:py-24">
        <SectionHeading
          overline="Real-Time Hydrological Stream"
          title="Live Sensor Telemetry Grid"
          subtitle="Continuous high-frequency IoT sensor measurements updating every 2.5 seconds with live hydrodynamic variance."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Water Acidity */}
          <div className="glass-landing rounded-2xl p-6 border border-[#10b981]/20 hover:border-[#10b981]/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#10b981]/10 text-[#10b981] group-hover:bg-[#10b981]/20 transition-colors">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                Balanced Potable
              </span>
            </div>
            <p className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1">Water Acidity</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[#f8fafc] font-mono tracking-tight">
                {sensors.acidity.toFixed(2)}
              </span>
              <span className="text-sm font-mono text-[#94a3b8]">pH</span>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
              <span>BIS 10500 Standard</span>
              <span className="text-[#10b981]">6.5 – 8.5 Safe</span>
            </div>
          </div>

          {/* Card 2: Turbidity */}
          <div className="glass-landing rounded-2xl p-6 border border-[#00f0ff]/20 hover:border-[#00f0ff]/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] group-hover:bg-[#00f0ff]/20 transition-colors">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30">
                Ultra Clear
              </span>
            </div>
            <p className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1">Turbidity Index</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[#f8fafc] font-mono tracking-tight">
                {sensors.turbidity.toFixed(2)}
              </span>
              <span className="text-sm font-mono text-[#94a3b8]">NTU</span>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
              <span>Optical Nephelometry</span>
              <span className="text-[#00f0ff]">&lt; 1.0 Optimal</span>
            </div>
          </div>

          {/* Card 3: Line Velocity */}
          <div className="glass-landing rounded-2xl p-6 border border-[#0284c7]/25 hover:border-[#0284c7]/45 transition-all duration-300 group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#0284c7]/10 text-[#0284c7] group-hover:bg-[#0284c7]/20 transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0284c7]/15 text-[#0284c7] border border-[#0284c7]/30">
                Nominal Flow
              </span>
            </div>
            <p className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1">Line Velocity</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[#f8fafc] font-mono tracking-tight">
                {sensors.velocity.toFixed(1)}
              </span>
              <span className="text-sm font-mono text-[#94a3b8]">L/min</span>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
              <span>Electromagnetic Flow</span>
              <span className="text-[#0284c7]">±0.5% Accuracy</span>
            </div>
          </div>

          {/* Card 4: Hydraulic Pressure */}
          <div className="glass-landing rounded-2xl p-6 border border-[#10b981]/20 hover:border-[#10b981]/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#10b981]/10 text-[#10b981] group-hover:bg-[#10b981]/20 transition-colors">
                <Gauge className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                Surge Protected
              </span>
            </div>
            <p className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1">Hydraulic Pressure</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[#f8fafc] font-mono tracking-tight">
                {sensors.pressure.toFixed(1)}
              </span>
              <span className="text-sm font-mono text-[#94a3b8]">BAR</span>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
              <span>Piezoresistive Sensor</span>
              <span className="text-[#10b981]">Dynamic Damping</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          4. INTERACTIVE "JAL SHUDDHI" DIAGNOSTIC LAB
          ═══════════════════════════════════════════════ */}
      <Section id="diagnostic-lab" className="py-16 sm:py-24">
        <SectionHeading
          overline="Algorithmic Potability Engine"
          title="Jal Shuddhi Diagnostic Lab"
          subtitle="Adjust real-time water quality parameters to observe how the AI classification engine assesses potability and triggers automated shutoff trips."
        />

        <div className="max-w-4xl mx-auto">
          <div
            className={`glass-landing rounded-3xl p-6 sm:p-10 border transition-all duration-500 relative ${
              isCriticalTrip
                ? 'border-[#f43f5e] glow-rose'
                : 'border-[#00f0ff]/20 glow-cyan'
            }`}
          >
            {/* Top Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Pipette className="w-5 h-5 text-[#00f0ff]" />
                  Real-Time Water Sample Analyzer
                </h3>
                <p className="text-xs font-mono text-[#94a3b8] mt-0.5">
                  Dynamic multi-parameter health calculation based on Indian Standard IS 10500:2012
                </p>
              </div>

              {/* Potability Badge */}
              <div>
                {isOptimalSafe ? (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Potable: Direct Community Supply Approved
                  </span>
                ) : isCriticalTrip ? (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/40 text-xs font-mono font-bold animate-pulse">
                    <ShieldAlert className="w-4 h-4" />
                    Contamination Detected: Automated Divert Valve Tripped
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    Sub-Optimal: Secondary Coagulation Advised
                  </span>
                )}
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid md:grid-cols-12 gap-8 items-center py-8">
              {/* Sliders (7 cols) */}
              <div className="md:col-span-7 space-y-6">
                {/* 1. TDS Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#f8fafc] font-semibold flex items-center gap-1.5">
                      Total Dissolved Solids (TDS)
                    </span>
                    <span className="text-[#00f0ff] font-bold">{labTds} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="10"
                    value={labTds}
                    onChange={(e) => setLabTds(Number(e.target.value))}
                    className="w-full h-2 bg-[#0b192c] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
                    <span>50 ppm (Rain/RO)</span>
                    <span className="text-[#10b981]">150–300 (Ideal)</span>
                    <span>1000 ppm (Unacceptable)</span>
                  </div>
                </div>

                {/* 2. Dissolved Oxygen Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#f8fafc] font-semibold flex items-center gap-1.5">
                      Dissolved Oxygen (DO)
                    </span>
                    <span className="text-[#00f0ff] font-bold">{labDo.toFixed(1)} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="12.0"
                    step="0.2"
                    value={labDo}
                    onChange={(e) => setLabDo(Number(e.target.value))}
                    className="w-full h-2 bg-[#0b192c] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
                    <span>2.0 mg/L (Stagnant/Anoxic)</span>
                    <span className="text-[#10b981]">&gt; 6.5 mg/L (Healthy River)</span>
                    <span>12.0 mg/L</span>
                  </div>
                </div>

                {/* 3. Residual Chlorine Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#f8fafc] font-semibold flex items-center gap-1.5">
                      Residual Free Chlorine
                    </span>
                    <span className="text-[#00f0ff] font-bold">{labChlorine.toFixed(2)} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    value={labChlorine}
                    onChange={(e) => setLabChlorine(Number(e.target.value))}
                    className="w-full h-2 bg-[#0b192c] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
                    <span>0.1 mg/L (Low Disinfection)</span>
                    <span className="text-[#10b981]">0.2–1.0 (Safe Residual)</span>
                    <span>3.0 mg/L (Chloramine Excess)</span>
                  </div>
                </div>
              </div>

              {/* Potability Score Gauge (5 cols) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#030712]/60 border border-white/[0.06] text-center">
                <span className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-wider mb-2">
                  Jal Shuddhi Index
                </span>

                <div className="relative w-36 h-36 flex items-center justify-center my-2">
                  {/* Outer Ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="#0b192c"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke={isCriticalTrip ? '#f43f5e' : isOptimalSafe ? '#10b981' : '#00f0ff'}
                      strokeWidth="8"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * potabilityScore) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className={`text-4xl font-extrabold font-mono ${
                      isCriticalTrip ? 'text-[#f43f5e]' : isOptimalSafe ? 'text-[#10b981]' : 'text-[#00f0ff]'
                    }`}>
                      {potabilityScore}%
                    </span>
                    <span className="text-[10px] font-mono text-[#94a3b8]">POTABILITY</span>
                  </div>
                </div>

                <p className="text-xs font-mono text-[#94a3b8] mt-2">
                  {isCriticalTrip
                    ? 'Automated solenoid divert valve engaged to isolate contaminated line.'
                    : 'Water stream meets domestic drinking standards without secondary boiling.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          5. MODULAR SECTOR TELEMETRY (Tabs)
          ═══════════════════════════════════════════════ */}
      <Section id="surveillance-grid" className="py-16 sm:py-24">
        <SectionHeading
          overline="Versatile Hydraulic Footprint"
          title="Modular Sector Telemetry"
          subtitle="Tailored edge sensor nodes and telemetry protocols designed for distinct hydrological environments across the nation."
        />

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {sectorTabs.map((tab, idx) => {
            const Icon = tab.icon;
            const active = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-[#00f0ff] to-[#0284c7] text-[#030712] shadow-lg shadow-[#00f0ff]/20 scale-[1.02]'
                    : 'glass-landing border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#00f0ff]/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="glass-landing rounded-3xl p-6 sm:p-10 border border-[#00f0ff]/15 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Specs & Benefits */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-bold">
                  SECTOR SPECIFICATION
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {sectorTabs[activeTab].title}
                </h3>
                <p className="text-sm text-[#94a3b8] mt-1 font-sans leading-relaxed">
                  {sectorTabs[activeTab].subtitle}
                </p>
              </div>

              {/* Active Protocols Pills */}
              <div>
                <span className="block text-xs font-mono text-slate-400 mb-2 font-semibold">
                  INTEGRATED PROTOCOLS & BUSES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sectorTabs[activeTab].protocols.map((proto) => (
                    <span
                      key={proto}
                      className="px-3 py-1 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono font-semibold"
                    >
                      {proto}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-mono text-slate-400 font-semibold">
                  DEPLOYMENT ADVANTAGES:
                </span>
                {sectorTabs[activeTab].benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[#f8fafc]">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#10b981] shrink-0" />
                    <span className="leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Architecture Diagram Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#030712]/70 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <CircuitBoard className="w-4 h-4 text-[#00f0ff]" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    {sectorTabs[activeTab].diagramTitle}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* Topology Steps */}
              <div className="space-y-3">
                {sectorTabs[activeTab].diagramNodes.map((node, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between hover:border-[#00f0ff]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px] font-mono font-bold text-[#94a3b8]">
                        0{i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">{node.label}</span>
                    </div>
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${node.color}15`,
                        color: node.color,
                        borderColor: `${node.color}30`,
                        borderWidth: '1px',
                      }}
                    >
                      {node.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] font-mono text-[#94a3b8]">
                  Bidirectional TLS 1.3 encrypted mesh to centralized SCADA cluster
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          6. NETWORK SPECS / EDGE SECURITY
          ═══════════════════════════════════════════════ */}
      <Section id="network-specs" className="py-16 sm:py-24">
        <SectionHeading
          overline="Hardened Indigenous Engineering"
          title="Edge Security & Hardware Architecture"
          subtitle="Built to endure monsoonal downpours, extreme desert heat, and remote village operating conditions without mains power."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Wifi,
              title: 'Triple-Band Uplink Failover',
              desc: 'Integrated LoRaWAN, 4G NB-IoT, and satellite backhaul. Auto-switches connections during cellular blackouts with zero dropped frames.',
              stat: '99.98% Telemetry Delivery',
              color: 'text-[#00f0ff]',
            },
            {
              icon: Zap,
              title: 'Sub-120ms Edge AI Trip Logic',
              desc: 'Microcontroller executes onboard hydrodynamic pressure decay and contaminant spike inference without waiting for cloud round-trips.',
              stat: '<120ms Auto-Trip',
              color: 'text-[#10b981]',
            },
            {
              icon: BatteryCharging,
              title: 'Solar RTU Node Autonomy',
              desc: 'IP67 waterproof aluminum enclosure paired with MPPT solar charger and LiFePO4 battery pack providing 72+ hours of autonomous reserve.',
              stat: '72h Continuous Power',
              color: 'text-[#0284c7]',
            },
            {
              icon: Shield,
              title: 'Tamper-Evident Anti-Theft',
              desc: 'Enclosure optical sensors trigger immediate SMS and GPS geo-fence tamper alerts if physical RTU cabinets or sensor wiring are compromised.',
              stat: 'Physical + Crypto Shield',
              color: 'text-[#00f0ff]',
            },
            {
              icon: CircuitBoard,
              title: 'Universal Modbus Sensor Bus',
              desc: 'Modular RS-485 bus supports up to 32 parallel physical probe attachments: optical turbidity, pH, ultrasonic level, DO, and ORP sensors.',
              stat: '32 Probe Expansion',
              color: 'text-[#10b981]',
            },
            {
              icon: Cloud,
              title: 'Sovereign Hybrid Cloud Core',
              desc: 'All data stored in compliance with Indian Data Protection laws. Deployable on MeitY-empaneled sovereign clouds or on-premise SCADA servers.',
              stat: '100% Data Sovereignty',
              color: 'text-[#0284c7]',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-landing rounded-2xl p-6 border border-white/[0.06] hover:border-[#00f0ff]/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] group-hover:bg-[#00f0ff]/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-mono font-bold ${item.color}`}>{item.stat}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed font-sans">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          7. DEPLOYMENT & GRID PRICING
          ═══════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 sm:py-28">
        <SectionHeading
          overline="Deployment & Grid Pricing"
          title="Scale from Single Reservoir to State Grid"
          subtitle="Transparent pricing for rural panchayats, smart municipal zones, and state-wide water security boards."
        />

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={`text-sm font-semibold ${!isAnnual ? 'text-white' : 'text-[#94a3b8]'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isAnnual ? 'bg-[#00f0ff]' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-[#030712] shadow-md transition-transform duration-300 ${
                isAnnual ? 'translate-x-[30px]' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${isAnnual ? 'text-white' : 'text-[#94a3b8]'}`}>
            Annual Billing <span className="text-[#10b981] text-xs font-mono font-bold">(Save 20%)</span>
          </span>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-7 border transition-all duration-300 relative flex flex-col justify-between ${
                plan.highlight
                  ? 'glass-landing border-[#00f0ff]/40 shadow-2xl shadow-[#00f0ff]/15 scale-[1.03]'
                  : 'glass-landing border-white/[0.08] hover:border-[#00f0ff]/25'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#10b981] text-[10px] font-mono font-bold text-[#030712] tracking-wider uppercase">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <span className="text-xs font-mono text-[#00f0ff] font-medium">{plan.badge}</span>
                </div>

                <p className="text-xs text-[#94a3b8] mb-5 leading-relaxed font-sans">
                  {plan.desc}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-white/[0.08]">
                  {plan.priceMonthly === 'Custom' ? (
                    <div className="text-3xl font-extrabold text-white font-mono">Custom Enterprise</div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                        {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                      </span>
                      <span className="text-xs font-mono text-[#94a3b8]">{plan.unit}</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs text-[#f8fafc] font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setPilotModalOpen(true)}
                className={`w-full py-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-[#00f0ff] to-[#0284c7] text-[#030712] shadow-lg shadow-[#00f0ff]/25 hover:shadow-[#00f0ff]/40 hover:scale-[1.02]'
                    : 'border border-white/15 text-[#f8fafc] hover:bg-white/[0.06] hover:border-[#00f0ff]/40'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          8. PROFESSIONAL FOOTER
          ═══════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.08] mt-12 bg-[#030712]/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Manifesto */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#10b981] flex items-center justify-center shadow-md shadow-[#00f0ff]/20">
                  <Droplets className="w-5 h-5 text-[#030712]" />
                </div>
                <div>
                  <span className="text-lg font-extrabold text-white tracking-wider">Jal Rakshak</span>
                  <span className="block text-[9px] font-mono text-[#00f0ff]/70 tracking-widest">जल रक्षक</span>
                </div>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed font-sans max-w-xs">
                Guarding India's water — from source to tap — through indigenous IoT intelligence,
                predictive analytics, and community-first engineering.
              </p>
              <div className="flex gap-2.5 pt-1">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2 rounded-lg bg-white/[0.04] text-[#94a3b8] hover:text-[#00f0ff] hover:bg-white/[0.08] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-mono font-bold text-white tracking-wider mb-4">
                PLATFORM MODULES
              </h4>
              <ul className="space-y-2.5 text-xs text-[#94a3b8]">
                {['Live Monitoring Dashboard', 'Sensor Telemetry Grid', 'Jal Shuddhi Lab', 'Edge RTU Nodes', 'SCADA Integration'].map((link) => (
                  <li key={link}>
                    <button
                      onClick={onEnterDashboard}
                      className="hover:text-[#00f0ff] transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Docs */}
            <div>
              <h4 className="text-xs font-mono font-bold text-white tracking-wider mb-4">
                DEVELOPER & API
              </h4>
              <ul className="space-y-2.5 text-xs text-[#94a3b8]">
                {['REST API Documentation', 'ESP32 Firmware Guide', 'MQTT Payload Schema', 'Modbus RTU Register Map', 'Whitepaper: Hydraulic AI'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-[#00f0ff] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance & Contact */}
            <div>
              <h4 className="text-xs font-mono font-bold text-white tracking-wider mb-4">
                COMPLIANCE & CERTS
              </h4>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  'BIS 10500 Compliant',
                  'ISO 27001 Certified',
                  'CPCB Online Monitoring',
                  'IS 3025 Protocol',
                ].map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="space-y-2 text-xs text-[#94a3b8]">
                <a href="mailto:pilot@jalrakshak.in" className="flex items-center gap-2 hover:text-[#00f0ff] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#00f0ff]" /> pilot@jalrakshak.in
                </a>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Grid Telemetry SLA: 99.98% Uptime
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#94a3b8]">
            <span>© 2026 Jal Rakshak (जल रक्षक) Telemetry Systems. All rights reserved.</span>
            <span className="text-[#00f0ff]/80">
              🇮🇳 Engineered for Indian Water Security • "Monitor. Detect. Protect."
            </span>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════
          PILOT REQUEST MODAL DIALOG
          ═══════════════════════════════════════════════ */}
      {pilotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-landing rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#00f0ff]/30 glow-cyan-lg relative">
            <button
              onClick={() => {
                setPilotModalOpen(false);
                setPilotSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!pilotSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPilotSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 text-[10px] font-mono font-bold mb-2">
                    DEPLOYMENT ACCELERATOR
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Request Jal Rakshak Pilot Grid
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-1 font-sans">
                    Specify your municipal zone, rural district, or industrial facility.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Organization / Agency Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune Municipal Corporation / JJM District Office"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="engineer@utility.gov.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Deployment Type
                    </label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-sm text-white focus:outline-none focus:border-[#00f0ff]">
                      <option>Urban Utility Grid (Municipal / Smart City)</option>
                      <option>Gramin / Jal Jeevan Rural Grid</option>
                      <option>Industrial Effluent / ZLD Continuous Monitoring</option>
                      <option>Canal & Reservoir Inflow/Outflow</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0284c7] text-[#030712] text-xs font-extrabold shadow-lg shadow-[#00f0ff]/25 hover:shadow-[#00f0ff]/40 transition-all"
                  >
                    Submit Deployment Request
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPilotModalOpen(false);
                      onEnterDashboard();
                    }}
                    className="px-4 py-3 rounded-xl border border-white/15 text-xs font-bold text-white hover:bg-white/[0.05]"
                  >
                    Access Telemetry Portal
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center mx-auto text-[#10b981]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Pilot Request Received</h4>
                <p className="text-xs text-[#94a3b8] font-sans max-w-sm mx-auto leading-relaxed">
                  Our telemetry solutions engineers will provide you with test RTU hardware credentials within 2 business hours.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setPilotModalOpen(false);
                      setPilotSubmitted(false);
                      onEnterDashboard();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#00f0ff] text-[#030712] text-xs font-extrabold shadow-lg shadow-[#00f0ff]/30"
                  >
                    Open Operational Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
