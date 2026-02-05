/**
 * Integration Tests for Auth Service
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from './auth';
import { STORAGE_KEYS } from '@/constants';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

beforeEach(() => {
  // Reset localStorage before each test
  mockLocalStorage.clear();
  global.localStorage = mockLocalStorage as any;
  
  // Clear any stored mock users
  try {
    localStorage.removeItem('mock_users_user');
    localStorage.removeItem('mock_users_company');
  } catch (e) {
    // Ignore errors
  }
});

describe('authService.login', () => {
  it('should login successfully with valid credentials', async () => {
    // Setup: Register a user first
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
    });

    // Test login
    const result = await authService.login('test@example.com', 'Password123', 'user');

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.USER_PROFILE,
      expect.any(String)
    );
  });

  it('should throw error with invalid email', async () => {
    await expect(
      authService.login('nonexistent@example.com', 'Password123', 'user')
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw error with invalid password', async () => {
    // Setup: Register a user first
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
    });

    // Test with wrong password
    await expect(
      authService.login('test@example.com', 'WrongPassword', 'user')
    ).rejects.toThrow('Invalid email or password');
  });
});

describe('authService.loginAutoDetect', () => {
  it('should login successfully with auto-detection', async () => {
    // Setup: Register a user first
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
    });

    // Test auto-detect login
    const result = await authService.loginAutoDetect('test@example.com', 'Password123');

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeDefined();
  });

  it('should throw error with invalid credentials', async () => {
    await expect(
      authService.loginAutoDetect('nonexistent@example.com', 'Password123')
    ).rejects.toThrow('Invalid email or password');
  });
});

describe('authService.register', () => {
  it('should register a new user successfully', async () => {
    const result = await authService.registerUser({
      fullName: 'Jane Smith',
      email: 'newuser@example.com',
      password: 'Password123',
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('newuser@example.com');
    expect(result.token).toBeDefined();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.USER_PROFILE,
      expect.any(String)
    );
  });

  it('should throw error if email already exists', async () => {
    // Register first user
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'existing@example.com',
      password: 'Password123',
    });

    // Try to register again with same email
    await expect(
      authService.registerUser({
        fullName: 'Jane Smith',
        email: 'existing@example.com',
        password: 'Password123',
      })
    ).rejects.toThrow('User with this email already exists');
  });
});

describe('authService.registerCompany', () => {
  it('should register a new company successfully', async () => {
    const result = await authService.registerCompany({
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: 'company@testcompany.com',
      password: 'Password123',
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('company@testcompany.com');
    expect(result.token).toBeDefined();
  });

  it('should throw error if company email already exists', async () => {
    // Register first company
    await authService.registerCompany({
      companyName: 'First Company',
      industry: 'Technology',
      website: 'https://first.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: 'existing@company.com',
      password: 'Password123',
    });

    // Try to register again with same email
    await expect(
      authService.registerCompany({
        companyName: 'Second Company',
        industry: 'Finance',
        website: 'https://second.com',
        address: '456 Main St',
        phone: '9876543210',
        location: 'Kandy',
        email: 'existing@company.com',
        password: 'Password123',
      })
    ).rejects.toThrow('Company with this email already exists');
  });
});

describe('authService.logout', () => {
  it('should logout successfully', async () => {
    // Setup: Login first
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
    });

    // Verify user is stored
    expect(mockLocalStorage.getItem(STORAGE_KEYS.USER_PROFILE)).toBeTruthy();

    // Test logout (no-op in mock mode, tokens cleared by AuthContext)
    await expect(authService.logout()).resolves.not.toThrow();
  });
});

describe('authService.changePassword', () => {
  it('should change password successfully', async () => {
    // Setup: Register and login (user is stored in localStorage)
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'OldPassword123',
    });

    // Test password change (user is already logged in from registerUser)
    const result = await authService.changePassword('OldPassword123', 'NewPassword123');
    expect(result.message).toBeDefined();

    // Verify new password works by logging in again
    // Clear localStorage first to simulate logout
    mockLocalStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    const loginResult = await authService.login('test@example.com', 'NewPassword123', 'user');
    expect(loginResult.user.email).toBe('test@example.com');
  });

  it('should throw error if current password is incorrect', async () => {
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'OldPassword123',
    });

    await expect(
      authService.changePassword('WrongPassword', 'NewPassword123')
    ).rejects.toThrow('Failed to change password');
  });
});

describe('authService.forgotPassword', () => {
  it('should send password reset email', async () => {
    // Setup: Register a user
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
    });

    // Test forgot password
    await expect(authService.forgotPassword('test@example.com')).resolves.not.toThrow();
  });

  it('should handle non-existent email gracefully', async () => {
    // Should not throw even if email doesn't exist (security best practice)
    await expect(authService.forgotPassword('nonexistent@example.com')).resolves.not.toThrow();
  });
});

describe('authService.deleteAccount', () => {
  it('should delete account successfully', async () => {
    // Setup: Register and login (user is stored in localStorage)
    await authService.registerUser({
      fullName: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
    });

    // Verify user exists
    expect(mockLocalStorage.getItem(STORAGE_KEYS.USER_PROFILE)).toBeTruthy();

    // Test delete account
    const result = await authService.deleteAccount();
    expect(result.message).toBeDefined();
  });
});
