/**
 * ============================================================================
 * HEADER — Plant Monitoring System
 * ============================================================================
 *
 * Two-tier fixed header:
 *
 *  ┌─────────────────────────────────────────────────────────┐  ← Brand Bar
 *  │  [Protonest Logo + Go Back]  [Title ▼]  [View Full Code]│  88 px, #060B26
 *  ├─────────────────────────────────────────────────────────┤  border #5530FA
 *  │              AgriCop functional header                   │  existing white
 *  └─────────────────────────────────────────────────────────┘
 *
 * ============================================================================
 */

import React, { useRef, useState, useEffect } from 'react';
import {
    Sprout, LogOut, Wifi, Radio, Server,
    LayoutDashboard, Settings, AlertTriangle, AlertCircle, Bell, ChevronDown,
} from 'lucide-react';
import { useNotifications } from '../Context/NotificationContext';
import { DEMO_DEVICE_LIST } from '../Service/mockData';
import DEMO_CONFIG from '../config.demo';
import protonestLogo from '../assets/images/logo.avif';
import plantLogo from '../assets/images/logo_plant.png';

// ─── Brand Bar ───────────────────────────────────────────────────────────────

/**
 * BrandBar — The top-most 88 px sticky stripe matching the Figma spec.
 *
 * • Background : solid #060B26
 * • Bottom border: 1 px #5530FA
 * • Left   : Protonest logo  +  "Go Back To Website" link
 * • Center : "Plant Monitoring Systems" title with dropdown chevron
 * • Right  : "View Full Code" frosted-glass button
 */
