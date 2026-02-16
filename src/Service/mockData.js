/**
 * ============================================================================
 * MOCK DATA UTILITY — Agri Cop Demo / Sandbox Mode
 * ============================================================================
 *
 * This module generates realistic plant-health telemetry for the demo/sandbox
 * experience.  It allows a guest user to explore every feature of the Agri Cop
 * dashboard **without** a real hardware connection or cloud API key.
 *
 * ─── HOW TO CUSTOMISE ───────────────────────────────────────────────────────
 *
 *  1. PLANT PROFILES
 *     Edit the `PLANT_PROFILES` array below.  Each profile defines typical
 *     sensor ranges for that plant type.  The dashboard picks a profile and
 *     simulates readings within those ranges.
 *
 *  2. TRIGGERING ALERTS
 *     To test a "Low Water" warning, set the profile's `moisture.typical`
 *     value below the Dashboard threshold (default: 20%).
 *     Example:  moisture: { min: 5, max: 15, typical: 10 }
 *     This will cause the moisture card to turn red and trigger notifications.
 *
 *     Similarly, set `temperature.typical` above 35 °C to trigger a
 *     "High Temperature" warning.
 *
 *  3. HISTORICAL DATA
 *     `generateHistoricalData()` produces 24 hours of readings.
 *     Change `HISTORY_POINTS` to increase/decrease granularity.
 *     Change `NOISE_FACTOR` to control how "noisy" the chart looks.
 *
 *  4. NPK RATIOS
 *     The `npk` field on each profile uses standard Nitrogen-Phosphorus-
 *     Potassium percentages.  These are displayed in the dashboard cards
 *     when Demo Mode is active.
 *
 * ─── EXPORTS ────────────────────────────────────────────────────────────────
 *
 *  • PLANT_PROFILES          — Array of 5 plant profile objects
 *  • getRandomPlantProfile() — Pick a random profile
 *  • generateLiveSensorData(profile) — One snapshot of sensor readings
 *  • generateHistoricalData(profile, hours) — 24-hour chart-ready array
 *  • generateMockStreamData(deviceId)       — Mimics getAllStreamData() shape
 *  • DEMO_DEVICE_LIST        — Array of demo device IDs
 *  • DEMO_DEVICE_ID          — Default demo device
 *
 * ============================================================================
 */

// ─── Configuration ──────────────────────────────────────────────────────────

/** Number of data-points per hour in the historical trend array. */
const POINTS_PER_HOUR = 4; // one reading every 15 min

/**
 * Noise factor (0 – 1).  Higher values produce more variation in generated
 * sensor readings.  0.15 gives a realistic-looking chart.
 *
 * ──────────────────────────────────────────────────────────────────────
 * TIP: Set NOISE_FACTOR to 0 for perfectly flat lines (good for testing
 *      threshold-exact edge cases).
 * ──────────────────────────────────────────────────────────────────────
 */
const NOISE_FACTOR = 0.15;

// ─── Plant Profiles ─────────────────────────────────────────────────────────

/**
 * Each profile describes a distinct plant type with typical sensor ranges.
 *
 * Fields:
 *   id          – Unique slug
 *   name        – Display name
 *   emoji       – Visual emoji label
 *   healthStatus– One of: "Excellent", "Good", "Fair", "Poor", "Critical"
 *   moisture    – { min, max, typical }  Soil moisture (%)
 *   temperature – { min, max, typical }  Ambient temperature (°C)
 *   humidity    – { min, max, typical }  Relative humidity (%)
 *   light       – { min, max, typical }  Light intensity (lux)
 *   battery     – { min, max, typical }  Simulated device battery (%)
 *   npk         – { n, p, k }           Nitrogen / Phosphorus / Potassium (%)
 *   pumpMode    – "auto" | "manual"
 *
 * ──────────────────────────────────────────────────────────────────────
 * TO TRIGGER A "LOW WATER" ALERT:
 *   Change the Tomato profile moisture to:
 *     moisture: { min: 5, max: 15, typical: 10 }
 *   The default threshold is 20%, so 10% will fire a critical alert.
 *
 * TO TRIGGER A "HIGH TEMPERATURE" WARNING:
 *   Change the typical temperature to > 35:
 *     temperature: { min: 30, max: 42, typical: 38 }
 * ──────────────────────────────────────────────────────────────────────
 */
