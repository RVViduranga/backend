/**
 * Production-safe logging utility
 * Only logs in development mode to avoid console pollution in production
 */

type LogLevel = "log" | "warn" | "error" | "info" | "debug";

const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, but in production send to error tracking service
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, send to error tracking service (e.g., Sentry, LogRocket)
      // Example: errorTrackingService.captureException(args[0]);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};







