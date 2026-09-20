import React from 'react';
import {
  Droplets,
  Activity,
  ShieldCheck,
  Info,
  Layers,
  Thermometer,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

export default function WaterQuality() {
  const { telemetry, deltas } = useWater();

  const parameters = [
    {
      id: 'ph',
      title: 'Potential of Hydrogen (pH)',
      current: `${telemetry.ph.toFixed(2)} pH`,
      normalRange: '6.50 - 8.50 pH',
      status: telemetry.ph >= 6.5 && telemetry.ph <= 8.5 ? 'NOMINAL' : 'ANOMALOUS',
      statusColor: telemetry.ph >= 6.5 && telemetry.ph <= 8.5 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Activity,
      iconColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      sensorHealth: '98% (Calibrated)',
      probeDetails: 'Analog Combined Glass Electrode E-201-C with BNC interface',
      scientificSignificance: 'pH is a logarithmic measure of hydrogen ion activity. While neutral water centers at pH 7.0, aquatic baseline shifts indicate organic degradation, industrial runoffs, or catchment buffering changes.',
      recommendation: 'Continuous trend observation. Abnormal deviations warrant rapid chemical titration verification.'
    },
    {
      id: 'turbidity',
      title: 'Optical Turbidity (TS-300B)',
      current: `${telemetry.turbidity.toFixed(2)} NTU`,
      normalRange: '0.50 - 4.00 NTU',
      status: telemetry.turbidity <= 4.0 ? 'NOMINAL' : 'ANOMALOUS',
      statusColor: telemetry.turbidity <= 4.0 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Eye,
      iconColor: 'text-aqua-primary bg-aqua-primary/10 border-aqua-primary/30',
      sensorHealth: '95% (Clean Optical Lens)',
      probeDetails: 'Transmittance / 90° Light Scattering Photodiode Module',
      scientificSignificance: 'Turbidity measures light attenuation caused by suspended particles, colloids, silt, and algae. Rapid spikes signify flash runoff, erosion, or biological bloom events.',
      recommendation: 'If turbidity persists above 4.0 NTU, inspect inflow silt barriers and conduct laboratory microbiological assay.'
    },
    {
      id: 'tds',
      title: 'Total Dissolved Solids (TDS)',
      current: `${telemetry.tds} ppm`,
      normalRange: '150 - 300 ppm',
      status: telemetry.tds <= 300 ? 'NOMINAL' : 'ANOMALOUS',
      statusColor: telemetry.tds <= 300 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Droplets,
      iconColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      sensorHealth: '99% (Low Polarization)',
      probeDetails: 'AC Excitation Conductivity Electrode Probe',
      scientificSignificance: 'TDS reflects mobile charged ions (calcium, magnesium, chloride, sulfate, carbonates). High levels increase electrical conductivity and can impact aquatic osmotic equilibrium.',
      recommendation: 'Evaluate salinity gradient and upstream mineral runoff. Cross-validate with laboratory gravimetric analysis.'
    },
    {
      id: 'temperature',
      title: 'Water Temperature (DS18B20)',
      current: `${telemetry.temperature.toFixed(1)} °C`,
      normalRange: '18.0 - 30.0 °C',
      status: telemetry.temperature >= 18 && telemetry.temperature <= 30 ? 'NOMINAL' : 'ANOMALOUS',
      statusColor: telemetry.temperature >= 18 && telemetry.temperature <= 30 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Thermometer,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      sensorHealth: '100% (Digital OneWire)',
      probeDetails: 'DS18B20 Stainless Steel Waterproof Encapsulation',
      scientificSignificance: 'Water temperature regulates biochemical reactions and gas saturation. Higher thermal states depress dissolved oxygen capacity and accelerate microbiological proliferation.',
      recommendation: 'Monitor ambient thermal correlation. Check sensor immersion depth away from direct metal sun reflections.'
    },
    {
      id: 'waterLevel',
      title: 'Reservoir Head / Column Level',
      current: `${telemetry.waterLevel} %`,
      normalRange: '50 - 90 %',
      status: telemetry.waterLevel >= 50 && telemetry.waterLevel <= 90 ? 'NOMINAL' : 'ANOMALOUS',
      statusColor: telemetry.waterLevel >= 50 && telemetry.waterLevel <= 90 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Layers,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      sensorHealth: '97% (Acoustic Echo Clear)',
      probeDetails: 'Ultrasonic Distance Transceiver / Hydrostatic Gauge',
      scientificSignificance: 'Column level monitoring establishes hydraulic residence time, dilution capacity, and drought/flood exposure risk in the monitored catchment.',
      recommendation: 'Cross-check inlet flow control valves and inspect silt buildup at the sensor datum.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Scientific Disclaimer */}
      <div className="glass-panel rounded-3xl p-6 border border-aqua-primary/20 shadow-glass-card space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-aqua-seafoam tracking-widest uppercase">
                SCIENTIFIC TELEMETRY SUITE
              </span>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                5 Indicator Indices
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans mt-1">
              Water Quality Analysis
            </h1>
            <p className="text-sm text-slate-300 font-normal">
              Continuous parameter baseline profiling, physical probe calibration, and anomaly diagnostics.
            </p>
          </div>

          <div className="p-3 bg-abyss-950/80 border border-white/10 rounded-2xl flex items-center gap-3 text-xs text-slate-300 font-mono">
            <FileCheck className="w-5 h-5 text-aqua-primary shrink-0" />
            <span>Indicative continuous monitoring baseline verified</span>
          </div>
        </div>

        {/* Scientific Accuracy Disclaimer Alert Banner */}
        <div className="p-3.5 bg-sky-950/40 border border-sky-500/30 rounded-2xl flex items-start gap-3 text-xs text-slate-300 leading-relaxed font-mono">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sky-300">Scientific Communication Framework:</strong> Sensor readings (pH, TDS, turbidity, temperature, water level) are electronic water-quality indicators used for continuous monitoring and early anomaly detection. They do not directly detect trace pathogens or specific toxic chemicals without dedicated assay probes, and do not constitute certified laboratory drinking-water validation.
          </div>
        </div>
      </div>

      {/* 5 Parameter Deep Dive Panels */}
      <div className="space-y-4">
        {parameters.map((param) => {
          const Icon = param.icon;
          return (
            <div
              key={param.id}
              className="glass-panel rounded-2xl p-5 sm:p-6 border border-aqua-primary/15 shadow-glass-card space-y-4 hover:border-aqua-primary/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${param.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-sans">
                      {param.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Probe: {param.probeDetails}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Current Reading</div>
                    <div className="text-xl font-bold text-slate-100">{param.current}</div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${param.statusColor}`}>
                    ● {param.status}
                  </span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-abyss-950/60 rounded-xl border border-white/5 space-y-1">
                  <span className="text-slate-400">Reference / Nominal Range:</span>
                  <p className="text-slate-200 font-bold text-sm">{param.normalRange}</p>
                </div>
                <div className="p-3 bg-abyss-950/60 rounded-xl border border-white/5 space-y-1">
                  <span className="text-slate-400">Hardware Probe Integrity:</span>
                  <p className="text-emerald-400 font-bold text-sm">{param.sensorHealth}</p>
                </div>
                <div className="p-3 bg-abyss-950/60 rounded-xl border border-white/5 space-y-1">
                  <span className="text-slate-400">Monitoring Methodology:</span>
                  <p className="text-aqua-primary font-bold text-sm">Autonomous Edge Telemetry</p>
                </div>
              </div>

              {/* Scientific Significance & Recommendation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-sans pt-1">
                <div className="p-3.5 bg-abyss-950/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    Hydrological Indicator Context:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {param.scientificSignificance}
                  </p>
                </div>

                <div className="p-3.5 bg-abyss-950/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    Early-Warning Action Recommendation:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {param.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
