/**
 * API configuration for KshetraMind.
 * Reads VITE_API_BASE_URL from environment variables in production (e.g. Render / Railway backend),
 * and defaults to empty string for local dev (relying on Vite proxy).
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '';
