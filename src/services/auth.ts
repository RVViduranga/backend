/**
 * Auth Service - API calls for authentication-related operations
 *
 * ARCHITECTURE:
 * - MOCK DATA (CURRENT): Uses localStorage-based mock authentication for development
 * - BACKEND API (ENABLE LATER): Real API calls ready to uncomment
 *
 * TO ENABLE BACKEND:
 * 1. Uncomment BACKEND API sections
 * 2. Comment out/remove MOCK DATA sections
 * 3. Remove localStorage usage for mock auth
 *
 * NOTE: Auth operations should use backend API in production for security
 */
import apiClient from "./api-client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/constants";
import type { AuthUser } from "@/contexts/auth-context";
import { MOCK_COMPANY_DETAIL } from "@/mocks";
import { MOCK_USER_PROFILE } from "@/mocks";
import { logger } from "@/lib/logger";

// ============================================================================
// TYPE DEFINITIONS - API Request/Response Types
// ============================================================================

export type UserType = "user" | "company";

export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserType;
}

export interface RegisterData {
  email: string;
  password: string;
  userType: UserType;
  name?: string;
}

export interface CompanyRegistrationData {
  companyName: string;
  industry: string;
  website: string;
  address: string;
  phone: string;
  location: string;
  email: string;
  password: string;
}

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

// ============================================================================
// MOCK AUTHENTICATION DATA (CURRENT)
// ============================================================================

/**
 * Mock registered users stored in localStorage
 * Key format: "mock_users_{userType}"
 */
interface MockAuthUser {
  email: string;
  password: string;
  userType: UserType;
  id: string;
  name?: string;
}

/**
 * Generate a simple mock token
 */
