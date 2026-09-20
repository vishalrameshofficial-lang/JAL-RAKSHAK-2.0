# JAL-RAKSHAK (जल-रक्षक)
### Smart Water Quality Monitoring & Contamination Early-Warning Platform
> *"Monitor. Detect. Protect."*

An intelligent IoT-enabled water-quality monitoring and environmental early-warning platform. The system acquires physical sensor readings through an **ESP32 microcontroller**, transmits telemetry over Wi-Fi, ingests and evaluates parameters in a **Node.js/Express API**, and displays real-time telemetry, 3D hydrology models, and alerts on a **React & Three.js Command Dashboard**.

---

## 🌊 System Architecture

```
WATER BODY / BASIN
       │
[ 5 SUBMERGED PROBES ]
  ├── pH Sensor (E-201-C)
  ├── TDS Sensor (Conductivity PPM)
  ├── Optical Turbidity Sensor (TS-300B)
  ├── Water Temperature Sensor (DS18B20 Sealed)
  └── Water-Level Sensor (Ultrasonic / Hydrostatic)
       │
       ▼
[ ESP32-WROOM-32D MCU ]
  ├── Analog ADC1 Sampling (GPIO 32, 34, 35)
  ├── OneWire Bus (GPIO 4) & Ultrasonic (GPIO 5, 18)
  └── Wi-Fi 802.11 b/g/n Telemetry Engine
       │
       ▼ (HTTP POST /api/sensor-data)
[ NODE.JS & EXPRESS BACKEND ]
  ├── Alert Evaluation Engine (Scientific Threshold Triage)
  ├── Dual-Mode Database Engine:
  │     ├── MongoDB Atlas (Production & Historical Archive)
  │     └── Resilient Local Memory & Cache Engine (Zero-Dependency Fallback)
  └── Socket.IO Real-Time Broadcast Server
       │
       ▼ (WebSocket Live Push Stream)
[ JAL-RAKSHAK COMMAND CENTER ]
  ├── Three.js Interactive 3D Water & Subsurface Simulation
  ├── 3D Field Monitoring Node & Enclosure Visualizer
  ├── Indicative Water Health Gauge (0 - 100 Index)
  ├── 5 Glassmorphism Indicator Cards
  ├── High-Frequency Live Oscilloscope Stream & Terminal Log
  ├── Historical Time-Series Analytics & CSV Exporter
  ├── Environmental Compliance Report Generator (Daily, Weekly, Monthly)
  └── Threshold Calibration & Presentation Scenario Triggers
```

---

## 🔬 Scientific Indicator Integrity

In accordance with environmental science guidelines:
- **pH, TDS, turbidity, temperature, and water level** are monitored as continuous physical and chemical indicators for **early anomaly detection**.
- They do **not** claim direct identification of specific heavy metals or trace pathogens without dedicated bio-chemical assay probes.
- When deviations occur, alerts explicitly specify:
  > *"Potential water-quality anomaly detected — further laboratory verification recommended."*
- The **Water Health Score** is presented as an **indicative monitoring score** to assist field operators and does not replace statutory laboratory drinking-water validation.

---

## 🛠️ Hardware Specification & Pin Mapping

| Sensor Probe | Hardware Model | ESP32 Pin | Principle / Unit |
| :--- | :--- | :--- | :--- |
| **pH Sensor** | E-201-C Glass Electrode | GPIO 34 (ADC1) | Logarithmic H⁺ ion activity ($0 - 14\text{ pH}$) |
| **TDS Sensor** | Analog PPM Meter | GPIO 35 (ADC1) | AC Conductivity / Dissolved Minerals ($\text{ppm}$) |
| **Turbidity Sensor**| TS-300B Optical Sensor | GPIO 32 (ADC1) | 90° Light Scattering ($\text{NTU}$) |
| **Temperature** | DS18B20 Sealed Waterproof | GPIO 4 (OneWire) | Dallas Semiconductor Digital ($^\circ\text{C}$) |
| **Water Level** | Ultrasonic / Hydrostatic | GPIO 5 (Trig) / 18 (Echo) | Ultrasonic Echo Head / Head Pressure ($\%$) |

