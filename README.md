# Plant Monitoring System — PC Dashboard (Agri Cop)

A fully self-contained React dashboard for monitoring plant health sensor data. Runs entirely in the browser with **no backend, no login, and no API keys required** — all data is generated locally via a realistic simulation engine.

## 🌱 Overview

The Agri Cop dashboard simulates a live IoT plant monitoring environment. Five demo greenhouse devices report sensor telemetry every 3 seconds, complete with historical trend charts, auto-irrigation logic, and configurable alert thresholds.

**Key Features:**

- ✅ Zero-backend demo mode — works completely offline
- ✅ Five demo devices, each mapped to a distinct plant profile
- ✅ Live sensor data updated every 3 seconds (moisture, temperature, humidity, light, battery)
- ✅ Auto-irrigation: pump turns ON/OFF automatically when moisture crosses threshold
- ✅ Manual pump control with mode tracking (auto / manual)
- ✅ Critical alerts and notification system
- ✅ 24-hour historical chart with day/night cycle simulation
- ✅ Per-device threshold configuration, persisted in localStorage
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Seasonal visual effects

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm 7+

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## 🌿 Demo Devices & Plant Profiles

The app ships with five simulated greenhouse devices. Each device is mapped to a plant profile that defines its realistic sensor ranges:

| Device ID          | Plant       | Emoji | Health Status |
| ------------------ | ----------- | ----- | ------------- |
| `GH-A1-Tomato`     | Tomato      | 🍅    | Excellent     |
| `GH-B2-Lettuce`    | Lettuce     | 🥬    | Good          |
| `GH-C3-Aloe`       | Aloe Vera   | 🌵    | Good          |
| `GH-D4-Basil`      | Sweet Basil | 🌿    | Fair          |
| `GH-E5-Strawberry` | Strawberry  | 🍓    | Excellent     |

Switch devices using the dropdown in the **Header**. Each device has independent settings stored in localStorage.

---

## 📊 Core Features

### 1. Live Sensor Simulation

Mock sensor readings are generated every **3 seconds** from `src/Service/mockData.js` using realistic range constraints per plant profile.

Sensors monitored:

| Sensor      | Unit   | Description                            |
| ----------- | ------ | -------------------------------------- |
| Moisture    | %      | Soil moisture — drives auto-pump logic |
| Temperature | °C     | Ambient temperature                    |
| Humidity    | %      | Relative air humidity                  |
| Light       | lux    | Light intensity                        |
| Battery     | %      | Simulated device battery level         |
| Pump Status | ON/OFF | Pump state with mode indicator         |

### 2. Automated Irrigation

Pump logic runs locally in `App.jsx`:

- **Auto Mode** — Pump turns ON when moisture < `moistureMin`; turns OFF when moisture recovers. Commands debounced at 5 seconds.
- **Manual Mode** — A warning notification fires (max once per 60 seconds) when moisture is low and the pump is still OFF. User must toggle the pump manually from Settings.

### 3. Manual Pump Control

From the **Device Settings** page:

- Toggle pump ON/OFF with instant visual feedback
- State changes dispatched via browser `CustomEvent` (`pump:change`, `mode:change`)
- No HTTP calls — fully local

### 4. Historical Data Visualization

- 24 hours of chart data generated on demand
- 4 data-points per hour (one every 15 min)
- Day/night sinusoidal drift: temperature peaks at noon, humidity inversely correlated
- Noise factor: 0.15 (configurable in `mockData.js`)

### 5. Threshold Configuration

Per-device thresholds stored in `localStorage` under `settings_{deviceId}`:

| Sensor      | Default Min | Default Max |
| ----------- | ----------- | ----------- |
| Moisture    | 20%         | 70%         |
| Temperature | 10°C        | 35°C        |
| Humidity    | 30%         | 80%         |
| Light       | 200 lux     | 1000 lux    |
| Battery     | 20%         | —           |

### 6. Notifications

Critical-value transitions (e.g. moisture crossing below min) fire a notification via `NotificationContext`. Transitions are edge-triggered — the alert fires only once when the sensor first crosses the threshold, not on every update.

---

## 🏗️ Architecture

The app is a single-page React application. There is **no network communication** at runtime.

### Data Flow

```
mockData.js ──generateLiveSensorData()──► App.jsx (setInterval 3s)
                                               │
                                          liveData state
                                          /           \
                                Dashboard.jsx    DeviceSettingsPage.jsx
                                      │                   │
                               StatusCards        PumpControlToggle
                               HistoricalChart    AutoModeToggle
                               ThresholdSection   ThresholdInput
```

### Inter-Component Communication

Components communicate via browser `CustomEvent`s dispatched on `window`:

| Event              | Direction                | Payload                |
| ------------------ | ------------------------ | ---------------------- |
| `live:update`      | App → all                | `liveData` snapshot    |
| `settings:updated` | DeviceSettingsPage → App | `{ deviceId }`         |
| `pump:change`      | DeviceSettingsPage → App | `{ deviceId, status }` |
| `mode:change`      | DeviceSettingsPage → App | `{ deviceId, mode }`   |

