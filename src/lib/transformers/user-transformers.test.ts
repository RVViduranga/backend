/**
 * Tests for User Transformers
 */
import { describe, it, expect } from 'vitest';
import {
  transformLegacyUserProfileToBackendModels,
  normalizeUserData,
  normalizeProfileData,
} from './user-transformers';
import type { UserModel } from '@/models/users';
import type { UserProfileModel, ProfileModel } from '@/models/profiles';

describe('transformLegacyUserProfileToBackendModels', () => {
  it('should preserve fullName in UserModel', () => {
    const legacy: UserProfileModel = {
      id: 'user_001',
      email: 'test@example.com',
      fullName: 'John Doe',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: false,
    } as UserProfileModel;

    const result = transformLegacyUserProfileToBackendModels(legacy);
    expect(result.user.fullName).toBe('John Doe');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should handle multi-word fullName', () => {
    const legacy: UserProfileModel = {
      id: 'user_001',
      email: 'test@example.com',
      fullName: 'John Michael Doe',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: false,
    } as UserProfileModel;

    const result = transformLegacyUserProfileToBackendModels(legacy);
    expect(result.user.fullName).toBe('John Michael Doe');
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
      fullName: 'John Doe',
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
    expect(result.fullName).toBe('John Doe');
    expect(result.email).toBe('test@example.com');
  });

  it('should handle partial data with defaults', () => {
    const data = {
      id: 'user_001',
      email: 'test@example.com',
    };

    const result = normalizeUserData(data);
    expect(result.id).toBe('user_001');
    expect(result.email).toBe('test@example.com');
    expect(result.fullName).toBe('test@example.com'); // Falls back to email
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
      fullName: 'John Doe',
      email: 'test@example.com',
      phone: '1234567890',
      location: 'Colombo',
      cvUploaded: true,
    };

    const result = normalizeProfileData(data, 'user_001');
    expect(result?.id).toBe('profile_001');
    expect(result?.user).toBe('user_001');
    expect(result?.fullName).toBe('John Doe');
    expect(result?.email).toBe('test@example.com');
    expect(result?.cvUploaded).toBe(true);
  });

  it('should generate ID if not provided', () => {
    const data = {
      fullName: 'John Doe',
      email: 'test@example.com',
    };

    const result = normalizeProfileData(data, 'user_001');
    expect(result?.id).toBe('user_001_profile');
  });

  it('should handle arrays for education and experience', () => {
    const data = {
      education: [{ institution: 'University' }],
      experience: [{ company: 'Company' }],
      mediaFiles: [{ id: 'file1' }],
    };

    const result = normalizeProfileData(data, 'user_001');
    expect(result?.education).toEqual([{ institution: 'University' }]);
    expect(result?.experience).toEqual([{ company: 'Company' }]);
    expect(result?.mediaFiles).toEqual([{ id: 'file1' }]);
  });
});