const BrandBar = () => {
    const [titleOpen, setTitleOpen] = useState(false);

    return (
        <div
            className="w-full flex items-center justify-between px-6 md:px-10"
            style={{
                position: 'relative',   /* own stacking context → dropdown renders above AgriCop tier */
                zIndex: 300,
                height: '88px',
                backgroundColor: '#060B26',
                borderBottom: '1px solid #5530FA',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
            }}
        >
            {/* ── Left: Protonest logo + back link ── */}
            <div className="flex items-center min-w-[160px]">
                <a
                    href="https://protonestconnect.co/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 group"
                    aria-label="Protonest — Go back to website"
                >
                    {/* Protonest M-logo */}
                    <img
                        src={protonestLogo}
                        alt="Protonest logo"
                        className="h-10 w-10 object-contain flex-shrink-0 transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Back label — single line, matching Figma spec */}
                    <span
                        className="text-white/80 group-hover:text-white transition-colors duration-200 whitespace-nowrap"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: '12px',
                            fontWeight: 400,
                        }}
                    >
                        ‹ Go Back To Website
                    </span>
                </a>
            </div>

            {/* ── Center: Title with dropdown chevron ── */}
            <div className="flex-1 flex justify-center">
                <button
                    onClick={() => setTitleOpen(v => !v)}
                    className="flex items-center gap-2 group px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A48FFF]"
                    aria-expanded={titleOpen}
                    aria-haspopup="listbox"
                    id="pms-title-btn"
                >
                    <span
                        className="text-white select-none"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: '20px',
                            fontWeight: 500,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Plant Monitoring Systems
                    </span>
                    <ChevronDown
                        className={`w-5 h-5 text-white/70 group-hover:text-white transition-all duration-300 ${titleOpen ? 'rotate-180 text-[#A48FFF]' : ''}`}
                    />
                </button>

                {/* Drop-down flyout — z-[200] so it renders above the white AgriCop header */}
                {titleOpen && (
                    <div
                        className="absolute top-[88px] left-1/2 -translate-x-1/2 z-[200] mt-1 w-72 rounded-xl shadow-2xl overflow-hidden"
                        style={{
                            background: 'rgba(6, 11, 38, 0.97)',
                            border: '1px solid rgba(85, 48, 250, 0.5)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-[#A48FFF] text-xs font-semibold uppercase tracking-widest">Switch System</p>
                        </div>
                        {[
                            {
                                label: 'Plant Monitoring System',
                                href: 'https://ambitious-bay-0d5177503.4.azurestaticapps.net/',
                                active: true,
                            },
                            {
                                label: 'Factory Management System',
                                href: 'https://witty-grass-0d4e8e603.6.azurestaticapps.net/',
                                active: false,
                            },
                            {
                                label: 'Fleet Management System',
                                href: 'https://gentle-flower-091576403.6.azurestaticapps.net/',
                                active: false,
                            },
                        ].map(({ label, href, active }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className={`w-full text-left px-4 py-3.5 text-sm transition-all duration-150 flex items-center gap-3 border-b border-white/5 last:border-0 ${active ? 'text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                                onClick={() => setTitleOpen(false)}
                            >
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? 'bg-[#A48FFF]' : 'bg-[#5530FA]'}`} />
                                <span className="flex-1">{label}</span>
                                {active && (
                                    <span className="text-[10px] font-semibold text-[#A48FFF] uppercase tracking-wider bg-[#A48FFF]/10 px-1.5 py-0.5 rounded">
                                        current
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Right: "View Full Code" button ── */}
            <div className="flex items-center justify-end min-w-[160px]">
                <a
                    href="https://github.com/ttmagedara2001/Plant-Monitoring-System_PC_Test"
                    target="_blank"
                    rel="noreferrer"
                    id="view-full-code-btn"
                    className="view-full-code-btn inline-flex items-center justify-center font-semibold text-white rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A48FFF]"
                    style={{
                        width: '150px',
                        height: '36px',
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: '14px',
                        fontWeight: 600,
                        background: 'rgba(164, 143, 255, 0.12)',
                        border: '1px solid rgba(164, 143, 255, 0.3)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        borderRadius: '8px',
                    }}
                >
                    View Full Code
                </a>
            </div>
        </div>
    );
};

// ─── Functional AgriCop Header Strip ─────────────────────────────────────────

const Header = ({
    activeTab,
    setActiveTab,
    selectedDevice,
    setSelectedDevice,
    isConnected: propIsConnected,
}) => {
    const connected = typeof propIsConnected !== 'undefined' ? !!propIsConnected : true;

    const wsStatus = connected ? 'green' : 'red';
    const mqttStatus = connected ? 'green' : 'red';
    const sysStatus = connected ? 'green' : 'yellow';

    const statusText = { green: 'Online', yellow: 'Limited', red: 'Offline' };

    const statusIconEl = (status, Icon, label) => {
        const color = status === 'green' ? 'text-green-500' : status === 'yellow' ? 'text-yellow-500' : 'text-red-500';
        return (
            <div className="relative group flex items-center">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="sr-only">{label}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity duration-200">
                    {label}: {statusText[status]}
                </div>
            </div>
        );
    };

    const userId = DEMO_CONFIG.USER_EMAIL;
    const deviceListLocal = DEMO_DEVICE_LIST;
    const currentDevice = selectedDevice || deviceListLocal[0];

    const handleDeviceSelect = (e) => {
        const newDevice = e.target.value;
        localStorage.setItem('selectedDevice', newDevice);
        if (typeof setSelectedDevice === 'function') setSelectedDevice(newDevice);
    };

    const [mobileOpen, setMobileOpen] = useState(false);
    const mobileRef = useRef();

    useEffect(() => {
        const onDoc = (e) => {
            if (!mobileRef.current) return;
            if (!mobileRef.current.contains(e.target)) setMobileOpen(false);
        };
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ── Tier 1: Brand Bar (Figma spec) ── */}
            <BrandBar />

            {/* ── Tier 2: AgriCop functional header ── */}
            <div className="relative flex justify-center px-1 sm:px-2 md:px-4 pt-1 sm:pt-2">
                <div className="w-full sm:w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-7xl px-2 sm:px-4 md:px-7 bg-white border-2 rounded-lg py-1.5 sm:py-2 flex flex-col sm:flex-row justify-between items-center shadow-md">

                    {/* Mobile bar */}
                    <div className="w-full flex items-center justify-between sm:hidden">
                        <div className="flex items-center gap-1.5">
                            <button aria-label="Open menu" onClick={() => setMobileOpen((v) => !v)} className="p-1 rounded-md hover:bg-gray-100">
                                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <div className="flex items-center gap-1">
                                <img src={plantLogo} alt="AgriCop logo" className="h-4 w-4 object-contain" />
                                <span className="text-sm sm:text-base font-bold tracking-wide font-mono">Agri<span className="text-yellow-400">Cop</span></span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                                <Wifi className={`w-3.5 h-3.5 ${connected ? 'text-green-500' : 'text-red-500'}`} />
                            </div>
                            <NotificationsBell selectedDevice={currentDevice} />
                        </div>
                    </div>

                    {/* Mobile menu panel */}
                    {mobileOpen && (
                        <div ref={mobileRef} className="sm:hidden absolute left-2 right-2 top-14 bg-white border rounded-lg shadow-lg z-50 px-3 py-3 max-h-[80vh] overflow-y-auto">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between pb-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <Sprout className="h-5 w-5 text-green-600" />
                                        <div className="font-semibold text-sm">AgriCop Menu</div>
                                    </div>
                                    <button onClick={() => setMobileOpen(false)} className="text-gray-500 text-sm px-2 py-1 hover:bg-gray-100 rounded">✕</button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => { setMobileOpen(false); typeof setActiveTab === 'function' && setActiveTab('dashboard'); }} className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-green-100 text-green-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                    </button>
                                    <button onClick={() => { setMobileOpen(false); typeof setActiveTab === 'function' && setActiveTab('settings'); }} className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'settings' ? 'bg-green-100 text-green-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Select Device</label>
                                    <select value={currentDevice || ''} onChange={handleDeviceSelect} className="w-full mt-1 bg-white border border-green-300 text-gray-700 py-2.5 px-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm">
                                        {deviceListLocal.map((dev) => <option key={dev} value={dev}>{dev}</option>)}
                                    </select>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-xs text-gray-600">{connected ? 'Connected' : 'Disconnected'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="text-xs text-gray-600 truncate max-w-[60%]">User: {userId}</div>
                                    <button onClick={() => window.location.reload()} className="text-red-500 text-sm flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded">
                                        <LogOut className="w-3 h-3" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop: Logo + User */}
                    <div className="hidden sm:flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                            <img src={plantLogo} alt="AgriCop plant logo" className="h-7 w-7 object-contain" />
                            <span className="text-2xl font-bold tracking-wide font-mono">
                                Agri<span className="text-yellow-400">Cop</span>
                            </span>
                        </div>
                        <div className="text-left text-xs ml-4">
                            <div className="text-green-600 font-bold">Authentication: Successful</div>
                            <div className="text-gray-600 font-mono">User: {userId}</div>
                            <button onClick={() => window.location.reload()} className="text-red-500 mt-1 flex items-center gap-1">
                                Logout <LogOut className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop: Device Selector */}
                    <div className="hidden sm:flex flex-1 justify-center items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">Select Device:</span>
                            <select value={currentDevice || ''} onChange={handleDeviceSelect} className="bg-white border border-green-300 text-gray-700 py-1 px-2 rounded focus:ring-2 focus:ring-green-500 outline-none font-medium text-sm">
                                {deviceListLocal.map((dev) => <option key={dev} value={dev}>{dev}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Desktop: Connection Status */}
                    <div className="hidden sm:flex items-center gap-4 ml-6">
                        {statusIconEl(wsStatus, Wifi, 'WebSocket')}
                        {statusIconEl(mqttStatus, Radio, 'MQTT')}
                        {statusIconEl(sysStatus, Server, 'System')}
                    </div>

                    {/* Desktop: Notifications Bell */}
                    <div className="hidden sm:flex items-center gap-4 ml-8">
                        <NotificationsBell selectedDevice={currentDevice} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns a human-readable relative timestamp, e.g. "3 min ago". */
const relativeTime = (iso) => {
    try {
        const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
        return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch { return ''; }
};

/** Per-type visual config — icon, colours, accent border colour. */
const TYPE_CONFIG = {
    critical: {
        icon: <AlertTriangle className="w-4 h-4" />,
        iconBg: 'bg-red-100 text-red-600',
        border: 'border-l-red-500',
        bg: 'bg-red-50',
        label: 'Critical',
        labelCls: 'bg-red-100 text-red-700',
        textCls: 'text-red-800',
    },
    warning: {
        icon: <AlertCircle className="w-4 h-4" />,
        iconBg: 'bg-amber-100 text-amber-600',
        border: 'border-l-amber-500',
        bg: 'bg-amber-50',
        label: 'Warning',
        labelCls: 'bg-amber-100 text-amber-700',
        textCls: 'text-amber-800',
    },
    info: {
        icon: <Bell className="w-4 h-4" />,
        iconBg: 'bg-blue-100 text-blue-600',
        border: 'border-l-blue-400',
        bg: 'bg-blue-50',
        label: 'Info',
        labelCls: 'bg-blue-100 text-blue-700',
        textCls: 'text-blue-800',
    },
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.info;

// ─── NotificationsBell ────────────────────────────────────────────────────────

const NotificationsBell = ({ selectedDevice }) => {
    const { notifications, markRead, clearAll } = useNotifications();
    const [open, setOpen] = React.useState(false);
    const ref = useRef();

    React.useEffect(() => {
        const onDoc = (e) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    const visible = notifications.filter((n) => {
        const did = n.meta && n.meta.deviceId ? n.meta.deviceId : null;
        return did === null || did === selectedDevice;
    });
    const unread = visible.filter((n) => !n.read).length;

    const handleMarkAllRead = () => {
        visible.filter((n) => !n.read).forEach((n) => markRead(n.id));
    };

    return (
        <div className="relative" ref={ref}>
            {/* ── Bell trigger ── */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={open}
                title="Notifications"
                className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150
                    ${open
                        ? 'bg-yellow-50 text-yellow-500 shadow-inner ring-2 ring-yellow-300'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-yellow-500'
                    }`}
            >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full ring-2 ring-white">
                        {unread > 99 ? '99+' : unread}
                    </span>
                )}
            </button>

            {/* ── Panel ── */}
            {open && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col"
                    style={{ maxHeight: '520px', minWidth: '320px' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                            {unread > 0 && (
                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
                                    {unread} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unread > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => clearAll(selectedDevice)}
                                className="text-xs text-gray-400 hover:text-red-500 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition"
                            >
                                Clear all
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <ul className="overflow-y-auto flex-1 divide-y divide-gray-50">
                        {visible.length === 0 ? (
                            <li className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">All caught up!</p>
                                    <p className="text-xs text-gray-400 mt-0.5">No alerts for this device.</p>
                                </div>
                            </li>
                        ) : (
                            visible.map((n) => {
                                const cfg = getTypeConfig(n.type);
                                return (
                                    <li
                                        key={n.id}
                                        className={`flex items-start gap-3 px-4 py-3 border-l-4 transition-colors duration-150
                                            ${n.read ? 'bg-white border-l-gray-200' : `${cfg.bg} ${cfg.border}`}`}
                                    >
                                        {/* Type icon */}
                                        <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${cfg.iconBg}`}>
                                            {cfg.icon}
                                        </div>

                                        {/* Body */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${n.read ? 'bg-gray-100 text-gray-500' : cfg.labelCls}`}>
                                                    {cfg.label}
                                                </span>
                                                {!n.read && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className={`text-xs font-medium leading-snug ${n.read ? 'text-gray-600' : cfg.textCls}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {relativeTime(n.timestamp)}
                                            </p>
                                        </div>

                                        {/* Mark read */}
                                        {!n.read && (
                                            <button
                                                onClick={() => markRead(n.id)}
                                                title="Mark as read"
                                                className="flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition"
                                            >
                                                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                                    <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    {/* Footer */}
                    {visible.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                            <span className="text-[10px] text-gray-400">
                                {visible.length} alert{visible.length !== 1 ? 's' : ''} · {unread} unread
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