export const PLANT_PROFILES = [
  {
    id: 'tomato',
    name: 'Tomato (Solanum lycopersicum)',
    emoji: '🍅',
    healthStatus: 'Excellent',
    moisture:    { min: 55, max: 80, typical: 65 },
    temperature: { min: 20, max: 30, typical: 25 },
    humidity:    { min: 50, max: 70, typical: 60 },
    light:       { min: 500, max: 900, typical: 700 },
    battery:     { min: 70, max: 100, typical: 88 },
    npk:         { n: 10, p: 10, k: 10 },
    pumpMode:    'auto',
  },
  {
    id: 'lettuce',
    name: 'Lettuce (Lactuca sativa)',
    emoji: '🥬',
    healthStatus: 'Good',
    moisture:    { min: 60, max: 85, typical: 72 },
    temperature: { min: 15, max: 24, typical: 19 },
    humidity:    { min: 55, max: 75, typical: 65 },
    light:       { min: 300, max: 600, typical: 450 },
    battery:     { min: 60, max: 95, typical: 82 },
    npk:         { n: 12, p: 6, k: 8 },
    pumpMode:    'auto',
  },
  {
    id: 'aloe',
    name: 'Aloe Vera (Aloe barbadensis)',
    emoji: '🌵',
    healthStatus: 'Good',
    moisture:    { min: 10, max: 40, typical: 25 },
    temperature: { min: 20, max: 35, typical: 28 },
    humidity:    { min: 30, max: 50, typical: 40 },
    light:       { min: 600, max: 1000, typical: 800 },
    battery:     { min: 50, max: 90, typical: 75 },
    npk:         { n: 5, p: 10, k: 5 },
    pumpMode:    'manual',
  },
  {
    id: 'basil',
    name: 'Sweet Basil (Ocimum basilicum)',
    emoji: '🌿',
    healthStatus: 'Fair',
    // NOTE: Low moisture to demonstrate "Low Water" alerts in demo mode
    moisture:    { min: 40, max: 65, typical: 50 },
    temperature: { min: 18, max: 30, typical: 24 },
    humidity:    { min: 45, max: 70, typical: 55 },
    light:       { min: 400, max: 800, typical: 600 },
    battery:     { min: 40, max: 85, typical: 65 },
    npk:         { n: 8, p: 4, k: 6 },
    pumpMode:    'auto',
  },
  {
    id: 'strawberry',
    name: 'Strawberry (Fragaria × ananassa)',
    emoji: '🍓',
    healthStatus: 'Excellent',
    moisture:    { min: 50, max: 75, typical: 62 },
    temperature: { min: 15, max: 28, typical: 22 },
    humidity:    { min: 55, max: 80, typical: 68 },
    light:       { min: 450, max: 850, typical: 650 },
    battery:     { min: 65, max: 98, typical: 90 },
    npk:         { n: 10, p: 20, k: 20 },
    pumpMode:    'auto',
  },
];

// ─── Demo Devices ───────────────────────────────────────────────────────────

/** Simulated device IDs shown in the device selector during Demo Mode. */
export const DEMO_DEVICE_LIST = [
  'GH-A1-Tomato',
  'GH-B2-Lettuce',
  'GH-C3-Aloe',
  'GH-D4-Basil',
  'GH-E5-Strawberry',
];

/** Default demo device ID. */
export const DEMO_DEVICE_ID = DEMO_DEVICE_LIST[0];

/**
 * Maps each demo device ID to a plant profile.
 * This lets the dashboard show different plant data for each "device."
 */
export const DEMO_DEVICE_PROFILE_MAP = {
  'GH-A1-Tomato':     PLANT_PROFILES[0],
  'GH-B2-Lettuce':    PLANT_PROFILES[1],
  'GH-C3-Aloe':       PLANT_PROFILES[2],
  'GH-D4-Basil':      PLANT_PROFILES[3],
  'GH-E5-Strawberry': PLANT_PROFILES[4],
};

// ─── Helper Utilities ───────────────────────────────────────────────────────

/** Return a random float between `min` and `max`. */
const rand = (min, max) => min + Math.random() * (max - min);

/**
 * Apply Gaussian-like noise around a `typical` value.
 * The result is clamped between `min` and `max`.
 */
