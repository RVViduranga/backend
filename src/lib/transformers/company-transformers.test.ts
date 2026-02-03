/**
 * Tests for Company Transformers
 */
import { describe, it, expect } from 'vitest';
import {
  transformCompanyToDetailModel,
  normalizeCompanyData,
} from './company-transformers';
import type { CompanyModel, CompanyDetailModel } from '@/models/company';

describe('transformCompanyToDetailModel', () => {
  it('should transform CompanyModel to CompanyDetailModel', () => {
    const company: CompanyModel = {
      id: 'comp_001',
      name: 'Test Company',
      address: '123 Main St',
      logo: 'https://example.com/logo.png',
      isVerified: true,
    };

    const result = transformCompanyToDetailModel(company);
    expect(result.id).toBe('comp_001');
    expect(result.name).toBe('Test Company');
    expect(result.address).toBe('123 Main St');
    expect(result.logo).toBe('https://example.com/logo.png');
    expect(result.logoUrl).toBe('https://example.com/logo.png');
    expect(result.isVerified).toBe(true);
    expect(result.headquarters).toBe('123 Main St');
  });

  it('should include additional fields', () => {
    const company: CompanyModel = {
      id: 'comp_001',
      name: 'Test Company',
      address: '123 Main St',
      logo: 'https://example.com/logo.png',
      isVerified: true,
    };

    const additionalFields = {
      description: 'A great company',
      website: 'https://example.com',
      industry: 'Technology',
      activeJobsCount: 10,
      totalApplicationsReceived: 50,
    };

    const result = transformCompanyToDetailModel(company, additionalFields);
    expect(result.description).toBe('A great company');
    expect(result.website).toBe('https://example.com');
    expect(result.industry).toBe('Technology');
    expect(result.activeJobsCount).toBe(10);
    expect(result.totalApplicationsReceived).toBe(50);
  });

  it('should handle missing logo', () => {
    const company: CompanyModel = {
      id: 'comp_001',
      name: 'Test Company',
      address: '123 Main St',
      isVerified: false,
    };

    const result = transformCompanyToDetailModel(company);
    expect(result.logo).toBeUndefined();
    expect(result.logoUrl).toBe('');
  });
});

describe('normalizeCompanyData', () => {
  it('should return CompanyModel as-is if already valid', () => {
    const company: CompanyModel = {
      id: 'comp_001',
      name: 'Test Company',
      address: '123 Main St',
      logo: 'https://example.com/logo.png',
      isVerified: true,
    };

    const result = normalizeCompanyData(company);
    expect(result).toEqual(company);
  });

  it('should transform CompanyDetailModel', () => {
    const detail: CompanyDetailModel = {
      id: 'comp_001',
      name: 'Test Company',
      address: '123 Main St',
      logo: 'https://example.com/logo.png',
      logoUrl: 'https://example.com/logo.png',
      isVerified: true,
      headquarters: '123 Main St',
    } as CompanyDetailModel;

    const result = normalizeCompanyData(detail);
    expect(result.id).toBe('comp_001');
    expect(result.address).toBe('123 Main St');
    expect(result.logo).toBe('https://example.com/logo.png');
  });

  it('should use headquarters as address if address not available', () => {
    const data = {
      id: 'comp_001',
      name: 'Test Company',
      headquarters: '123 Main St',
      logoUrl: 'https://example.com/logo.png',
      isVerified: true,
    };

    const result = normalizeCompanyData(data);
    expect(result.address).toBe('123 Main St');
  });

  it('should handle partial data with defaults', () => {
    const data = {
      id: 'comp_001',
      name: 'Test Company',
    };

    const result = normalizeCompanyData(data);
    expect(result.id).toBe('comp_001');
    expect(result.name).toBe('Test Company');
    expect(result.address).toBe('');
    expect(result.isVerified).toBe(false);
  });
});
