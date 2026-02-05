/**
 * Analytics Service
 * Handles platform statistics, analytics, and marketing data
 *
 * ARCHITECTURE:
 * - MOCK MODE (default): Uses mock data only (set VITE_DATA_MODE=mock)
 * - BACKEND MODE: Uses backend API only (set VITE_DATA_MODE=backend)
 *
 * DATA MODE CONFIGURATION:
 * Set VITE_DATA_MODE in .env file:
 * - "mock" (default): Use mock data only (when backend is not available)
 * - "backend": Use backend API only (when backend is available)
 */
import apiClient from "./api-client";
import { API_ENDPOINTS } from "@/constants";
import { env } from "@/config/env";
import { PLATFORM_STATISTICS } from "@/mocks/analytics.mock";
import { logger } from "@/lib/logger";
import type { PlatformStatistics, ContactMessageData } from "@/models/analytics";

// ============================================================================
// TYPE DEFINITIONS - API Request/Response Types
// ============================================================================

// Types are now imported from @/models/analytics
// Re-export for backward compatibility
export type { PlatformStatistics, ContactMessageData };

/**
 * Format number with + suffix for marketing display
 */
function formatStatValue(value: number | string): string {
  if (typeof value === "string") return value;
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  }
  return `${value}+`;
}

// ============================================================================
// ANALYTICS SERVICE - MOCK/BACKEND MODE
// ============================================================================

/**
 * Get platform statistics from backend
 *
 * MOCK MODE (default, VITE_DATA_MODE=mock):
 * - Uses mock data only
 * - Use when backend is not available
 *
 * BACKEND MODE (VITE_DATA_MODE=backend):
 * - Uses backend API only
 * - Use when backend is available
 * - Throws error if backend unavailable
 */
export async function getPlatformStatistics(): Promise<PlatformStatistics> {
  // ========================================================================
  // MOCK MODE: Use mock data only
  // ========================================================================
  if (env.DATA_MODE === "mock") {
    logger.info("[AnalyticsService] Using MOCK mode for platform statistics");
    return {
      activeJobs: PLATFORM_STATISTICS.ACTIVE_JOBS,
      companies: PLATFORM_STATISTICS.COMPANIES,
      jobSeekers: PLATFORM_STATISTICS.JOB_SEEKERS,
      newJobsDaily: PLATFORM_STATISTICS.NEW_JOBS_DAILY,
    };
  }

  // ========================================================================
  // BACKEND MODE: Use backend API only
  // ========================================================================
  logger.info("[AnalyticsService] Using BACKEND mode for platform statistics");
  const response = await apiClient.get<PlatformStatistics>(
    API_ENDPOINTS.ANALYTICS_PLATFORM_STATS
  );
  return {
    activeJobs: formatStatValue(response.data.activeJobs),
    companies: formatStatValue(response.data.companies),
    jobSeekers: formatStatValue(response.data.jobSeekers),
    newJobsDaily: formatStatValue(response.data.newJobsDaily),
  };
}

/**
 * Subscribe email to newsletter
 *
 * MOCK MODE (default, VITE_DATA_MODE=mock):
 * - Simulates subscription (stores in localStorage)
 * - Use when backend is not available
 *
 * BACKEND MODE (VITE_DATA_MODE=backend):
 * - Uses backend API only
 * - Use when backend is available
 * - Throws error if backend unavailable
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  // ========================================================================
  // MOCK MODE: Use mock data only
  // ========================================================================
  if (env.DATA_MODE === "mock") {
    logger.info("[AnalyticsService] Using MOCK mode for newsletter subscription");
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Store subscription in localStorage for mock persistence
    try {
      const stored = localStorage.getItem("newsletter_subscriptions");
      const subscriptions = stored ? JSON.parse(stored) : [];
      if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem("newsletter_subscriptions", JSON.stringify(subscriptions));
      }
      logger.info("Newsletter subscription successful (mock mode):", email);
    } catch (error) {
      logger.warn("Newsletter subscription failed (mock mode):", error);
    }
    return;
  }

  // ========================================================================
  // BACKEND MODE: Use backend API only
  // ========================================================================
  logger.info("[AnalyticsService] Using BACKEND mode for newsletter subscription");
  await apiClient.post(API_ENDPOINTS.ANALYTICS_NEWSLETTER_SUBSCRIBE, {
    email,
  });
}

/**
 * Send contact form message
 *
 * MOCK MODE (default, VITE_DATA_MODE=mock):
 * - Simulates sending contact message (stores in localStorage)
 * - Use when backend is not available
 *
 * BACKEND MODE (VITE_DATA_MODE=backend):
 * - Uses backend API only
 * - Use when backend is available
 * - Throws error if backend unavailable
 */
export async function sendContactMessage(data: ContactMessageData): Promise<void> {
  // ========================================================================
  // MOCK MODE: Use mock data only
  // ========================================================================
  if (env.DATA_MODE === "mock") {
    logger.info("[AnalyticsService] Using MOCK mode for contact message");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Store message in localStorage for mock persistence
    try {
      const stored = localStorage.getItem("contact_messages");
      const messages = stored ? JSON.parse(stored) : [];
      messages.push({
        ...data,
        date: new Date().toISOString(),
      });
      localStorage.setItem("contact_messages", JSON.stringify(messages));
      logger.info("Contact message sent (mock mode):", data.email);
    } catch (error) {
      logger.warn("Contact message failed (mock mode):", error);
      throw error;
    }
    return;
  }

  // ========================================================================
  // BACKEND MODE: Use backend API only
  // ========================================================================
  logger.info("[AnalyticsService] Using BACKEND mode for contact message");
  await apiClient.post(API_ENDPOINTS.CONTACT, data);
}

export const analyticsService = {
  getPlatformStatistics,
  subscribeToNewsletter,
  sendContactMessage,
};

export default analyticsService;