const noisyValue = (min, max, typical, noiseFactor = NOISE_FACTOR) => {
  const range = max - min;
  const noise = (Math.random() - 0.5) * 2 * range * noiseFactor;
  return Math.max(min, Math.min(max, typical + noise));
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Pick a random plant profile from the list.
 * @returns {object} A profile object from PLANT_PROFILES
 */
export const getRandomPlantProfile = () =>
  PLANT_PROFILES[Math.floor(Math.random() * PLANT_PROFILES.length)];

/**
 * Get the plant profile for a given demo device ID.
 * Falls back to the first profile if the device is unknown.
 * @param {string} deviceId
 * @returns {object} Plant profile
 */
export const getProfileForDevice = (deviceId) =>
  DEMO_DEVICE_PROFILE_MAP[deviceId] || PLANT_PROFILES[0];

/**
 * Generate a single "live" sensor snapshot for the given plant profile.
 *
 * The returned object matches the shape that App.jsx stores in `liveData`:
 *   { moisture, temperature, humidity, light, battery, pumpStatus, pumpMode }
 *
 * @param {object} profile — One of the PLANT_PROFILES entries
 * @returns {object} Sensor snapshot
 */
export const generateLiveSensorData = (profile) => {
  if (!profile) profile = PLANT_PROFILES[0];

  const moisture    = noisyValue(profile.moisture.min,    profile.moisture.max,    profile.moisture.typical);
  const temperature = noisyValue(profile.temperature.min, profile.temperature.max, profile.temperature.typical);
  const humidity    = noisyValue(profile.humidity.min,     profile.humidity.max,    profile.humidity.typical);
  const light       = noisyValue(profile.light.min,       profile.light.max,       profile.light.typical);
  const battery     = noisyValue(profile.battery.min,     profile.battery.max,     profile.battery.typical);

  // Pump status is derived from moisture — similar to the auto-mode logic in App.jsx
  // In demo mode the pump activates when moisture < profile's lower range + 10%
  const pumpThreshold = profile.moisture.min + (profile.moisture.max - profile.moisture.min) * 0.2;
  const pumpStatus = moisture < pumpThreshold ? 'ON' : 'OFF';

  return {
    moisture:    parseFloat(moisture.toFixed(1)),
    temperature: parseFloat(temperature.toFixed(1)),
    humidity:    parseFloat(humidity.toFixed(1)),
    light:       parseFloat(light.toFixed(0)),
    battery:     parseFloat(battery.toFixed(0)),
    pumpStatus,
    pumpMode:    profile.pumpMode || 'auto',
  };
};

/**
 * Generate a 24-hour historical data array suitable for the HistoricalChart
 * component.  Each data-point has the same shape produced by `getAllStreamData`.
 *
 * @param {object}  profile — Plant profile (defaults to Tomato)
 * @param {number}  hours   — Number of hours of history (default 24)
 * @returns {Array<object>} Sorted array of { timestamp, time, moisture, temperature, humidity, light, battery }
 */
export const generateHistoricalData = (profile, hours = 24) => {
  if (!profile) profile = PLANT_PROFILES[0];

  const now = new Date();
  const totalPoints = hours * POINTS_PER_HOUR;
  const intervalMs = (hours * 60 * 60 * 1000) / totalPoints;

  const data = [];

  for (let i = 0; i < totalPoints; i++) {
    const timestamp = new Date(now.getTime() - (totalPoints - i) * intervalMs);

    // Add a slow sinusoidal drift to simulate day/night cycles
    const hourOfDay = timestamp.getHours() + timestamp.getMinutes() / 60;
    const dayFactor = Math.sin(((hourOfDay - 6) / 24) * Math.PI * 2); // peaks at noon

    const tempShift  = dayFactor * 4;    // ±4 °C swing
    const lightShift = dayFactor * 200;  // ±200 lux swing
    const humShift   = -dayFactor * 5;   // inverse — humidity drops when hot

    data.push({
      timestamp: timestamp.toISOString(),
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      moisture:    parseFloat(noisyValue(profile.moisture.min,    profile.moisture.max,    profile.moisture.typical).toFixed(1)),
      temperature: parseFloat(noisyValue(profile.temperature.min, profile.temperature.max, profile.temperature.typical + tempShift).toFixed(1)),
      humidity:    parseFloat(noisyValue(profile.humidity.min,     profile.humidity.max,    profile.humidity.typical + humShift).toFixed(1)),
      light:       parseFloat(Math.max(0, noisyValue(profile.light.min, profile.light.max, profile.light.typical + lightShift)).toFixed(0)),
      battery:     parseFloat(noisyValue(profile.battery.min,     profile.battery.max,     profile.battery.typical - i * 0.05).toFixed(0)),
    });
  }

  return data;
};

/**
 * Mimics the shape of `getAllStreamData()` from deviceService.js.
 * Used by Dashboard.jsx when Demo Mode is active.
 *
 * @param {string} deviceId — Demo device ID
 * @returns {Promise<Array>} Resolves with chart-ready historical data
 */
export const generateMockStreamData = async (deviceId) => {
  const profile = getProfileForDevice(deviceId);
  // Simulate a small network delay for realism
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
  return generateHistoricalData(profile, 24);
};

/**
 * Simulate a pump command response.
 * Returns a resolved promise after a short delay.
 *
 * @param {string} deviceId
 * @param {string} status — "ON" | "OFF"
 * @returns {Promise<object>}
 */
export const mockUpdatePumpStatus = async (deviceId, status) => {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
  return {
    status: 'Success',
    data: { deviceId, topic: 'pmc/pump', pump: status.toLowerCase() },
  };
};

/**
 * Simulate a mode change response.
 * @param {string} deviceId
 * @param {string} mode — "auto" | "manual"
 * @returns {Promise<object>}
 */
export const mockUpdateDeviceMode = async (deviceId, mode) => {
  await new Promise((r) => setTimeout(r, 150));
  return {
    status: 'Success',
    data: { deviceId, topic: 'pmc/mode', mode },
  };
};
