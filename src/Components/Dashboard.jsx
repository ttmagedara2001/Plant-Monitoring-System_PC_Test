import React, { useState, useEffect } from 'react';
import {
    generateMockStreamData,
    mockUpdatePumpStatus,
    mockUpdateDeviceMode,
} from '../Service/mockData';

import SensorStatusIndicator from './SensorStatusIndicator';
import HistoricalChart from './HistoricalChartTest';
import PageHeader from './PageHeader';
import SeasonalEffects from './SeasonalEffects';
import { LayoutDashboard } from 'lucide-react';

const Dashboard = ({
    deviceId: propDeviceId,
    liveData: propLiveData,
    setLiveData,
    settings: propSettings,
    isConnected: propIsConnected,
}) => {
    const deviceId = propDeviceId || 'GH-A1-Tomato';
    const liveData = propLiveData || {
        moisture: 0, temperature: 0, humidity: 0, light: 0, battery: 0,
        pumpStatus: 'OFF', pumpMode: 'manual',
    };
    const settings = propSettings || {
        moistureMin: '20', moistureMax: '70',
        tempMin: '10', tempMax: '35',
        humidityMin: '30', humidityMax: '80',
        lightMin: '200', lightMax: '1000',
        batteryMin: '20', autoMode: false,
    };

    // ── Historical Data ─────────────────────────────────────────────────
    const [historicalData, setHistoricalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoadingChart, setIsLoadingChart] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [dataFetchError] = useState(null);

    const [timeRange, setTimeRange] = useState(() => {
        const saved = localStorage.getItem(`timeRange_${deviceId}`);
        return saved || '24h';
    });
    const [dataInterval, setDataInterval] = useState(() => {
        const saved = localStorage.getItem(`dataInterval_${deviceId}`);
        return saved || 'auto';
    });

    // ── Fetch historical data when device changes ───────────────────────
    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            setIsLoadingChart(true);
            try {
                const data = await generateMockStreamData(deviceId);
                if (!cancelled) {
                    setHistoricalData(data);
                }
            } catch (error) {
                console.error('Failed to load historical data:', error);
                if (!cancelled) setHistoricalData([]);
            } finally {
                if (!cancelled) setIsLoadingChart(false);
            }
        };
        fetchData();
        const refreshId = setInterval(fetchData, 30000);
        return () => { cancelled = true; clearInterval(refreshId); };
    }, [deviceId]);

    // ── Reset view state when device changes ────────────────────────────
    useEffect(() => {
        setHistoricalData([]);
        setFilteredData([]);
        const savedTimeRange = localStorage.getItem(`timeRange_${deviceId}`);
        const savedInterval = localStorage.getItem(`dataInterval_${deviceId}`);
        setTimeRange(savedTimeRange || '24h');
        setDataInterval(savedInterval || 'auto');
    }, [deviceId]);

    // ── Sensor Status Logic ─────────────────────────────────────────────
    const getSensorStatus = (key) => {
        try {
            const raw = liveData?.[key];
            if (raw === undefined || raw === null) return 'critical';
            const val = Number(raw);
            if (!isFinite(val)) return 'critical';

            const FALLBACK = {
                moistureMin: 20, moistureMax: 70, tempMin: 10, tempMax: 35,
                humidityMin: 30, humidityMax: 80, lightMin: 200, lightMax: 1000, batteryMin: 20,
            };
            let min = NaN, max = NaN;
            switch (key) {
                case 'moisture':
                    min = parseFloat(settings.moistureMin); max = parseFloat(settings.moistureMax);
                    if (isNaN(min)) min = FALLBACK.moistureMin; if (isNaN(max)) max = FALLBACK.moistureMax; break;
                case 'temperature':
                    min = parseFloat(settings.tempMin); max = parseFloat(settings.tempMax);
                    if (isNaN(min)) min = FALLBACK.tempMin; if (isNaN(max)) max = FALLBACK.tempMax; break;
                case 'humidity':
                    min = parseFloat(settings.humidityMin); max = parseFloat(settings.humidityMax);
                    if (isNaN(min)) min = FALLBACK.humidityMin; if (isNaN(max)) max = FALLBACK.humidityMax; break;
                case 'light':
                    min = parseFloat(settings.lightMin); max = parseFloat(settings.lightMax);
                    if (isNaN(min)) min = FALLBACK.lightMin; if (isNaN(max)) max = FALLBACK.lightMax; break;
                case 'battery':
                    min = parseFloat(settings.batteryMin);
                    if (isNaN(min)) min = FALLBACK.batteryMin; max = 100; break;
                default: break;
            }
            if (!isNaN(min) && val === min) return 'warning';
            if (!isNaN(max) && val === max) return 'warning';
            if (!isNaN(min) && val < min) return 'critical';
            if (!isNaN(max) && val > max) return 'critical';
            return 'normal';
        } catch (e) { return 'critical'; }
    };

    // ── Time Range / Interval Handlers ──────────────────────────────────
    const handleTimeRangeChange = (newRange) => {
        setTimeRange(newRange);
        localStorage.setItem(`timeRange_${deviceId}`, newRange);
        const intervalMap = {
            '1min': '1min', '5min': '1min', '15min': '1min', '30min': '5min',
            '1h': '5min', '3h': '15min', '6h': '30min', '12h': '30min', '24h': '1h',
        };
        const newInterval = intervalMap[newRange] || 'auto';
        setDataInterval(newInterval);
        localStorage.setItem(`dataInterval_${deviceId}`, newInterval);
    };

    const handleDataIntervalChange = (newInterval) => {
        setDataInterval(newInterval);
        localStorage.setItem(`dataInterval_${deviceId}`, newInterval);
    };

    // ── CSV Export ──────────────────────────────────────────────────────
    const handleExportCSV = async (selectedSensors = null) => {
        setIsExporting(true);
        try {
            const dataToExport = filteredData.length > 0 ? filteredData : historicalData;
            if (dataToExport.length === 0) { alert('No data available to export.'); return; }
            const allSensors = ['moisture', 'temperature', 'humidity', 'light', 'battery'];
            const sensorsToExport = selectedSensors?.length > 0
                ? selectedSensors.filter((s) => allSensors.includes(s)) : allSensors;
            const headers = ['time', ...sensorsToExport].join(',');
            const rows = dataToExport.map((d) => {
                const rowData = [d.time];
                sensorsToExport.forEach((s) => rowData.push(d[s] ?? ''));
                return rowData.join(',');
            }).join('\n');
            const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `agricop_${deviceId}_report.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) { console.error('Export failed', e); }
        finally { setIsExporting(false); }
    };

    const pumpStatus = liveData?.pumpStatus || 'OFF';

    // ── Render ──────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f0f4f8] p-2 sm:p-4 font-sans text-gray-800 overflow-x-hidden">
            <SeasonalEffects />

            <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
                <PageHeader
                    title="Dashboard"
                    subtitle="Real-time sensor readings, charts, and controls."
                    deviceId={deviceId}
                    icon={<LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />}
                />
            </div>

            {/* Sensor Cards */}
            <div className="w-full mx-auto px-1 sm:px-0 mb-4 sm:mb-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 mb-3 sm:mb-4">
                        <SensorStatusIndicator label="Soil Moisture" value={liveData?.moisture} unit="%" decimals={1} status={getSensorStatus('moisture')} />
                        <SensorStatusIndicator label="Temperature" value={liveData?.temperature} unit="°C" decimals={1} status={getSensorStatus('temperature')} />
                        <SensorStatusIndicator label="Humidity" value={liveData?.humidity} unit="%" decimals={1} status={getSensorStatus('humidity')} />
                        <SensorStatusIndicator label="Light" value={liveData?.light} unit=" lux" decimals={0} status={getSensorStatus('light')} />
                        <SensorStatusIndicator label="Battery" value={liveData?.battery} unit="%" decimals={0} status={getSensorStatus('battery')} />
                    </div>
                </div>

                {/* Pump Status Banner */}
                <div className={`w-full max-w-7xl mx-auto rounded-lg sm:rounded-xl py-2 sm:py-3 text-center border transition-colors duration-500 shadow-sm ${pumpStatus === 'ON' ? 'bg-green-100 border-green-300 text-green-900' : 'bg-blue-100 border-blue-300 text-blue-900'
                    }`}>
                    <h2 className="text-base sm:text-lg font-semibold">
                        Pump: {pumpStatus} <span className="text-sm font-normal">({settings?.autoMode ? 'auto' : 'manual'})</span>
                    </h2>
                </div>
            </div>

            {/* Historical Trends */}
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center px-1 sm:px-0">
                <div className="w-full flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-indigo-50 text-indigo-600 rounded-lg p-1.5 sm:p-2 md:p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V9m6 8V5m-3 12V13" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Historical Trends</h2>
                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Visualize sensor data over time</p>
                    </div>
                </div>

                <div className="w-full">
                    <HistoricalChart
                        chartData={historicalData}
                        isLoading={isLoadingChart}
                        onExportCSV={handleExportCSV}
                        isExporting={isExporting}
                        dataSource="HTTP API"
                        error={dataFetchError}
                        timeRange={timeRange}
                        dataInterval={dataInterval}
                        onTimeRangeChange={handleTimeRangeChange}
                        onDataIntervalChange={handleDataIntervalChange}
                        allData={historicalData}
                        onFilteredDataChange={setFilteredData}
                        hideTitle={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
