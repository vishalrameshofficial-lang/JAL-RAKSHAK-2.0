const storageService = require('./storageService');
const alertEngine = require('./alertEngine');

class SimulatorService {
  constructor() {
    this.intervalHandle = null;
    this.isRunning = true;
    this.intervalMs = 3000;
    this.io = null;

    // Baseline values for smooth walking
    this.state = {
      ph: 7.21,
      tds: 245,
      turbidity: 2.3,
      temperature: 27.4,
      waterLevel: 82,
      anomalyMode: 'NONE', // 'NONE', 'TURBIDITY_SURGE', 'ACID_RUNOFF', 'TEMP_SPIKE', 'LOW_WATER'
      anomalyStep: 0
    };
  }

  init(io) {
    this.io = io;
    this.start();
  }

  start() {
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    this.isRunning = true;
    console.log('[SIMULATOR] Realistic Environmental Telemetry Simulator started (Interval: ' + this.intervalMs + 'ms)');

    this.intervalHandle = setInterval(async () => {
      if (!this.isRunning) return;
      try {
        const reading = await this.generateNextReading();
        const saved = await storageService.saveReading(reading);
        
        // Evaluate alerts
        await alertEngine.evaluateReading(saved, this.io);

        // Broadcast real-time sensor update via Socket.IO
        if (this.io) {
          this.io.emit('sensor_update', saved);
        }
      } catch (err) {
        console.error('[SIMULATOR] Error producing simulation step:', err.message);
      }
    }, this.intervalMs);
  }

  pause() {
    this.isRunning = false;
    console.log('[SIMULATOR] Simulation paused.');
  }

  resume() {
    this.isRunning = true;
    console.log('[SIMULATOR] Simulation resumed.');
  }

  reset() {
    this.state = {
      ph: 7.21,
      tds: 245,
      turbidity: 2.3,
      temperature: 27.4,
      waterLevel: 82,
      anomalyMode: 'NONE',
      anomalyStep: 0
    };
    storageService.resetMemoryToClean();
    console.log('[SIMULATOR] State reset to pristine baseline.');
  }

  setAnomaly(mode) {
    this.state.anomalyMode = mode;
    this.state.anomalyStep = 0;
    console.log(`[SIMULATOR] Anomaly mode activated: ${mode}`);
  }

  async generateNextReading() {
    const s = this.state;
    s.anomalyStep++;

    if (s.anomalyMode === 'TURBIDITY_SURGE') {
      // Gradually increases turbidity up to 6.8 - 9.2 NTU over 5 steps
      s.turbidity = Math.min(9.4, s.turbidity + 0.8 + Math.random() * 0.4);
      s.tds = Math.min(380, s.tds + 12);
      if (s.anomalyStep > 12) {
        // Auto-recover after demonstration
        s.anomalyMode = 'NONE';
      }
    } else if (s.anomalyMode === 'ACID_RUNOFF') {
      // pH drops gradually to 6.1
      s.ph = Math.max(5.95, s.ph - 0.22);
      s.tds = Math.min(420, s.tds + 18);
      if (s.anomalyStep > 12) s.anomalyMode = 'NONE';
    } else if (s.anomalyMode === 'TEMP_SPIKE') {
      s.temperature = Math.min(36.5, s.temperature + 0.9);
      if (s.anomalyStep > 10) s.anomalyMode = 'NONE';
    } else if (s.anomalyMode === 'LOW_WATER') {
      s.waterLevel = Math.max(14, s.waterLevel - 6);
      if (s.anomalyStep > 10) s.anomalyMode = 'NONE';
    } else {
      // Smooth natural drift towards baseline
      s.ph += (7.21 - s.ph) * 0.12 + (Math.random() - 0.5) * 0.04;
      s.ph = Math.max(6.9, Math.min(7.55, s.ph));

      s.tds += (245 - s.tds) * 0.1 + (Math.random() - 0.5) * 3;
      s.tds = Math.max(160, Math.min(320, s.tds));

      s.turbidity += (2.2 - s.turbidity) * 0.15 + (Math.random() - 0.5) * 0.12;
      s.turbidity = Math.max(1.1, Math.min(3.8, s.turbidity));

      s.temperature += (27.2 - s.temperature) * 0.08 + (Math.random() - 0.5) * 0.15;
      s.temperature = Math.max(25.0, Math.min(30.0, s.temperature));

      s.waterLevel += (82 - s.waterLevel) * 0.08 + (Math.random() - 0.5) * 0.3;
      s.waterLevel = Math.max(70, Math.min(90, s.waterLevel));
    }

    return {
      deviceId: 'JR001',
      timestamp: new Date(),
      ph: parseFloat(s.ph.toFixed(2)),
      tds: Math.round(s.tds),
      turbidity: parseFloat(s.turbidity.toFixed(2)),
      temperature: parseFloat(s.temperature.toFixed(1)),
      waterLevel: Math.round(s.waterLevel),
      isSimulated: true
    };
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      anomalyMode: this.state.anomalyMode,
      currentState: {
        ph: parseFloat(this.state.ph.toFixed(2)),
        tds: Math.round(this.state.tds),
        turbidity: parseFloat(this.state.turbidity.toFixed(2)),
        temperature: parseFloat(this.state.temperature.toFixed(1)),
        waterLevel: Math.round(this.state.waterLevel)
      }
    };
  }
}

module.exports = new SimulatorService();