---

## 🏗️ Project Structure

```
src/
├── Components/
│   ├── Dashboard.jsx              # Main dashboard with sensor cards
│   ├── Header.jsx                 # Navigation bar with device selector
│   ├── StatusBar.jsx              # Tab navigation component
│   ├── DeviceSettingsPage.jsx     # Device settings & pump control page
│   ├── HistoricalChartTest.jsx    # Recharts 24-hour trend visualization
│   ├── ErrorBoundary.jsx          # React error boundary wrapper
│   ├── ActionButton.jsx           # Reusable action button
│   ├── AutoModeToggle.jsx         # Auto/manual mode toggle
│   ├── CommandStatusMessage.jsx   # Command feedback display
│   ├── ConnectionStatusPanel.jsx  # Connection status indicator
│   ├── PageHeader.jsx             # Page-level heading
│   ├── PumpControlToggle.jsx      # Pump ON/OFF toggle
│   ├── SeasonalEffects.jsx        # Seasonal visual decorations
│   ├── SensorStatusIndicator.jsx  # Per-sensor status icon
│   ├── SensorToggleToolbar.jsx    # Chart sensor visibility toggles
│   ├── StatusCard.jsx             # Individual sensor metric card
│   ├── ThresholdInput.jsx         # Single threshold input field
│   ├── ThresholdSection.jsx       # Grouped threshold settings
│   └── ValidationModal.jsx        # Confirmation/validation dialog
│
├── Context/
│   └── NotificationContext.jsx    # App-wide notification system
│
├── Service/
│   └── mockData.js                # Demo data generator & plant profiles
│
├── App.jsx                        # Root component — state, intervals, logic
├── config.demo.js                 # Demo configuration constants
├── main.jsx                       # React entry point
└── index.css                      # Global styles
```

---

## 🔧 Customisation

All simulation parameters live in `src/Service/mockData.js`.

### Triggering Alerts

**Low Water warning** — Set the Tomato profile's typical moisture below the threshold (20%):

```javascript
moisture: { min: 5, max: 15, typical: 10 }
```

**High Temperature warning** — Set typical temperature above 35°C:

```javascript
temperature: { min: 30, max: 42, typical: 38 }
```

### Chart Smoothness

```javascript
const NOISE_FACTOR = 0.15;  // 0 = flat lines, 1 = very noisy
const POINTS_PER_HOUR = 4;  // historical readings per hour
```

### Live Update Interval

In `src/config.demo.js`:

```javascript
LIVE_UPDATE_INTERVAL_MS: 3000  // milliseconds between sensor updates
```

---

## 🔌 Technology Stack

| Package      | Version | Purpose                        |
| ------------ | ------- | ------------------------------ |
| React        | 18.2.0  | Component-based UI framework   |
| Vite         | 7.2.2   | Build tool & dev server (port 3000) |
| Tailwind CSS | 3.4.0   | Utility-first CSS framework    |
| Recharts     | 2.10.3  | Historical chart visualization |
| Lucide React | 0.263.1 | Icon library                   |

> **Note:** `@stomp/stompjs` and `axios` are present in `package.json` as legacy dependencies from a previous backend-connected version. They are not used in the current demo build.

---

## 🐛 Troubleshooting

### Sensors Not Updating

- Check the browser console for JavaScript errors.
- The live-data interval restarts when the selected device changes. Switch away from the device and back to reset it.

### Settings Not Persisting

- Settings are stored in `localStorage` under `settings_{deviceId}`. Open DevTools → Application → Local Storage to inspect or clear them.

### Chart Not Loading

- Historical data is generated asynchronously with a simulated 300–700 ms delay. If the chart stays empty, refresh the page.

### Pump Not Responding in Auto Mode

- Verify **Auto Mode** is toggled ON in Device Settings.
- Auto-pump commands are debounced: a new command only fires after 5 seconds from the last one.

---

## 🚀 Deployment

### GitHub Pages

```bash
npm run deploy
```

Deploys to `https://ttmagedara2001.github.io/Plant-Monitoring-System_PC`

### Vercel / Netlify

```bash
npm run build
# Upload the dist/ folder
```

---

## 📚 Documentation

| Document                        | Purpose                                             |
| ------------------------------- | --------------------------------------------------- |
| **README.md**                   | 📖 This file — demo mode overview                  |
| **MQTTX_TESTING_GUIDE.md**      | 🧪 Hardware integration testing reference (future)  |
| **PROTONEST_SETUP.md**          | ⚙️ ProtoNest platform integration guide (future)    |
| **WEBSOCKET_IMPLEMENTATION.md** | 🔌 WebSocket/STOMP architecture reference (future)  |

---

**Status:** Demo Mode — Zero Backend  
**Last Updated:** February 2026  
**Version:** 3.0.0 (Zero-Backend Demo / Sandbox)
