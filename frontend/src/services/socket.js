import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = new Map();
  }

  connect() {
    if (this.socket && this.socket.connected) return;

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    this.socket.on('connect', () => {
      console.log('[SOCKET] Connected to JAL-RAKSHAK real-time stream:', this.socket.id);
      this.emitInternal('connection_change', true);
    });

    this.socket.on('disconnect', () => {
      console.log('[SOCKET] Disconnected from JAL-RAKSHAK stream');
      this.emitInternal('connection_change', false);
    });

    this.socket.on('sensor_update', (data) => {
      this.emitInternal('sensor_update', data);
    });

    this.socket.on('alert_triggered', (data) => {
      this.emitInternal('alert_triggered', data);
    });

    this.socket.on('alert_status_changed', (data) => {
      this.emitInternal('alert_status_changed', data);
    });

    this.socket.on('simulation_state_changed', (data) => {
      this.emitInternal('simulation_state_changed', data);
    });

    this.socket.on('simulation_reset', (data) => {
      this.emitInternal('simulation_reset', data);
    });
  }

  on(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set());
    }
    this.callbacks.get(event).add(callback);
    return () => {
      const set = this.callbacks.get(event);
      if (set) set.delete(callback);
    };
  }

  emitInternal(event, data) {
    const set = this.callbacks.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in socket listener for ${event}:`, err);
        }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
