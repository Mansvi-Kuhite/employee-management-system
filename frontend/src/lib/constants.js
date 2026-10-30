export const APP_NAME = "EMS Portal";

export const IDLE_TIMEOUT_MS =
  (Number(import.meta.env.VITE_IDLE_MINUTES) || 15) * 60 * 1000;

export const WARNING_MS = Math.min(60 * 1000, IDLE_TIMEOUT_MS / 2);