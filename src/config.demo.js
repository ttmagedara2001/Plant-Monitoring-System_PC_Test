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

// ---------------------------------------------------------------------------
// Environment-variable helpers
// ---------------------------------------------------------------------------
// In production (Vercel) set VITE_API_URL in the Vercel dashboard if you ever
// want to point the app at a real backend.  Leave it unset to stay in full
// demo mode — safe to ship publicly with no credentials.
// ---------------------------------------------------------------------------
const _envApiUrl = import.meta.env?.VITE_API_URL;

const DEMO_CONFIG = {
  // ─── Masked API credentials (never sent to a real server) ─────────────────
  API_KEY: "agri-cop-demo-xxxx-1234",
  API_SECRET: "demo-secret-xxxx-abcd-5678",
  // Reads from VITE_API_URL env var if defined; otherwise uses the safe
  // .local placeholder so no real HTTP requests are ever dispatched.
  API_BASE_URL: _envApiUrl ?? "https://demo.agricop.local/api/v1/user",
  WS_URL: "wss://demo.agricop.local/ws",

  // ─── Demo user info ───────────────────────────────────────────────
  USER_EMAIL: "admin@agricop.io",
  USER_ID: "demo-user-guest",
  JWT_TOKEN: "eyJhbGciOiJERU1PIiwidHlwIjoiSldUIn0.DEMO_PAYLOAD.DEMO_SIGNATURE",
  REFRESH_TOKEN: "demo-refresh-xxxx-0000",

  // ─── Default demo device ─────────────────────────────────────────
  DEVICE_ID: "GH-A1-Tomato",

  // ─── Feature flags ────────────────────────────────────────────────
  /** When true, the UI shows a "Demo Cloud" badge next to the status icons */
  SHOW_DEMO_BADGE: true,

  /** Label displayed in the connection badge */
  BADGE_LABEL: "🧪 Connected to Demo Cloud",

  /** Interval (ms) at which mock live data updates in demo mode */
  LIVE_UPDATE_INTERVAL_MS: 3000,

  /** Whether to simulate occasional "critical" readings for demo purposes */
  SIMULATE_ALERTS: true,
};

export default DEMO_CONFIG;
