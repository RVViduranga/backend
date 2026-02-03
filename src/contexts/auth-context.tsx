import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { STORAGE_KEYS, ERROR_MESSAGES } from "@/constants";
import { logger } from "@/lib/logger";
import authService from "@/services/auth";

export type UserType = "user" | "company";

export interface AuthUser {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  loginWithGoogle: (userType: UserType) => Promise<void>;
  loginWithGoogleAutoDetect: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    userType: UserType,
    name?: string
  ) => Promise<void>;
  registerCompany: (
    data: import("@/services/auth").CompanyRegistrationData
  ) => Promise<void>;
  registerUser: (
    data: import("@/services/auth").UserRegistrationData
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for auth token in localStorage
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (token) {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
        setError(errorMessage);
        logger.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password, userType);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      setUser(response.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      logger.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (userType: UserType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.loginWithGoogle(userType);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      setUser(response.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      logger.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogleAutoDetect = async (email: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.loginWithGoogleAutoDetect(email, name);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      setUser(response.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      logger.error("Google login auto-detect error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    userType: UserType,
    name?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(
        email,
        password,
        userType,
        name
      );
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      setUser(response.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      logger.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCompany = async (
    data: import("@/services/auth").CompanyRegistrationData
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.registerCompany(data);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      setUser(response.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      logger.error("Company registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    data: import("@/services/auth").UserRegistrationData
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.registerUser(data);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      setUser(response.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      logger.error("User registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    // Clear all auth-related data from localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    // Navigation will be handled by components using this context
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      loginWithGoogle,
      loginWithGoogleAutoDetect,
      logout,
      register,
      registerCompany,
      registerUser,
    }),
    [
      user,
      isLoading,
      error,
      login,
      loginWithGoogle,
      loginWithGoogleAutoDetect,
      logout,
      register,
      registerCompany,
      registerUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


