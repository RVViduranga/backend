/**
 * Integration Tests for Company Service
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { companyService } from './company';
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
  
  // Clear any stored mock users and company data
  try {
    localStorage.removeItem('mock_users_user');
    localStorage.removeItem('mock_users_company');
    localStorage.removeItem('company_profile_');
  } catch (e) {
    // Ignore errors
  }
});

describe('companyService.getCompanyById', () => {
  it('should get company by ID', async () => {
    const company = await companyService.getCompanyById('comp_tech_001');

    expect(company).toBeDefined();
    expect(company.id).toBe('comp_tech_001');
    expect(company.name).toBeDefined();
  });

  it('should return default company if ID not found', async () => {
    const company = await companyService.getCompanyById('nonexistent_id');

    expect(company).toBeDefined();
    expect(company.name).toBeDefined();
  });
});

describe('companyService.getAllCompanies', () => {
  it('should get all companies', async () => {
    const result = await companyService.getAllCompanies();

    expect(result.companies).toBeDefined();
    expect(Array.isArray(result.companies)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
  });

  it('should filter companies by search term', async () => {
    const result = await companyService.getAllCompanies({ search: 'Tech' });

    expect(result.companies).toBeDefined();
    expect(Array.isArray(result.companies)).toBe(true);
  });

  it('should filter companies by industry', async () => {
    const result = await companyService.getAllCompanies({ industry: 'Technology' });

    expect(result.companies).toBeDefined();
    expect(Array.isArray(result.companies)).toBe(true);
  });
});

describe('companyService.getProfile', () => {
  it('should get company profile for logged-in company', async () => {
    // Setup: Register and login as company
    await authService.registerCompany({
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: `company-profile-${Date.now()}@test.com`,
      password: 'Password123',
    });

    // Test getProfile
    const result = await companyService.getProfile();

    expect(result.profile).toBeDefined();
    expect(result.summary).toBeDefined();
  });

  it('should return default profile if not logged in', async () => {
    // No login, test getProfile
    const result = await companyService.getProfile();

    expect(result.profile).toBeDefined();
    expect(result.summary).toBeDefined();
  });
});

describe('companyService.updateProfile', () => {
  it('should update company profile', async () => {
    // Setup: Register and login as company
    await authService.registerCompany({
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: `company-update-${Date.now()}@test.com`,
      password: 'Password123',
    });

    // Test updateProfile
    const updated = await companyService.updateProfile({
      name: 'Updated Company Name',
      website: 'https://updated.com',
      description: 'Updated description',
    });

    expect(updated.name).toBe('Updated Company Name');
    expect(updated.website).toBe('https://updated.com');
    expect(updated.description).toBe('Updated description');
  });

  it('should transform headquarters to address', async () => {
    // Setup: Register and login as company
    await authService.registerCompany({
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: `company-headquarters-${Date.now()}@test.com`,
      password: 'Password123',
    });

    // Test updateProfile with headquarters (legacy field)
    const updated = await companyService.updateProfile({
      headquarters: '456 New St',
    } as any);

    expect(updated.location).toBe('456 New St');
  });
});

describe('companyService.getJobs', () => {
  it('should get company jobs', async () => {
    // Setup: Register and login as company
    const authResult = await authService.registerCompany({
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: `company-jobs-${Date.now()}@test.com`,
      password: 'Password123',
    });

    // Test getJobs
    const result = await companyService.getJobs();

    expect(result).toBeDefined();
    expect(result.jobs).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
  });
});

describe('companyService.getApplications', () => {
  it('should get company applications', async () => {
    // Setup: Register and login as company
    const authResult = await authService.registerCompany({
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: `company-apps-${Date.now()}@test.com`,
      password: 'Password123',
    });

    // Test getApplications
    const result = await companyService.getApplications();

    expect(result.applications).toBeDefined();
    expect(Array.isArray(result.applications)).toBe(true);
  });

  it('should filter applications by job ID', async () => {
    // Setup: Register and login as company
    const authResult = await authService.registerCompany({
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: `company-filter-${Date.now()}@test.com`,
      password: 'Password123',
    });

    // Test getApplications with job filter
    const result = await companyService.getApplications({
      jobId: 'job_001',
    });

    expect(result.applications).toBeDefined();
    expect(Array.isArray(result.applications)).toBe(true);
  });
});
