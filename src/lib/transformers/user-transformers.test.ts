/**
 * Tests for User Transformers
 */
import { describe, it, expect } from 'vitest';
import {
  transformLegacyUserProfileToBackendModels,
  normalizeUserData,
  normalizeProfileData,
} from './user-transformers';
import type { UserModel, UserRole } from '@/models/users';
import type { UserProfileModel, ProfileModel } from '@/models/profiles';

describe('transformLegacyUserProfileToBackendModels', () => {
  it('should split fullName into firstName and lastName', () => {
    const legacy: UserProfileModel = {
      id: 'user_001',
      email: 'test@example.com',
      fullName: 'John Doe',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: false,
    } as UserProfileModel;

    const result = transformLegacyUserProfileToBackendModels(legacy);
    expect(result.user.firstName).toBe('John');
    expect(result.user.lastName).toBe('Doe');
  });

  it('should handle multi-word lastName', () => {
    const legacy: UserProfileModel = {
      id: 'user_001',
      email: 'test@example.com',
      fullName: 'John Michael Doe',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: false,
    } as UserProfileModel;

    const result = transformLegacyUserProfileToBackendModels(legacy);
    expect(result.user.firstName).toBe('John');
    expect(result.user.lastName).toBe('Michael Doe');
  });

  it('should create profile if cvUploaded is true', () => {
    const legacy: UserProfileModel = {
      id: 'user_001',
      email: 'test@example.com',
      fullName: 'John Doe',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: true,
    } as UserProfileModel;

    const result = transformLegacyUserProfileToBackendModels(legacy);
    expect(result.profile).toBeDefined();
    expect(result.profile?.user).toBe('user_001');
  });

  it('should not create profile if cvUploaded is false', () => {
    const legacy: UserProfileModel = {
      id: 'user_001',
      email: 'test@example.com',
      fullName: 'John Doe',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: false,
    } as UserProfileModel;

    const result = transformLegacyUserProfileToBackendModels(legacy);
    expect(result.profile).toBeUndefined();
  });
});

describe('normalizeUserData', () => {
  it('should return UserModel as-is if already valid', () => {
    const user: UserModel = {
      id: 'user_001',
      email: 'test@example.com',
      role: 'Seeker' as UserRole,
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      location: 'Colombo',
      isVerified: true,
      savedJobPosts: [],
    };

    const result = normalizeUserData(user);
    expect(result).toEqual(user);
  });

  it('should transform legacy UserProfileModel', () => {
    const legacy: UserProfileModel = {
      id: 'user_001',
      email: 'test@example.com',
      fullName: 'John Doe',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: false,
    } as UserProfileModel;

    const result = normalizeUserData(legacy);
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.role).toBe('Seeker');
  });

  it('should handle partial data with defaults', () => {
    const data = {
      id: 'user_001',
      email: 'test@example.com',
    };

    const result = normalizeUserData(data);
    expect(result.id).toBe('user_001');
    expect(result.email).toBe('test@example.com');
    expect(result.role).toBe('Seeker');
    expect(result.firstName).toBe('');
    expect(result.isVerified).toBe(false);
  });
});

describe('normalizeProfileData', () => {
  it('should return undefined for null/undefined', () => {
    expect(normalizeProfileData(null, 'user_001')).toBeUndefined();
    expect(normalizeProfileData(undefined, 'user_001')).toBeUndefined();
  });

  it('should normalize profile data', () => {
    const data = {
      id: 'profile_001',
      cv: 'https://example.com/cv.pdf',
      experience: 5,
      qualification: 8,
      skill: 7,
    };

    const result = normalizeProfileData(data, 'user_001');
    expect(result?.id).toBe('profile_001');
    expect(result?.user).toBe('user_001');
    expect(result?.cv).toBe('https://example.com/cv.pdf');
    expect(result?.experience).toBe(5);
    expect(result?.qualification).toBe(8);
    expect(result?.skill).toBe(7);
  });

  it('should generate ID if not provided', () => {
    const data = {
      cv: 'https://example.com/cv.pdf',
    };

    const result = normalizeProfileData(data, 'user_001');
    expect(result?.id).toBe('user_001_profile');
  });

  it('should handle non-numeric experience/qualification/skill', () => {
    const data = {
      experience: '5',
      qualification: 'invalid',
      skill: null,
    };

    const result = normalizeProfileData(data, 'user_001');
    expect(result?.experience).toBe(0);
    expect(result?.qualification).toBe(0);
    expect(result?.skill).toBe(0);
  });
});
