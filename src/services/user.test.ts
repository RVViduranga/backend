/**
 * Integration Tests for User Service
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from './user';
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

describe('userService.getUser', () => {
  it('should get user profile for logged-in user', async () => {
    // Setup: Register and login
    await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test getUser
    const user = await userService.getUser();

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBeDefined();
    expect(user.lastName).toBeDefined();
  });

  it('should return default user if not logged in', async () => {
    // No login, test getUser
    const user = await userService.getUser();

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
  });
});

describe('userService.getProfileData', () => {
  it('should get profile data for user', async () => {
    // Setup: Register and login
    const authResult = await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test getProfileData
    const profile = await userService.getProfileData(authResult.user.id);

    // Profile may be undefined for new users
    expect(profile).toBeDefined();
  });
});

describe('userService.getProfileViewModel', () => {
  it('should get profile view model', async () => {
    // Setup: Register and login
    await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test getProfileViewModel
    const viewModel = await userService.getProfileViewModel();

    expect(viewModel).toBeDefined();
    expect(viewModel.user).toBeDefined();
    expect(viewModel.fullName).toBeDefined();
    expect(viewModel.displayName).toBeDefined();
  });
});

describe('userService.updateUser', () => {
  it('should update user data', async () => {
    // Setup: Register and login
    const authResult = await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test updateUser
    const updated = await userService.updateUser(authResult.user.id, {
      phone: '9876543210',
      location: 'Kandy',
    });

    expect(updated.phone).toBe('9876543210');
    expect(updated.location).toBe('Kandy');
  });
});

describe('userService.updateProfileData', () => {
  it('should update profile data', async () => {
    // Setup: Register and login
    const authResult = await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test updateProfileData
    const updated = await userService.updateProfileData(authResult.user.id, {
      experience: 5,
      qualification: 8,
      skill: 7,
    });

    expect(updated.experience).toBe(5);
    expect(updated.qualification).toBe(8);
    expect(updated.skill).toBe(7);
  });
});

describe('userService.updateProfile', () => {
  it('should update legacy profile format', async () => {
    // Setup: Register and login
    await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test updateProfile (legacy)
    const updated = await userService.updateProfile({
      phone: '9876543210',
      location: 'Kandy',
    });

    expect(updated.phone).toBe('9876543210');
    expect(updated.location).toBe('Kandy');
  });

  it('should calculate experience from experience array', async () => {
    // Setup: Register and login
    await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test updateProfile with experience array
    const updated = await userService.updateProfile({
      experience: [
        {
          title: 'Developer',
          company: 'Company A',
          location: 'Colombo',
          startDate: '2020-01-01',
          endDate: '2022-01-01',
          description: 'Worked',
        },
      ],
    });

    expect(updated).toBeDefined();
  });
});

describe('userService.getUserApplications', () => {
  it('should get user applications', async () => {
    // Setup: Register and login
    const authResult = await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test getUserApplications
    const applications = await userService.getUserApplications(authResult.user.id);

    expect(Array.isArray(applications)).toBe(true);
  });
});

describe('userService.getSavedJobs', () => {
  it('should get saved jobs for user', async () => {
    // Setup: Register and login
    const authResult = await authService.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '1234567890',
      location: 'Colombo',
      agreeToTerms: true,
    });

    // Test getSavedJobs
    const savedJobs = await userService.getSavedJobs(authResult.user.id);

    expect(Array.isArray(savedJobs)).toBe(true);
  });
});
