/**
 * MobilePortraitSideNav — Fixed left icon-rail shown only in portrait mobile.
 *
 * Provides Dashboard / Settings navigation for portrait mobile screens.
 * Hidden on landscape mobile and all sm+ (tablet/desktop) screens.
 */
import React from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';

const MobilePortraitSideNav = ({ activeTab, setActiveTab }) => {
    return (
        <aside
            className="portrait-side-nav fixed left-0 flex-col items-center z-40 gap-2 py-4 hidden"
            style={{
                /* top is set via CSS to match the dynamic header height */
                top: '116px',
                bottom: 0,
                width: '56px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e5e7eb',
                boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
            }}
        >
            {/* Dashboard nav item */}
            <button
                onClick={() => typeof setActiveTab === 'function' && setActiveTab('dashboard')}
                className={`flex flex-col items-center justify-center w-[44px] h-[52px] rounded-xl gap-1 transition-all duration-150 ${
                    activeTab === 'dashboard'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
                aria-label="Dashboard"
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span
                    style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        lineHeight: 1,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        letterSpacing: '0.01em',
                    }}
                >
                    Dash
                </span>
            </button>

            {/* Settings nav item */}
            <button
                onClick={() => typeof setActiveTab === 'function' && setActiveTab('settings')}
                className={`flex flex-col items-center justify-center w-[44px] h-[52px] rounded-xl gap-1 transition-all duration-150 ${
                    activeTab === 'settings'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
                aria-label="Settings"
                aria-current={activeTab === 'settings' ? 'page' : undefined}
            >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span
                    style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        lineHeight: 1,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        letterSpacing: '0.01em',
                    }}
                >
                    Stgs
                </span>
            </button>

            {/* Active indicator bar */}
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full transition-all duration-300"
                style={{
                    background: 'linear-gradient(to bottom, #3b82f6, #06b6d4)',
                    opacity: 0.7,
                }}
            />
        </aside>
    );
};

export default MobilePortraitSideNav;
