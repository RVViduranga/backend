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
}

/**
 * Get environment configuration
 * Provides type-safe access to Vite environment variables
 */
export function getEnvConfig(): EnvConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  return {
    API_BASE_URL: apiBaseUrl,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    ENVIRONMENT:
      import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || "development",
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
  };
}

// Export singleton instance
export const env = getEnvConfig();