function generateMockToken(): string {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Get default test accounts for development
 * Each company has its own login account
 */
function getDefaultTestAccounts(userType: UserType): MockAuthUser[] {
  if (userType === "company") {
    // Individual accounts for each of the 6 companies in mock data
    return [
      {
        email: "innovatech@company.com",
        password: "password123",
        userType: "company",
        id: "comp_tech_001",
        name: "Innovatech Solutions",
      },
      {
        email: "globalfinance@company.com",
        password: "password123",
        userType: "company",
        id: "comp_fin_002",
        name: "Global Finance Corp",
      },
      {
        email: "creativespark@company.com",
        password: "password123",
        userType: "company",
        id: "comp_mar_003",
        name: "Creative Spark Agency",
      },
      {
        email: "apexmanufacturing@company.com",
        password: "password123",
        userType: "company",
        id: "comp_man_004",
        name: "Apex Manufacturing",
      },
      {
        email: "medicareplus@company.com",
        password: "password123",
        userType: "company",
        id: "comp_health_005",
        name: "MediCare Plus",
      },
      {
        email: "edutechsolutions@company.com",
        password: "password123",
        userType: "company",
        id: "comp_edu_006",
        name: "EduTech Solutions",
      },
      // Additional test accounts for convenience
      {
        email: "company@test.com",
        password: "password123",
        userType: "company",
        id: "company_test_001",
        name: "Test Company",
      },
    ];
  } else {
    // User accounts for all candidates in applications + existing profiles
    return [
      // Existing detailed profiles from MOCK_USER_PROFILES
      {
        email: "anya.sharma@example.com",
        password: "password123",
        userType: "user",
        id: "user_001",
        name: "Anya Sharma",
      },
      {
        email: "john.doe@example.com",
        password: "password123",
        userType: "user",
        id: "user_002",
        name: "John Doe",
      },
      // Candidates from applications
      {
        email: "john.smith@example.com",
        password: "password123",
        userType: "user",
        id: "user_app_001",
        name: "John Smith",
      },
      {
        email: "sarah.j@example.com",
        password: "password123",
        userType: "user",
        id: "user_app_002",
        name: "Sarah Johnson",
      },
      {
        email: "m.chen@example.com",
        password: "password123",
        userType: "user",
        id: "user_app_003",
        name: "Michael Chen",
      },
      {
        email: "emma.w@example.com",
        password: "password123",
        userType: "user",
        id: "user_app_004",
        name: "Emma Williams",
      },
      {
        email: "david.brown@example.com",
        password: "password123",
        userType: "user",
        id: "user_app_005",
        name: "David Brown",
      },
      {
        email: "lisa.a@example.com",
        password: "password123",
        userType: "user",
        id: "user_app_006",
        name: "Lisa Anderson",
      },
      {
        email: "r.taylor@example.com",
        password: "password123",
        userType: "user",
        id: "user_app_007",
        name: "Robert Taylor",
      },
      // Additional test accounts for convenience
      {
        email: "user@test.com",
        password: "password123",
        userType: "user",
        id: "user_test_001",
        name: "Test User",
      },
      {
        email: "test@user.com",
        password: "test123",
        userType: "user",
        id: "user_test_002",
        name: "John Doe",
      },
    ];
  }
}

/**
 * Get mock registered users from localStorage (with default test accounts)
 */
function getMockUsers(userType: UserType): MockAuthUser[] {
  try {
    const stored = localStorage.getItem(`mock_users_${userType}`);
    const storedUsers = stored ? JSON.parse(stored) : [];

    // If no stored users, return default test accounts
    if (storedUsers.length === 0) {
      return getDefaultTestAccounts(userType);
    }

    // Merge default accounts with stored users (avoid duplicates)
    const defaultAccounts = getDefaultTestAccounts(userType);
    const defaultEmails = new Set(
      defaultAccounts.map((acc) => acc.email.toLowerCase())
    );
    const merged = [...defaultAccounts];

    storedUsers.forEach((storedUser: MockAuthUser) => {
      if (!defaultEmails.has(storedUser.email.toLowerCase())) {
        merged.push(storedUser);
      }
    });

    return merged;
  } catch {
    return getDefaultTestAccounts(userType);
  }
}

/**
 * Save mock registered users to localStorage
 */
function saveMockUsers(userType: UserType, users: MockAuthUser[]): void {
  localStorage.setItem(`mock_users_${userType}`, JSON.stringify(users));
}

/**
 * Find a mock user by email and userType
 */
function findMockUser(
  email: string,
  userType: UserType
): MockAuthUser | undefined {
  const users = getMockUsers(userType);
  return users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.userType === userType
  );
}

/**
 * Find a mock user by email (tries both user types)
 */
function findMockUserByEmail(email: string): MockAuthUser | undefined {
  // Try user first, then company
  const userUser = findMockUser(email, "user");
  if (userUser) return userUser;
  return findMockUser(email, "company");
}

/**
 * Create AuthUser from mock data
 */
function createAuthUser(mockUser: MockAuthUser, name?: string): AuthUser {
  return {
    id: mockUser.id,
    email: mockUser.email,
    userType: mockUser.userType,
    name: name || mockUser.name || mockUser.email.split("@")[0],
  };
}

// ============================================================================
// AUTH SERVICE - MOCK DATA (CURRENT MODE)
// ============================================================================

