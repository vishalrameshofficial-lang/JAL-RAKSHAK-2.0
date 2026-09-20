/**
 * JAL-RAKSHAK ESP32 Edge Node Firmware
 * Smart Water Quality Monitoring & Contamination Early-Warning Platform
 * 
 * Hardware:
 * - ESP32-WROOM-32D Development Board
 * - Analog pH Sensor Probe (Pin 34 - ADC1)
 * - Analog TDS Meter Sensor (Pin 35 - ADC1)
 * - Optical Turbidity Sensor TS-300B (Pin 32 - ADC1)
 * - DS18B20 OneWire Waterproof Temperature Probe (Pin 4)
 * - Ultrasonic / Hydrostatic Water Level Sensor (Trig Pin 5, Echo Pin 18)
 * 
 * Communication:
 * - Wi-Fi Station Mode (802.11 b/g/n)
 * - HTTP POST REST Telemetry to JAL-RAKSHAK Backend API
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // ArduinoJson v6 or v7
#include <OneWire.h>
#include <DallasTemperature.h>

// =================== CONFIGURATION ===================
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Replace with your backend server IP / domain
// e.g., "http://192.168.1.100:5000/api/sensor-data"
const char* SERVER_URL = "http://192.168.1.100:5000/api/sensor-data";
const char* DEVICE_ID = "JR001";

// Telemetry transmit interval (milliseconds)
const unsigned long TRANSMIT_INTERVAL_MS = 3000;
unsigned long lastTransmitTime = 0;

// Pin Definitions
#define PH_PIN 34
#define TDS_PIN 35
#define TURBIDITY_PIN 32
#define ONE_WIRE_BUS 4
#define TRIG_PIN 5
#define ECHO_PIN 18

// Dallas Temperature Setup
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensors(&oneWire);

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n[JAL-RAKSHAK] Node Initializing...");

  pinMode(PH_PIN, INPUT);
  pinMode(TDS_PIN, INPUT);
  pinMode(TURBIDITY_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  tempSensors.begin();

  // Connect to Wi-Fi
  Serial.print("[WIFI] Connecting to ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retryCount = 0;
  while (WiFi.status() != WL_CONNECTED && retryCount < 20) {
    delay(500);
    Serial.print(".");
    retryCount++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] Connected!");
    Serial.print("[WIFI] Assigned IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WIFI] Warning: Could not connect to Wi-Fi. Retrying in main loop.");
  }
}

// Read raw ADC and calculate pH (calibration parameters may be tuned)
float readPH() {
  int raw = analogRead(PH_PIN);
  float voltage = raw * (3.3 / 4095.0);
  // Indicative linear slope for 0-3.3V analog pH meter
  float phValue = 3.5 * voltage; 
  if (phValue < 0.0) phValue = 0.0;
  if (phValue > 14.0) phValue = 14.0;
  return phValue;
}

// Read TDS Sensor
float readTDS(float temperature) {
  int raw = analogRead(TDS_PIN);
  float voltage = raw * (3.3 / 4095.0);
  // Temperature compensation formula
  float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
  float compensationVoltage = voltage / compensationCoefficient;
  // Convert voltage to TDS value in ppm
  float tdsValue = (133.42 * pow(compensationVoltage, 3) - 255.86 * pow(compensationVoltage, 2) + 857.39 * compensationVoltage) * 0.5;
  if (tdsValue < 0) tdsValue = 0;
  return tdsValue;
}

// Read Optical Turbidity
float readTurbidity() {
  int raw = analogRead(TURBIDITY_PIN);
  float voltage = raw * (3.3 / 4095.0);
  // TS-300B inverse quadratic conversion to Nephelometric Turbidity Units (NTU)
  float ntu = -1120.4 * pow(voltage, 2) + 5742.3 * voltage - 4352.9;
  if (ntu < 0.1) ntu = 0.5;
  if (ntu > 3000.0) ntu = 3000.0;
  return ntu;
}

// Read DS18B20 Temperature
float readTemperature() {
  tempSensors.requestTemperatures();
  float tempC = tempSensors.getTempCByIndex(0);
  if (tempC == DEVICE_DISCONNECTED_C || tempC < -20 || tempC > 80) {
    return 25.0; // Fallback default
  }
  return tempC;
}

// Read Water Level from Ultrasonic Sensor (Percentage 0 - 100%)
float readWaterLevel() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 80.0; // Default nominal level if out of range

  float distanceCm = duration * 0.034 / 2.0;
  // Assuming tank depth of 100cm (distance 10cm = 100% full, distance 90cm = 0% full)
  float tankDepth = 100.0;
  float levelPercent = ((tankDepth - distanceCm) / tankDepth) * 100.0;
  if (levelPercent < 0) levelPercent = 0;
  if (levelPercent > 100) levelPercent = 100;
  return levelPercent;
}

void loop() {
  // Check Wi-Fi reconnection
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.reconnect();
  }

  unsigned long currentMillis = millis();
  if (currentMillis - lastTransmitTime >= TRANSMIT_INTERVAL_MS) {
    lastTransmitTime = currentMillis;

    // Sample Sensors
    float temperature = readTemperature();
    float ph = readPH();
    float tds = readTDS(temperature);
    float turbidity = readTurbidity();
    float waterLevel = readWaterLevel();

    // Prepare JSON payload
    StaticJsonDocument<256> doc;
    doc["deviceId"] = DEVICE_ID;
    doc["ph"] = serialized(String(ph, 2));
    doc["tds"] = round(tds);
    doc["turbidity"] = serialized(String(turbidity, 2));
    doc["temperature"] = serialized(String(temperature, 1));
    doc["waterLevel"] = round(waterLevel);

    String requestBody;
    serializeJson(doc, requestBody);

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(SERVER_URL);
      http.addHeader("Content-Type", "application/json");

      int httpResponseCode = http.POST(requestBody);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.printf("[HTTP %d] Telemetry transmitted successfully: %s\n", httpResponseCode, requestBody.c_str());
      } else {
        Serial.printf("[HTTP ERROR] Failed to send telemetry. Code: %d\n", httpResponseCode);
      }
      http.end();
    } else {
      Serial.println("[WIFI] Offline. Telemetry transmission skipped.");
    }
  }
}
