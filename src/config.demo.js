/**
 * ============================================================================
 * DEMO CONFIGURATION — Agri Cop Sandbox Mode
 * ============================================================================
 *
 * This file provides "masked" demo secrets and configuration so the UI can
 * render fully without needing real credentials.
 *
 * When Demo Mode is enabled:
 *  • The Header badge shows "Connected to Demo Cloud"
 *  • The user info shows the demo email
 *  • API calls are intercepted and served from mockData.js
 *  • No real HTTP/WebSocket connections are made
 *
 * To revert to production mode, simply toggle Demo Mode OFF
 * or remove the `demo_mode` key from localStorage.
 *
 * ──────────────────────────────────────────────────────────────────────
 * MASKED SECRETS
 * These values are NOT real credentials.  They exist only to populate
 * the UI so the demo looks authentic.
 * ──────────────────────────────────────────────────────────────────────
 */

const DEMO_CONFIG = {
  // ─── Masked API credentials (never sent to a real server) ─────────
  API_KEY:       'agri-cop-demo-xxxx-1234',
  API_SECRET:    'demo-secret-xxxx-abcd-5678',
  API_BASE_URL:  'https://demo.agricop.local/api/v1/user',
  WS_URL:        'wss://demo.agricop.local/ws',

  // ─── Demo user info ───────────────────────────────────────────────
  USER_EMAIL:    'admin@agricop.io',
  USER_ID:       'demo-user-guest',
  JWT_TOKEN:     'eyJhbGciOiJERU1PIiwidHlwIjoiSldUIn0.DEMO_PAYLOAD.DEMO_SIGNATURE',
  REFRESH_TOKEN: 'demo-refresh-xxxx-0000',

  // ─── Default demo device ─────────────────────────────────────────
  DEVICE_ID:     'GH-A1-Tomato',

  // ─── Feature flags ────────────────────────────────────────────────
  /** When true, the UI shows a "Demo Cloud" badge next to the status icons */
  SHOW_DEMO_BADGE: true,

  /** Label displayed in the connection badge */
  BADGE_LABEL: '🧪 Connected to Demo Cloud',

  /** Interval (ms) at which mock live data updates in demo mode */
  LIVE_UPDATE_INTERVAL_MS: 3000,

  /** Whether to simulate occasional "critical" readings for demo purposes */
  SIMULATE_ALERTS: true,
};

export default DEMO_CONFIG;