export const authService = {
  /**
   * Login with email and password
   *
   * MOCK: Checks localStorage for registered users
   * BACKEND: Will use POST /auth/login
   */
  async login(
    email: string,
    password: string,
    userType: UserType
  ): Promise<AuthResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<AuthResponse>(
    //   API_ENDPOINTS.AUTH_LOGIN,
    //   {
    //     email,
    //     password,
    //     userType,
    //   }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const mockUser = findMockUser(email, userType);

    if (!mockUser || mockUser.password !== password) {
      throw new Error("Invalid email or password");
    }

    const user = createAuthUser(mockUser);
    const token = generateMockToken();
    const refreshToken = generateMockToken();

    // Store user profile for session persistence
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

    return {
      user,
      token,
      refreshToken,
    };
  },

  /**
   * Login with auto-detection of user type
   * Tries to find user in both user and company types
   *
   * MOCK: Checks both user types in localStorage
   * BACKEND: Will use POST /auth/login (backend determines user type)
   */
  async loginAutoDetect(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<AuthResponse>(
    //   API_ENDPOINTS.AUTH_LOGIN,
    //   {
    //     email,
    //     password,
    //   }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const mockUser = findMockUserByEmail(email);

    if (!mockUser || mockUser.password !== password) {
      throw new Error("Invalid email or password");
    }

    const user = createAuthUser(mockUser);
    const token = generateMockToken();
    const refreshToken = generateMockToken();

    // Store user profile for session persistence
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

    return {
      user,
      token,
      refreshToken,
    };
  },

  /**
   * Register a new user
   *
   * MOCK: Stores user in localStorage
   * BACKEND: Will use POST /auth/register
   */
  async register(
    email: string,
    password: string,
    userType: UserType,
    name?: string
  ): Promise<AuthResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<AuthResponse>(
    //   API_ENDPOINTS.AUTH_REGISTER,
    //   {
    //     email,
    //     password,
    //     userType,
    //     name,
    //   }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // Check if user already exists
    const existingUser = findMockUser(email, userType);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new mock user
    const userId =
      userType === "user" ? `user_${Date.now()}` : `company_${Date.now()}`;
    const newUser: MockAuthUser = {
      email,
      password,
      userType,
      id: userId,
      name,
    };

    // Save to localStorage
    const users = getMockUsers(userType);
    users.push(newUser);
    saveMockUsers(userType, users);

    const user = createAuthUser(newUser, name);
    const token = generateMockToken();
    const refreshToken = generateMockToken();

    // Store user profile for session persistence
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

    return {
      user,
      token,
      refreshToken,
    };
  },

  /**
   * Register a user (creates both user and profile records)
   *
   * MOCK: Creates user in localStorage and profile record
   * BACKEND: Will use POST /auth/register/user
   */
  async registerUser(
    data: UserRegistrationData
  ): Promise<AuthResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<AuthResponse>(
    //   API_ENDPOINTS.AUTH_REGISTER_USER,
    //   {
    //     // User data
    //     email: data.email,
    //     password: data.password,
    //     role: "Seeker",
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     phone: data.phone,
    //     location: data.location,
    //     isVerified: false,
    //     savedJobPosts: [],
    //     // Profile data
    //     experience: 0,
    //     qualification: 0,
    //     skill: 0,
    //   }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // Check if user already exists
    const existingUser = findMockUser(data.email, "user");
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new mock user
    const userId = `user_${Date.now()}`;
    const newUser: MockAuthUser = {
      email: data.email,
      password: data.password,
      userType: "user",
      id: userId,
      name: `${data.firstName} ${data.lastName}`,
    };

    // Save to localStorage
    const users = getMockUsers("user");
    users.push(newUser);
    saveMockUsers("user", users);

    // Create profile record (mock: store in localStorage for now)
    // In real backend, this would be a separate API call
    try {
      const profileData = {
        id: `profile_${userId}`,
        user: userId,
        experience: 0,
        qualification: 0,
        skill: 0,
      };
      localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profileData));
    } catch (error) {
      logger.error("Error storing user profile:", error);
      // Continue even if profile storage fails
    }

    const user = createAuthUser(newUser, `${data.firstName} ${data.lastName}`);
    const token = generateMockToken();
    const refreshToken = generateMockToken();

    // Store user profile for session persistence
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

    return {
      user,
      token,
      refreshToken,
    };
  },

  /**
   * Register a company (creates both user and company records)
   *
   * MOCK: Creates user in localStorage and company profile record
   * BACKEND: Will use POST /auth/register/company
   */
  async registerCompany(
    data: CompanyRegistrationData
  ): Promise<AuthResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<AuthResponse>(
    //   API_ENDPOINTS.AUTH_REGISTER_COMPANY,
    //   {
    //     // User data
    //     email: data.email,
    //     password: data.password,
    //     role: "Company",
    //     firstName: data.companyName.split(" ")[0] || data.companyName,
    //     lastName: data.companyName.split(" ").slice(1).join(" ") || "",
    //     phone: data.phone,
    //     location: data.location,
    //     isVerified: false,
    //     savedJobPosts: [],
    //     // Company data
    //     name: data.companyName,
    //     address: data.address,
    //     industry: data.industry,
    //     website: data.website,
    //     logo: undefined,
    //     isVerified: false,
    //   }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // Check if user already exists
    const existingUser = findMockUser(data.email, "company");
    if (existingUser) {
      throw new Error("Company with this email already exists");
    }

    // Create new mock user
    const userId = `company_${Date.now()}`;
    const newUser: MockAuthUser = {
      email: data.email,
      password: data.password,
      userType: "company",
      id: userId,
      name: data.companyName,
    };

    // Save to localStorage
    const users = getMockUsers("company");
    users.push(newUser);
    saveMockUsers("company", users);

    // Create company profile record (mock: store in localStorage for now)
    // In real backend, this would be a separate API call
    try {
      // Store company profile data in localStorage
      // The company service will handle this when the company logs in
      const companyProfileData = {
        id: userId,
        name: data.companyName,
        address: data.address,
        logo: undefined,
        isVerified: false,
        description: "",
        website: data.website,
        headquarters: data.address,
        industry: data.industry,
      };
      localStorage.setItem(`company_profile_${userId}`, JSON.stringify(companyProfileData));
    } catch (error) {
      logger.error("Error creating company profile:", error);
      // Continue even if profile creation fails
    }

    const user = createAuthUser(newUser, data.companyName);
    const token = generateMockToken();
    const refreshToken = generateMockToken();

    // Store user profile for session persistence
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

    return {
      user,
      token,
      refreshToken,
    };
  },

  /**
   * Login with Google OAuth
   *
   * MOCK: Creates or finds user based on Google account
   * BACKEND: Will use POST /auth/google
   */
  async loginWithGoogle(userType: UserType): Promise<AuthResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<AuthResponse>(
    //   API_ENDPOINTS.AUTH_GOOGLE,
    //   {
    //     userType,
    //   }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // For mock: Use a default Google email
    const googleEmail = `google.${userType}@example.com`;
    let mockUser = findMockUser(googleEmail, userType);

    // If user doesn't exist, create one
    if (!mockUser) {
      const userId =
        userType === "user"
          ? `user_google_${Date.now()}`
          : `company_google_${Date.now()}`;
      mockUser = {
        email: googleEmail,
        password: "google_oauth", // Not used for Google auth
        userType,
        id: userId,
        name: `Google ${userType === "user" ? "User" : "Company"}`,
      };

      const users = getMockUsers(userType);
      users.push(mockUser);
      saveMockUsers(userType, users);
    }

    const user = createAuthUser(mockUser);
    const token = generateMockToken();
    const refreshToken = generateMockToken();

    // Store user profile for session persistence
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

    return {
      user,
      token,
      refreshToken,
    };
  },

  /**
   * Login with Google OAuth (auto-detect user type)
   * Tries to find user in both user and company types based on email
   *
   * MOCK: Checks both user types, creates user if doesn't exist
   * BACKEND: Will use POST /auth/google (backend determines user type from email)
   */
  async loginWithGoogleAutoDetect(email: string, name?: string): Promise<AuthResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<AuthResponse>(
    //   API_ENDPOINTS.AUTH_GOOGLE,
    //   {
    //     credential, // Google OAuth credential token
    //   }
    // );
    // Backend extracts email from credential and determines user type
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // Try to find existing user (check both user types)
    let mockUser = findMockUserByEmail(email);

    // If user doesn't exist, create one (default to "user" type)
    if (!mockUser) {
      const userId = `user_google_${Date.now()}`;
      mockUser = {
        email,
        password: "google_oauth", // Not used for Google auth
        userType: "user",
        id: userId,
        name: name || email.split("@")[0],
      };

      const users = getMockUsers("user");
      users.push(mockUser);
      saveMockUsers("user", users);
    }

    const user = createAuthUser(mockUser, name);
    const token = generateMockToken();
    const refreshToken = generateMockToken();

    // Store user profile for session persistence
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

    return {
      user,
      token,
      refreshToken,
    };
  },

  /**
   * Logout
   *
   * MOCK: No-op (tokens cleared by AuthContext)
   * BACKEND: Will use POST /auth/logout
   */
  async logout(): Promise<void> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    // No-op for mock mode - tokens are cleared by AuthContext
    await new Promise((resolve) => setTimeout(resolve, 200));
  },

  /**
   * Refresh access token
   *
   * MOCK: Generates new mock token
   * BACKEND: Will use POST /auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<{ token: string }>(
    //   API_ENDPOINTS.AUTH_REFRESH,
    //   { refreshToken }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { token: generateMockToken() };
  },

  /**
   * Request password reset
   *
   * MOCK: No-op (always succeeds)
   * BACKEND: Will use POST /auth/forgot-password
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<{ message: string }>(
    //   API_ENDPOINTS.AUTH_FORGOT_PASSWORD,
    //   { email }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      message:
        "Password reset email sent (mock mode - check console for instructions)",
    };
  },

  /**
   * Reset password with token
   *
   * MOCK: Updates password in localStorage
   * BACKEND: Will use POST /auth/reset-password
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<{ message: string }>(
    //   API_ENDPOINTS.AUTH_RESET_PASSWORD,
    //   { token, newPassword }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));

    logger.warn(
      "Password reset in mock mode - token validation not implemented"
    );

    return {
      message: "Password reset successful (mock mode)",
    };
  },

  /**
   * Change password (authenticated user)
   *
   * MOCK: Updates password in localStorage
   * BACKEND: Will use POST /auth/change-password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<{ message: string }>(
    //   API_ENDPOINTS.AUTH_CHANGE_PASSWORD,
    //   { currentPassword, newPassword }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get current user from localStorage
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: AuthUser = JSON.parse(storedUser);
        const mockUser = findMockUser(user.email, user.userType);

        if (mockUser && mockUser.password === currentPassword) {
          // Update password
          mockUser.password = newPassword;
          const users = getMockUsers(user.userType);
          const userIndex = users.findIndex((u) => u.id === mockUser.id);
          if (userIndex !== -1) {
            users[userIndex] = mockUser;
            saveMockUsers(user.userType, users);
          }
        } else {
          throw new Error("Current password is incorrect");
        }
      }
    } catch (error) {
      logger.error("Error changing password:", error);
      throw new Error("Failed to change password");
    }

    return {
      message: "Password changed successfully (mock mode)",
    };
  },

  /**
   * Delete user account
   *
   * MOCK: Removes user from localStorage
   * BACKEND: Will use DELETE /auth/account
   */
  async deleteAccount(): Promise<{ message: string }> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.delete<{ message: string }>(
    //   API_ENDPOINTS.AUTH_DELETE_ACCOUNT
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get current user from localStorage
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: AuthUser = JSON.parse(storedUser);
        const users = getMockUsers(user.userType);
        const filteredUsers = users.filter((u) => u.id !== user.id);
        saveMockUsers(user.userType, filteredUsers);
      }
    } catch (error) {
      logger.error("Error deleting account:", error);
      throw new Error("Failed to delete account");
    }

    return {
      message: "Account deleted successfully (mock mode)",
    };
  },
};

export default authService;
