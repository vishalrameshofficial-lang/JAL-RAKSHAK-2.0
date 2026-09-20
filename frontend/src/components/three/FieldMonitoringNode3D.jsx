import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Radio, ShieldCheck, Waves, Info } from 'lucide-react';

export default function FieldMonitoringNode3D() {
  const mountRef = useRef(null);
  const [activeTab, setActiveTab] = useState('sensors'); // 'sensors' or 'enclosure'

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a334a, 2.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00d4ff, 2.8);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const dirLightBack = new THREE.DirectionalLight(0x20e3c2, 1.8);
    dirLightBack.position.set(-6, -2, -5);
    scene.add(dirLightBack);

    // Root Group for smooth auto-rotation & interaction
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Water Column (Lower Half)
    const waterGeo = new THREE.CylinderGeometry(3.5, 3.5, 3.2, 32);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x053046,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.7,
      ior: 1.33
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -1.6;
    rootGroup.add(waterMesh);

    // Water Surface Ring
    const ringGeo = new THREE.RingGeometry(3.3, 3.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0;
    rootGroup.add(ringMesh);

    // 2. Monitoring Station Pole & Mount Platform
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 1.6, 0);
    rootGroup.add(pole);

    // Crossbar Mounting Bracket
    const barGeo = new THREE.BoxGeometry(3.2, 0.15, 0.4);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.4 });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, 0.8, 0);
    rootGroup.add(bar);

    // 3. Submerged Sensor Probes entering the water
    const probes = [
      { name: 'pH SENSOR', x: -1.2, color: 0x38bdf8, len: 2.2, radius: 0.09 },
      { name: 'TDS SENSOR', x: -0.6, color: 0x2dd4bf, len: 2.0, radius: 0.08 },
      { name: 'TURBIDITY SENSOR', x: 0.0, color: 0x00d4ff, len: 2.3, radius: 0.14 },
      { name: 'TEMPERATURE SENSOR', x: 0.6, color: 0xf59e0b, len: 2.5, radius: 0.06 },
      { name: 'LEVEL SENSOR', x: 1.2, color: 0xa855f7, len: 1.5, radius: 0.12 }
    ];

    probes.forEach((probe) => {
      // Sensor Cable from crossbar
      const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
      const cableMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const cable = new THREE.Mesh(cableGeo, cableMat);
      cable.position.set(probe.x, 0.45, 0);
      rootGroup.add(cable);

      // Probe Body (enters water)
      const probeGeo = new THREE.CylinderGeometry(probe.radius, probe.radius * 0.9, probe.len, 16);
      const probeMat = new THREE.MeshStandardMaterial({
        color: probe.color,
        metalness: 0.6,
        roughness: 0.2,
        emissive: probe.color,
        emissiveIntensity: 0.3
      });
      const probeMesh = new THREE.Mesh(probeGeo, probeMat);
      probeMesh.position.set(probe.x, 0.1 - probe.len / 2, 0);
      rootGroup.add(probeMesh);

      // Probe Tip Glow Dot
      const tipGeo = new THREE.SphereGeometry(probe.radius * 1.1, 8, 8);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(probe.x, 0.1 - probe.len, 0);
      rootGroup.add(tip);
    });

    // 4. ESP32 Weatherproof Enclosure Unit (Above Water on Mast)
    const boxGeo = new THREE.BoxGeometry(1.6, 1.2, 0.9);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x072433,
      metalness: 0.7,
      roughness: 0.3
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(0, 2.5, 0);
    rootGroup.add(box);

    // Translucent Enclosure Cover
    const coverGeo = new THREE.BoxGeometry(1.45, 1.05, 0.1);
    const coverMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      transmission: 0.8
    });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    cover.position.set(0, 2.5, 0.46);
    rootGroup.add(cover);

    // Glowing ESP32 LED inside
    const ledGeo = new THREE.BoxGeometry(0.15, 0.1, 0.05);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.3, 2.5, 0.4);
    rootGroup.add(led);

    // Wi-Fi / LoRa Antenna on top of enclosure
    const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
    const antMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const antenna = new THREE.Mesh(antGeo, antMat);
    antenna.position.set(0.6, 3.45, 0);
    rootGroup.add(antenna);

    // Mouse Interaction
    let isDragging = false;
    let prevMouseX = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const delta = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      rootGroup.rotation.y += delta * 0.01;
    };
    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Slow idle rotation when not dragging
      if (!isDragging) {
        rootGroup.rotation.y += 0.004;
      }

      // Gentle floating bobbing
      waterMesh.rotation.y = time * 0.08;
      box.position.y = 2.5 + Math.sin(time * 1.5) * 0.02;

      // Pulse LED
      led.scale.setScalar(1 + Math.sin(time * 6) * 0.2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden border border-aqua-primary/20 shadow-glass-card">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-aqua-primary/10 border border-aqua-primary/30 flex items-center justify-center text-aqua-primary">
            <Waves className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] tracking-widest text-aqua-seafoam font-mono font-semibold uppercase">
              FIELD MONITORING NODE
            </div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Submerged Sensor Assembly
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                3D TELEMETRY TWIN
              </span>
            </h3>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-abyss-950/80 border border-white/10 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeTab === 'sensors'
                ? 'bg-aqua-primary/20 text-aqua-primary border border-aqua-primary/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sensors View
          </button>
          <button
            onClick={() => setActiveTab('enclosure')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeTab === 'enclosure'
                ? 'bg-aqua-primary/20 text-aqua-primary border border-aqua-primary/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Field Enclosure
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-64 md:h-72 cursor-grab active:cursor-grabbing rounded-xl bg-gradient-to-b from-abyss-900/40 via-abyss-950/70 to-abyss-900/40 relative overflow-hidden"
      >
        <div className="absolute top-2 left-3 text-[11px] text-slate-400 font-mono bg-abyss-950/60 px-2 py-1 rounded border border-white/5 pointer-events-none backdrop-blur-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-aqua-primary animate-ping"></span>
          Drag to rotate 3D node
        </div>
      </div>

      {/* Sensor Probes Legend / Enclosure Inspection */}
      {activeTab === 'sensors' ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 text-xs font-mono">
          <div className="bg-abyss-900/70 border border-sky-500/30 rounded-lg p-2 flex flex-col items-center text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] mb-1"></span>
            <span className="text-[11px] font-bold text-slate-200">pH SENSOR</span>
            <span className="text-[10px] text-slate-400">Glass Electrode</span>
          </div>
          <div className="bg-abyss-900/70 border border-teal-500/30 rounded-lg p-2 flex flex-col items-center text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] mb-1"></span>
            <span className="text-[11px] font-bold text-slate-200">TDS SENSOR</span>
            <span className="text-[10px] text-slate-400">PPM Conductivity</span>
          </div>
          <div className="bg-abyss-900/70 border border-aqua-primary/40 rounded-lg p-2 flex flex-col items-center text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-aqua-primary shadow-[0_0_8px_rgba(0,212,255,0.8)] mb-1"></span>
            <span className="text-[11px] font-bold text-slate-200">TURBIDITY</span>
            <span className="text-[10px] text-slate-400">Optical TS-300B</span>
          </div>
          <div className="bg-abyss-900/70 border border-amber-500/30 rounded-lg p-2 flex flex-col items-center text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] mb-1"></span>
            <span className="text-[11px] font-bold text-slate-200">TEMPERATURE</span>
            <span className="text-[10px] text-slate-400">DS18B20 Sealed</span>
          </div>
          <div className="bg-abyss-900/70 border border-purple-500/30 rounded-lg p-2 flex flex-col items-center text-center col-span-2 sm:col-span-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] mb-1"></span>
            <span className="text-[11px] font-bold text-slate-200">LEVEL SENSOR</span>
            <span className="text-[10px] text-slate-400">Hydrostatic Head</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 bg-abyss-900/80 border border-aqua-primary/20 rounded-xl p-3.5 text-xs text-slate-300 space-y-2 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="flex items-center gap-2 text-aqua-primary font-semibold">
              <Cpu className="w-4 h-4" /> Weatherproof Enclosure Core
            </span>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              IP67 SEALED
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-slate-400">Microcontroller:</span>
              <p className="text-slate-100 font-medium">ESP32-WROOM-32D Dual-Core</p>
            </div>
            <div>
              <span className="text-slate-400">Active Telemetry:</span>
              <p className="text-slate-100 font-medium">Wi-Fi 802.11 b/g/n → REST/WS</p>
            </div>
            <div>
              <span className="text-slate-400">Power Management:</span>
              <p className="text-slate-100 font-medium">Solar 12V LiFePO4 + Buck Reg.</p>
            </div>
          </div>
          <div className="mt-2 bg-abyss-950/80 border border-white/10 p-2 rounded flex items-center gap-2 text-[11px] text-slate-300">
            <Radio className="w-4 h-4 text-aqua-seafoam shrink-0" />
            <span>
              <strong className="text-aqua-seafoam">LoRa communication — Planned expansion:</strong> Modular socket ready for long-range SX1278 transceiver integration.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
