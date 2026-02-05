/**
 * Environment Configuration
 * Type-safe access to environment variables
 */

interface EnvConfig {
  API_BASE_URL: string;
  GOOGLE_CLIENT_ID?: string;
  ENVIRONMENT: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  /**
   * Data source mode:
   * - "mock": Use mock data only (development, when backend is not available)
   * - "backend": Use backend API only (production, when backend is available)
   */
  DATA_MODE: "mock" | "backend";
}

/**
 * Get environment configuration
 * Provides type-safe access to Vite environment variables
 */
export function getEnvConfig(): EnvConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  
  // Determine data mode from environment variable
  // VITE_DATA_MODE can be: "mock" or "backend"
  // Default: "backend" (use backend API when available, set to "mock" for development without backend)
  const dataMode = (import.meta.env.VITE_DATA_MODE || "backend") as "mock" | "backend";

  return {
    API_BASE_URL: apiBaseUrl,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    ENVIRONMENT:
      import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || "development",
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
    DATA_MODE: dataMode,
  };
}

// Export singleton instance
export const env = getEnvConfig();
