/**
 * Auth Service - API calls for authentication-related operations
 *
 * ARCHITECTURE:
 * - MOCK MODE (default): Uses mock data only (set VITE_DATA_MODE=mock)
 * - BACKEND MODE: Uses backend API only (set VITE_DATA_MODE=backend)
 *
 * DATA MODE CONFIGURATION:
 * Set VITE_DATA_MODE in .env file:
 * - "mock" (default): Use mock data only (when backend is not available)
 * - "backend": Use backend API only (when backend is available)
 *
 * NOTE: Auth operations should use backend API in production for security
 */
import apiClient from "./api-client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/constants";
import { env } from "@/config/env";
import type { AuthUser } from "@/contexts/auth-context";
import type { CompanyRegistrationModel } from "@/models/auth";
import type { UserRegistrationModel, BackendAuthResponse } from "@/models/users";
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

/**
 * Company Registration Data (Service Layer)
 * Derived from CompanyRegistrationModel by omitting UI-only confirmPassword field
 */
export type CompanyRegistrationData = Omit<CompanyRegistrationModel, "confirmPassword">;

/**
 * User Registration Data (Service Layer)
 * Derived from UserRegistrationModel by omitting UI-only confirmPassword field
 */
export type UserRegistrationData = Omit<UserRegistrationModel, "confirmPassword">;

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
// AUTH SERVICE - MOCK/BACKEND MODE
// ============================================================================

