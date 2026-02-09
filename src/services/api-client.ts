// API Client - Centralized axios configuration
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { API_BASE_URL, STORAGE_KEYS, API_ENDPOINTS } from "@/constants";
import { logger } from "@/lib/logger";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      // Always set Authorization header (will override if already set)
      config.headers.Authorization = `Bearer ${token}`;
      logger.info("[ApiClient] Authorization header added to request:", config.url);
    } else {
      logger.warn("[ApiClient] No auth token found for request:", config.url);
    }
    
    // If FormData is being sent, remove Content-Type to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      logger.info("[ApiClient] FormData detected, Content-Type will be set by axios with boundary");
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Attempt token refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (refreshToken) {
          // Attempt to refresh the token (use axios directly to avoid circular dependency)
          try {
            const refreshResponse = await axios.post<{ token: string }>(
              `${API_BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`,
              { refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const newToken = refreshResponse.data.token;

            // Store the new token
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);

            // Retry the original request with the new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          } catch (refreshApiError) {
            // Refresh API call failed - will be caught by outer catch
            throw refreshApiError;
          }
        } else {
          // No refresh token available - clear tokens and reject
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }
      } catch (refreshError) {
        // Token refresh failed - clear tokens and reject
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        // Error will propagate to hooks/components for navigation handling
      }
    }

    // Handle network errors and cancellation
    if (!error.response) {
      if (axios.isCancel(error)) {
        // Request was cancelled - this is expected behavior, don't log as error
        return Promise.reject(error);
      }
      logger.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export function createCancelTokenSource(): CancelTokenSource {
  return axios.CancelToken.source();
}

export default apiClient;
