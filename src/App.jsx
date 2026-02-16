/**
 * ============================================================================
 * APP — Agri Cop Standalone Demo (Zero-Backend)
 * ============================================================================
 *
 * This is the root component of the plant monitoring dashboard.
 *
 * HOW IT WORKS (DEMO MODE):
 *   1. On mount, mock sensor data is generated from `mockData.js` and pumped
 *      into React state every 3 seconds to simulate a live WebSocket feed.
 *   2. When the user switches devices, the live-data interval resets with
 *      the new device's plant profile (e.g. Tomato vs Aloe).
 *   3. Historical chart data is produced by `generateMockStreamData()`.
 *   4. Pump commands and mode changes are handled locally (no HTTP calls).
 *   5. Settings (thresholds) are persisted via localStorage and take effect
 *      immediately — the sensor cards react in real-time.
 *   6. No authentication, no WebSocket, no Axios calls.
 *
 * ============================================================================
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import ErrorBoundary from './Components/ErrorBoundary';
import Header from './Components/Header';
import StatusBar from './Components/StatusBar';
import Dashboard from './Components/Dashboard';
import DeviceSettingsPage from './Components/DeviceSettingsPage';
import { useNotifications } from './Context/NotificationContext';
import DEMO_CONFIG from './config.demo';
import {
    DEMO_DEVICE_LIST,
    DEMO_DEVICE_ID,
    getProfileForDevice,
    generateLiveSensorData,
} from './Service/mockData';

function App() {
    const { addNotification } = useNotifications();

    // ── Navigation ──────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState(
        () => localStorage.getItem('activeTab') || 'dashboard',
    );

    // ── Device Selection (persisted) ────────────────────────────────────
    const [selectedDevice, setSelectedDevice] = useState(() => {
        const stored = localStorage.getItem('selectedDevice');
        if (stored && DEMO_DEVICE_LIST.includes(stored)) return stored;
        return DEMO_DEVICE_ID;
    });

    // ── Live Sensor State (updated by mock interval) ────────────────────
    const [liveData, setLiveData] = useState({
        moisture: 0,
        temperature: 0,
        humidity: 0,
        light: 0,
        battery: 0,
        pumpStatus: 'OFF',
        pumpMode: 'auto',
    });

    // Always "connected" in demo mode
    const [isConnected] = useState(true);

    // ── Settings (from localStorage — matches DeviceSettingsPage shape) ─
    const defaultSettings = () => ({
        moistureMin: '20', moistureMax: '70',
        tempMin: '10', tempMax: '35',
        humidityMin: '30', humidityMax: '80',
        lightMin: '200', lightMax: '1000',
        batteryMin: '20', autoMode: false,
    });

    const [settings, setSettings] = useState(() => {
        try {
            const raw = localStorage.getItem(`settings_${selectedDevice}`);
            return raw ? JSON.parse(raw) : defaultSettings();
        } catch {
            return defaultSettings();
        }
    });

    // ── Mock Live-Data Interval ─────────────────────────────────────────
    // Generates sensor readings every LIVE_UPDATE_INTERVAL_MS (3 s).
    // IMPORTANT: Only sensor values are updated here. pumpStatus and pumpMode
    // are exclusively controlled by the user's Settings toggles and the
    // auto-pump logic below — never overwritten by the data generator.
    useEffect(() => {
        const profile = getProfileForDevice(selectedDevice);

        const applySensorData = (data) => {
            const { moisture, temperature, humidity, light, battery } = data;
            setLiveData((prev) => ({
                ...prev,
                moisture, temperature, humidity, light, battery,
            }));
        };

        // Fire an immediate reading
        applySensorData(generateLiveSensorData(profile));

        const id = setInterval(() => {
            applySensorData(generateLiveSensorData(profile));
        }, DEMO_CONFIG.LIVE_UPDATE_INTERVAL_MS);

        return () => clearInterval(id);
    }, [selectedDevice]);

    // ── Broadcast live data for DeviceSettingsPage (uses window events) ─
    useEffect(() => {
        try {
            window.__latestLiveData = liveData;
            window.dispatchEvent(new CustomEvent('live:update', { detail: liveData }));
        } catch (_) { /* ignored */ }
    }, [liveData]);

    // ── Persist activeTab ───────────────────────────────────────────────
    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    // ── Persist device selection ────────────────────────────────────────
    useEffect(() => {
        if (selectedDevice) localStorage.setItem('selectedDevice', selectedDevice);
    }, [selectedDevice]);

    // ── Reload settings when device changes ─────────────────────────────
    useEffect(() => {
        try {
            const raw = localStorage.getItem(`settings_${selectedDevice}`);
            setSettings(raw ? JSON.parse(raw) : defaultSettings());
        } catch (_) { /* ignored */ }
    }, [selectedDevice]);

    // ── Listen for settings saved from DeviceSettingsPage ───────────────
    useEffect(() => {
        const onSettingsUpdated = (e) => {
            if (e?.detail?.deviceId !== selectedDevice) return;
            try {
                const raw = localStorage.getItem(`settings_${selectedDevice}`);
                if (raw) setSettings(JSON.parse(raw));
            } catch (_) { /* ignored */ }
        };
        window.addEventListener('settings:updated', onSettingsUpdated);
        return () => window.removeEventListener('settings:updated', onSettingsUpdated);
    }, [selectedDevice]);

    // ── Listen for pump commands from DeviceSettingsPage ─────────────────
    useEffect(() => {
        const onPumpChange = (e) => {
            if (e?.detail?.deviceId !== selectedDevice) return;
            setLiveData((prev) => ({
                ...prev,
                pumpStatus: e.detail.status,
                pumpMode: 'manual',
            }));
        };
        window.addEventListener('pump:change', onPumpChange);
        return () => window.removeEventListener('pump:change', onPumpChange);
    }, [selectedDevice]);

    // ── Listen for mode changes from DeviceSettingsPage ─────────────────
    useEffect(() => {
        const onModeChange = (e) => {
            if (e?.detail?.deviceId !== selectedDevice) return;
            setLiveData((prev) => ({
                ...prev,
                pumpMode: e.detail.mode,
            }));
        };
        window.addEventListener('mode:change', onModeChange);
        return () => window.removeEventListener('mode:change', onModeChange);
    }, [selectedDevice]);

    // ── Notify on critical sensor transitions ───────────────────────────
    const _prevLive = useRef(null);
    useEffect(() => {
        try {
            const prev = _prevLive.current || {};
            const curr = liveData || {};

            let persisted = null;
            try {
                const raw = localStorage.getItem(`settings_${selectedDevice}`);
                if (raw) persisted = JSON.parse(raw).thresholds || null;
            } catch (_) { /* ignored */ }

            const isCritical = (key, value) => {
                if (value == null || String(value) === 'unknown') return false;
                const num = Number(value);
                if (Number.isNaN(num)) return false;
                const group = persisted?.[key];
                const min = group?.min != null ? Number(group.min) : undefined;
                const max = group?.max != null ? Number(group.max) : undefined;
                if (min != null && !Number.isNaN(min) && num < min) return true;
                if (max != null && !Number.isNaN(max) && num > max) return true;
                return false;
            };

            ['moisture', 'temperature', 'humidity', 'light', 'battery'].forEach((s) => {
                if (!isCritical(s, prev[s]) && isCritical(s, curr[s]) && _prevLive.current !== null) {
                    try {
                        addNotification({
                            type: 'critical',
                            message: `Critical: ${s.charAt(0).toUpperCase() + s.slice(1)} reading is ${curr[s]}`,
                            timestamp: new Date().toISOString(),
                            meta: { deviceId: selectedDevice, sensor: s, value: curr[s] },
                        });
                    } catch (_) { /* ignored */ }
                }
            });
        } catch (_) { /* ignored */ }
        finally { _prevLive.current = liveData; }
    }, [liveData, selectedDevice, addNotification]);

    // ── Auto-Pump Logic (local only) ────────────────────────────────────
    const _lastAuto = useRef({ cmd: null, ts: 0 });
    const _lastManualNotify = useRef(0);

    useEffect(() => {
        if (!settings || !selectedDevice) return;
        const raw = liveData?.moisture;
        if (raw == null) return;
        const val = Number(raw);
        if (!isFinite(val)) return;

        let min = parseFloat(settings.moistureMin);
        if (isNaN(min)) min = 20;
        const moistureLow = val < min;

        if (settings.autoMode) {
            const desired = moistureLow ? 'ON' : 'OFF';
            const now = Date.now();
            if (_lastAuto.current.cmd === desired && now - _lastAuto.current.ts < 5000) return;
            if ((liveData?.pumpStatus || '').toUpperCase() === desired) return;

            // Local-only pump update
            setLiveData((prev) => ({ ...prev, pumpStatus: desired, pumpMode: 'auto' }));
            _lastAuto.current = { cmd: desired, ts: Date.now() };
            return;
        }

        if (moistureLow) {
            const now = Date.now();
            if (now - _lastManualNotify.current < 60_000) return;
            if ((liveData?.pumpStatus || '').toUpperCase() === 'ON') return;
            _lastManualNotify.current = now;
            addNotification({
                type: 'warning',
                message: `Moisture is low (${val}%). Please turn on the pump manually from Settings.`,
                timestamp: new Date().toISOString(),
                meta: { deviceId: selectedDevice, sensor: 'moisture', value: val, threshold: min },
            });
        }
    }, [settings?.autoMode, settings?.moistureMin, liveData?.moisture, selectedDevice, liveData?.pumpStatus, addNotification]);

    // ── Render ──────────────────────────────────────────────────────────
    return (
        <ErrorBoundary>
            <div className="App">
                <Header
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    selectedDevice={selectedDevice}
                    setSelectedDevice={setSelectedDevice}
                    isConnected={isConnected}
                />

                <StatusBar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main content — padding accounts for fixed Header + Nav */}
                <main className="w-full pt-[100px] landscape:pt-[104px] sm:pt-[116px] md:pt-[128px]">
                    {activeTab === 'dashboard' ? (
                        <Dashboard
                            deviceId={selectedDevice}
                            liveData={liveData}
                            setLiveData={setLiveData}
                            settings={settings}
                            isConnected={isConnected}
                        />
                    ) : (
                        <DeviceSettingsPage deviceId={selectedDevice} />
                    )}
                </main>
            </div>
        </ErrorBoundary>
    );
}

export default App;