export const authService = {
  /**
   * Login with email and password
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Checks localStorage for registered users
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async login(
    email: string,
    password: string,
    userType: UserType
  ): Promise<AuthResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for login");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for login");
    // Backend expects: { email, password } (no userType)
    const response = await apiClient.post<BackendAuthResponse>(
      API_ENDPOINTS.AUTH_LOGIN,
      {
        email,
        password,
      }
    );
    // Backend returns: { message, user: { id, fullName, email }, token }
    // Transform to AuthResponse format
    return {
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        userType: userType, // Keep userType for frontend compatibility
        name: response.data.user.fullName,
      },
      token: response.data.token,
    };
  },

  /**
   * Login with auto-detection of user type
   * Tries to find user in both user and company types
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Checks both user types in localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only (backend determines user type)
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async loginAutoDetect(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for loginAutoDetect");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for loginAutoDetect");
    // Backend expects: { email, password } (no userType)
    const response = await apiClient.post<BackendAuthResponse>(
      API_ENDPOINTS.AUTH_LOGIN,
      {
        email,
        password,
      }
    );
    
    // Determine user type by checking if a company exists with matching name
    // During company registration, we set fullName = companyName, so we can check
    // if a company exists with name = user.fullName
    // Also try to access company profile endpoint as a fallback
    let userType: UserType = "user"; // Default to "user"
    const userFullName = response.data.user.fullName?.trim() || "";
    
    try {
      logger.info(`[AuthService] Checking if user '${userFullName}' (email: ${response.data.user.email}) is a company...`);
      
      // Store token temporarily for company check (token not in localStorage yet)
      const tempToken = response.data.token;
      
      // Method 1: Try to access company profile endpoint (most reliable)
      // If user can access this, they're definitely a company user
      try {
        const companyProfileResponse = await apiClient.get<any>(
          API_ENDPOINTS.COMPANY_PROFILE,
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
            },
          }
        );
        // If we get here without error, user is a company
        userType = "company";
        logger.info(`[AuthService] ✅ Company profile accessible! User type set to 'company' (method 1)`);
      } catch (profileError: any) {
        // If 404 or 401, user is not a company (or not authenticated as company)
        if (profileError?.response?.status === 404 || profileError?.response?.status === 401) {
          logger.info(`[AuthService] Company profile not accessible (${profileError?.response?.status}), trying method 2...`);
        } else {
          logger.warn(`[AuthService] Company profile check failed:`, profileError?.message);
        }
        
        // Method 2: Check companies list for matching name
        if (userType === "user" && userFullName) {
          try {
            const companiesResponse = await apiClient.get<any>(
              API_ENDPOINTS.COMPANIES,
              {
                headers: {
                  Authorization: `Bearer ${tempToken}`,
                },
              }
            );
            
            logger.info("[AuthService] Companies response received:", companiesResponse.data);
            
            // Extract companies array from response
            let companies: any[] = [];
            if (Array.isArray(companiesResponse.data)) {
              companies = companiesResponse.data;
            } else if (companiesResponse.data?.data?.items && Array.isArray(companiesResponse.data.data.items)) {
              // Handle paginated response: { success: true, data: { items: CompanyModel[], ... } }
              companies = companiesResponse.data.data.items;
            } else if (companiesResponse.data?.data && Array.isArray(companiesResponse.data.data)) {
              // Handle wrapped response: { success: true, data: Company[] }
              companies = companiesResponse.data.data;
            } else if (companiesResponse.data?.companies && Array.isArray(companiesResponse.data.companies)) {
              // Handle alternative format: { companies: Company[], total, page, limit }
              companies = companiesResponse.data.companies;
            }
            
            logger.info(`[AuthService] Found ${companies.length} companies. Checking for match with '${userFullName}'...`);
            
            // Check if any company matches the user's fullName (case-insensitive for safety)
            const matchingCompany = companies.find(
              (company: any) => {
                const companyName = (company.name || "").trim();
                const match = companyName === userFullName || companyName.toLowerCase() === userFullName.toLowerCase();
                if (match) {
                  logger.info(`[AuthService] Found matching company: '${companyName}' === '${userFullName}'`);
                }
                return match;
              }
            );
            
            if (matchingCompany) {
              userType = "company";
              logger.info(`[AuthService] ✅ Company found! User type set to 'company' (method 2). Company ID: ${matchingCompany.id || matchingCompany._id}`);
            } else {
              logger.info(`[AuthService] ❌ No company found matching '${userFullName}'. User type set to 'user'.`);
              if (companies.length > 0) {
                logger.info(`[AuthService] Available company names: ${companies.map((c: any) => c.name).join(", ")}`);
              }
            }
          } catch (companiesError: any) {
            logger.warn("[AuthService] ⚠️ Failed to check companies list:", companiesError?.message || companiesError);
          }
        }
      }
    } catch (companyCheckError: any) {
      // If all checks fail, default to "user" (don't fail login)
      logger.warn("[AuthService] ⚠️ All company checks failed, defaulting to 'user':", companyCheckError?.message || companyCheckError);
    }
    
    logger.info(`[AuthService] Final userType determined: '${userType}' for user '${userFullName}'`);
    
    // Backend returns: { message, user: { id, fullName, email }, token }
    // Transform to AuthResponse format
    return {
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        userType: userType, // Set based on company check
        name: response.data.user.fullName,
      },
      token: response.data.token,
    };
  },

  /**
   * Register a new user
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Stores user in localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async register(
    email: string,
    password: string,
    userType: UserType,
    name?: string
  ): Promise<AuthResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for register");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for register");
    // Backend expects: { fullName, email, password }
    const response = await apiClient.post<BackendAuthResponse>(
      API_ENDPOINTS.AUTH_REGISTER,
      {
        fullName: name || email.split("@")[0], // Backend uses fullName
        email,
        password,
      }
    );
    // Backend returns: { message, user: { id, fullName, email }, token }
    // Transform to AuthResponse format
    return {
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        userType: userType, // Keep userType for frontend compatibility
        name: response.data.user.fullName,
      },
      token: response.data.token,
    };
  },

  /**
   * Register a user (creates both user and profile records)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Creates user in localStorage and profile record
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async registerUser(
    data: UserRegistrationData
  ): Promise<AuthResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for registerUser");
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
        name: data.fullName, // ✅ UserRegistrationModel now uses fullName
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

      const user = createAuthUser(newUser, data.fullName); // ✅ UserRegistrationModel now uses fullName
      const token = generateMockToken();
      const refreshToken = generateMockToken();

      // Store user profile for session persistence
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

      return {
        user,
        token,
        refreshToken,
      };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for registerUser");
    // Backend register expects: { fullName, email, password }
    // Profile is created separately via /api/profiles endpoint
    const response = await apiClient.post<BackendAuthResponse>(
      API_ENDPOINTS.AUTH_REGISTER,
      {
        fullName: data.fullName, // ✅ UserRegistrationModel now uses fullName
        email: data.email,
        password: data.password,
      }
    );
    // Backend returns: { message, user: { id, fullName, email }, token }
    // Transform to AuthResponse format
    return {
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        userType: "user",
        name: response.data.user.fullName,
      },
      token: response.data.token,
    };
  },

  /**
   * Register a company (creates both user and company records)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Creates user in localStorage and company profile record
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async registerCompany(
    data: CompanyRegistrationData
  ): Promise<AuthResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for registerCompany");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for registerCompany");
    // Backend: User registration via /api/auth/register, then company creation via /api/companies
    // Step 1: Register user
    const userResponse = await apiClient.post<BackendAuthResponse>(
      API_ENDPOINTS.AUTH_REGISTER,
      {
        fullName: data.companyName, // Backend uses fullName
        email: data.email,
        password: data.password,
      }
    );
    
    // Step 2: Create company record
    // Backend expects: { name, description, location, website?, industry?, ... }
    // Map form data to backend fields: address → location, companyName → name
    try {
      await apiClient.post<{ success: boolean; data: any; message: string }>(
        API_ENDPOINTS.COMPANIES,
        {
          name: data.companyName,
          description: data.companyName, // Use company name as default description (can be updated later)
          location: data.location || data.address, // Backend uses location, fallback to address
          website: data.website || undefined,
          industry: data.industry || undefined,
          headquarters: data.address || undefined, // Optional: map address to headquarters
        }
      );
      logger.info("[AuthService] Company record created successfully");
    } catch (companyError) {
      // Log error but don't fail registration - user is already created
      // Company profile can be created/updated later via company profile page
      logger.warn("[AuthService] Failed to create company record, but user registration succeeded:", companyError);
    }
    
    // Backend returns: { message, user: { id, fullName, email }, token }
    // Transform to AuthResponse format
    return {
      user: {
        id: userResponse.data.user.id,
        email: userResponse.data.user.email,
        userType: "company",
        name: userResponse.data.user.fullName,
      },
      token: userResponse.data.token,
    };
  },

  /**
   * Login with Google OAuth
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Creates or finds user based on Google account
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async loginWithGoogle(userType: UserType): Promise<AuthResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for loginWithGoogle");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for loginWithGoogle");
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH_GOOGLE,
      {
        userType,
      }
    );
    return response.data;
  },

  /**
   * Login with Google OAuth (auto-detect user type)
   * Tries to find user in both user and company types based on email
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Checks both user types, creates user if doesn't exist
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only (backend determines user type from email)
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async loginWithGoogleAutoDetect(email: string, name?: string): Promise<AuthResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for loginWithGoogleAutoDetect");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for loginWithGoogleAutoDetect");
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH_GOOGLE,
      {
        email,
        name,
      }
    );
    return response.data;
  },

  /**
   * Logout
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - No-op (tokens cleared by AuthContext)
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async logout(): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for logout");
      // No-op for mock mode - tokens are cleared by AuthContext
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for logout");
    await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
  },

  /**
   * Refresh access token
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Generates new mock token
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for refreshToken");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { token: generateMockToken() };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for refreshToken");
    // Backend expects: { refreshToken }
    // Backend returns: { token: string }
    const response = await apiClient.post<{ token: string }>(
      API_ENDPOINTS.AUTH_REFRESH,
      { refreshToken }
    );
    return response.data; // Backend returns { token } directly
  },

  /**
   * Request password reset
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - No-op (always succeeds)
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for forgotPassword");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        message:
          "Password reset email sent (mock mode - check console for instructions)",
      };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for forgotPassword");
    // Backend expects: { email }
    // Backend returns: { message: string }
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH_FORGOT_PASSWORD,
      { email }
    );
    return response.data; // Backend returns { message } directly
  },

  /**
   * Reset password with token
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Updates password in localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for resetPassword");
      await new Promise((resolve) => setTimeout(resolve, 300));

      logger.warn(
        "Password reset in mock mode - token validation not implemented"
      );

      return {
        message: "Password reset successful (mock mode)",
      };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for resetPassword");
    // Backend expects: { token, newPassword }
    // Backend returns: { message: string }
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH_RESET_PASSWORD,
      { token, newPassword }
    );
    return response.data; // Backend returns { message } directly
  },

  /**
   * Change password (authenticated user)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Updates password in localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for changePassword");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for changePassword");
    // Backend expects: { currentPassword, newPassword }
    // Backend returns: { message: string }
    // NOTE: Backend extracts userId from JWT token (req.user.userId)
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH_CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
    return response.data; // Backend returns { message } directly
  },

  /**
   * Delete user account
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Removes user from localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async deleteAccount(): Promise<{ message: string }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[AuthService] Using MOCK mode for deleteAccount");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[AuthService] Using BACKEND mode for deleteAccount");
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.AUTH_DELETE_ACCOUNT
    );
    return response.data;
  },
};

export default authService;