> **Future LoRa Expansion Note:** The backend and edge firmware architecture are designed modularly so a Semtech SX1278 LoRa transceiver can be connected for remote catchment telemetry without altering the core API contracts.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher installed)
- **npm** package manager
- *(Optional)* **MongoDB Atlas** connection string (or run in built-in resilient in-memory mode)

---

### 1. Start Backend Server

```bash
cd backend
npm install
npm start
```
*The backend starts at `http://localhost:5000`.*
- Health Check: `http://localhost:5000/api/health`
- WebSocket Server: `ws://localhost:5000`

#### Backend `.env` Options
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jal_rakshak   # Optional
DEFAULT_DEVICE_ID=JR001
STATION_NAME="JAL-RAKSHAK NODE 01"
OFFLINE_TIMEOUT_SECONDS=20
```

---

### 2. Start Frontend Web Dashboard

```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📡 Pure Hardware Mode (ESP32 & Real Sensors)

The platform runs strictly in **Pure Hardware Live Mode**. There is no mock or simulated database. All stored telemetry, live visualizations, and alerts are generated exclusively from physical sensor readings transmitted by your ESP32 microcontroller.

1. **Hardware Connection**: Connect your ESP32 to Wi-Fi.
2. **Telemetry Dispatch**: The ESP32 reads physical analog/digital pins and POSTs to `/api/sensor-data`:
   - pH (Pin 34 - ADC1)
   - TDS (Pin 35 - ADC1)
   - Turbidity (Pin 32 - ADC1)
   - Temperature (Pin 4 - OneWire DS18B20)
   - Water Level (Pin 5 Trig, Pin 18 Echo)
3. **Real-time Live Stream**: The backend ingests the reading, evaluates scientific thresholds, stores it to the database, and streams the values to the React Command Center via WebSockets (Socket.IO).

---

## 📡 ESP32 Ingestion API Contract

When the ESP32 samples its physical sensors, it transmits an HTTP `POST` to:
```http
POST http://<YOUR_BACKEND_IP>:5000/api/sensor-data
Content-Type: application/json
```

**Payload Schema:**
```json
{
  "deviceId": "JR001",
  "ph": 7.34,
  "tds": 240,
  "turbidity": 2.15,
  "temperature": 26.8,
  "waterLevel": 85.0
}
```

### Ready-to-Flash Firmware
A complete Arduino C++ sketch is available in:
`backend/esp32_firmware/jal_rakshak_esp32.ino`

---

## ⚙️ Backend API Endpoints

| Method| Endpoint | Description |
| :---  | :--- | :--- |
| `GET` | `/api/health` | Backend and database connectivity health probe |
| `POST`| `/api/sensor-data` | Ingest sensor telemetry from ESP32 |
| `GET` | `/api/sensor-data/latest` | Retrieve latest reading & connection timeout |
| `GET` | `/api/sensor-data/history` | Retrieve time-series dataset (1h, 6h, 24h, 7d, 30d) |
| `GET` | `/api/sensor-data/export` | Download real-time historical dataset as CSV |
| `GET` | `/api/alerts` | Query active and historical anomaly alerts |
| `PATCH`| `/api/alerts/:id` | Acknowledge or resolve an active alert |
| `GET` | `/api/device/status` | Edge ESP32 link state, sensor health, and RSSI |
| `GET` | `/api/reports/generate` | Generate Daily, Weekly, or Monthly hydrology reports |
| `GET` | `/api/settings` | Query threshold calibration limits |
| `POST`| `/api/settings` | Update alert thresholds |

---

## 🎨 Design & Visual Aesthetic

- **Theme Palette**: Abyssal Navy (`#03131F`, `#061E2B`, `#082C3A`), Glowing Aqua/Cyan (`#00D4FF`, `#00B8D9`, `#20E3C2`), Alert Warning (`#F59E0B`), Critical (`#EF4444`).
- **3D Three.js Water Shader**: Smooth undulating procedural wave plane with caustic particles, soft underwater lighting, and mouse parallax.
- **Glassmorphism**: Translucent cards, subtle borders, soft shadows, and non-intrusive glow pulses.
- **Responsive**: Adapts gracefully across desktop, laptops, tablets, and mobile screens.

---

## 📄 License
Designed and developed for Smart India Hackathon (SIH) environmental observation prototypes.
All rights reserved © JAL-RAKSHAK.
