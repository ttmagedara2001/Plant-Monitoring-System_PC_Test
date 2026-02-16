/**
 * ============================================================================
 * MAIN ENTRY POINT — Agri Cop Standalone Demo
 * ============================================================================
 *
 * Zero-backend demo mode.  No auth providers, no router needed.
 * The app boots directly into a fully functional demo dashboard.
 *
 * The NotificationProvider is the only context because alerts still work
 * locally (they are computed from mock live data vs. thresholds).
 * ============================================================================
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationProvider } from './Context/NotificationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <NotificationProvider>
        <App />
    </NotificationProvider>
);
