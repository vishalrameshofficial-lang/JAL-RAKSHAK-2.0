require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

const { initDatabase } = require('./services/storageService');
const errorHandler = require('./middleware/errorHandler');

// Route handlers
const sensorRoutes = require('./routes/sensorData');
const alertRoutes = require('./routes/alerts');
const deviceRoutes = require('./routes/device');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Provide io instance across express app
app.set('io', io);

// Security & Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    service: 'JAL-RAKSHAK Backend (Live Hardware Telemetry Mode)',
    timestamp: new Date()
  });
});

// Mount modular API routes
app.use('/api/sensor-data', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log(`[SOCKET] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    // Client disconnected
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await initDatabase();

  server.listen(PORT, () => {
    console.log(`[SERVER] JAL-RAKSHAK live backend started on port ${PORT}`);
    console.log(`[SERVER] Ready for physical ESP32 telemetry on POST http://localhost:${PORT}/api/sensor-data`);
  });
}

startServer().catch(err => {
  console.error('[FATAL ERROR] Failed to start JAL-RAKSHAK backend:', err);
  process.exit(1);
});
