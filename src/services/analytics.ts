/**
 * Analytics Service
 * Handles platform statistics, analytics, and marketing data
 *
 * ARCHITECTURE:
 * - BACKEND API WITH FALLBACK: Tries backend first, falls back to constants
 * - Automatic fallback ensures app works even if backend is unavailable
 */
import apiClient from "./api-client";
import { API_ENDPOINTS } from "@/constants";
import { PLATFORM_STATISTICS } from "@/mocks/analytics.mock";
import { logger } from "@/lib/logger";

// ============================================================================
// TYPE DEFINITIONS - API Request/Response Types
// ============================================================================

/**
 * Platform Statistics Interface
 * Data structure for public platform statistics (marketing/trust indicators)
 */
export interface PlatformStatistics {
  activeJobs: number | string;
  companies: number | string;
  jobSeekers: number | string;
  newJobsDaily: number | string;
}

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
// ANALYTICS SERVICE - BACKEND API WITH FALLBACK
// ============================================================================

/**
 * Get platform statistics from backend
 * Falls back to constants if API is unavailable or feature is disabled
 *
 * BACKEND: GET /analytics/platform-stats
 * FALLBACK: Uses PLATFORM_STATISTICS mock data
 */
export async function getPlatformStatistics(): Promise<PlatformStatistics> {
  // ========================================================================
  // BACKEND API (ENABLE LATER)
  // ========================================================================
  // try {
  //   // When backend is ready, this will fetch real data from database/analytics
  //   const response = await apiClient.get<PlatformStatistics>(
  //     API_ENDPOINTS.ANALYTICS_PLATFORM_STATS
  //   );
  //   return {
  //     activeJobs: formatStatValue(response.data.activeJobs),
  //     companies: formatStatValue(response.data.companies),
  //     jobSeekers: formatStatValue(response.data.jobSeekers),
  //     newJobsDaily: formatStatValue(response.data.newJobsDaily),
  //   };
  // } catch (error) {
  //   logger.error("Failed to fetch platform statistics:", error);
  //   // Fallback to constants on error
  // }

  // ========================================================================
  // FALLBACK TO MOCK DATA (CURRENT)
  // ========================================================================
  // Return static mock data in mock mode (no API call)
  // This allows the app to work during development/mock phase
  return {
    activeJobs: PLATFORM_STATISTICS.ACTIVE_JOBS,
    companies: PLATFORM_STATISTICS.COMPANIES,
    jobSeekers: PLATFORM_STATISTICS.JOB_SEEKERS,
    newJobsDaily: PLATFORM_STATISTICS.NEW_JOBS_DAILY,
  };
}

/**
 * Subscribe email to newsletter
 *
 * MOCK: Simulates subscription (stores in localStorage for development)
 * BACKEND: POST /analytics/newsletter/subscribe
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  // ========================================================================
  // BACKEND API (ENABLE LATER)
  // ========================================================================
  // try {
  //   await apiClient.post(API_ENDPOINTS.ANALYTICS_NEWSLETTER_SUBSCRIBE, {
  //     email,
  //   });
  // } catch (error) {
  //   logger.error("Newsletter subscription failed:", error);
  //   throw error;
  // }

  // ========================================================================
  // MOCK DATA (CURRENT)
  // ========================================================================
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
}

/**
 * Send contact form message
 *
 * MOCK: Simulates sending contact message (stores in localStorage for development)
 * BACKEND: POST /contact
 */
export interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(data: ContactMessageData): Promise<void> {
  // ========================================================================
  // BACKEND API (ENABLE LATER)
  // ========================================================================
  // try {
  //   await apiClient.post(API_ENDPOINTS.CONTACT, data);
  // } catch (error) {
  //   logger.error("Contact message failed:", error);
  //   throw error;
  // }

  // ========================================================================
  // MOCK DATA (CURRENT)
  // ========================================================================
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
}

const analyticsService = {
  getPlatformStatistics,
  subscribeToNewsletter,
  sendContactMessage,
};

export default analyticsService;
