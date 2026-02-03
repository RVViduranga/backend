/**
 * Tests for Job Transformers
 */
import { describe, it, expect } from 'vitest';
import {
  parseSalaryRange,
  formatSalaryRange,
  transformJobDetailToBackendFormat,
  normalizeJobDetail,
} from './job-transformers';
import type { SalaryRangeModel, JobDetailModel } from '@/models/job';

describe('parseSalaryRange', () => {
  it('should return object as-is if already an object', () => {
    const salaryRange: SalaryRangeModel = { min: 100000, max: 200000 };
    expect(parseSalaryRange(salaryRange)).toEqual(salaryRange);
  });

  it('should parse string format "Rs. 150,000 - Rs. 250,000 per month"', () => {
    const result = parseSalaryRange('Rs. 150,000 - Rs. 250,000 per month');
    expect(result).toEqual({ min: 150000, max: 250000 });
  });

  it('should parse string format "$50,000 - $80,000"', () => {
    const result = parseSalaryRange('$50,000 - $80,000');
    expect(result).toEqual({ min: 50000, max: 80000 });
  });

  it('should parse string format "150000-250000"', () => {
    const result = parseSalaryRange('150000-250000');
    expect(result).toEqual({ min: 150000, max: 250000 });
  });

  it('should handle single number by estimating max', () => {
    const result = parseSalaryRange('Rs. 100,000');
    expect(result.min).toBe(100000);
    expect(result.max).toBeGreaterThan(100000);
  });

  it('should return default { min: 0, max: 0 } for invalid input', () => {
    const result = parseSalaryRange('invalid');
    expect(result).toEqual({ min: 0, max: 0 });
  });

  it('should handle empty string', () => {
    const result = parseSalaryRange('');
    expect(result).toEqual({ min: 0, max: 0 });
  });
});

describe('formatSalaryRange', () => {
  it('should format object to display string', () => {
    const salaryRange: SalaryRangeModel = { min: 100000, max: 200000 };
    expect(formatSalaryRange(salaryRange)).toBe('Rs. 100,000 - Rs. 200,000');
  });

  it('should format with custom currency', () => {
    const salaryRange: SalaryRangeModel = { min: 50000, max: 80000 };
    expect(formatSalaryRange(salaryRange, '$')).toBe('$ 50,000 - $ 80,000');
  });

  it('should handle equal min and max', () => {
    const salaryRange: SalaryRangeModel = { min: 100000, max: 100000 };
    expect(formatSalaryRange(salaryRange)).toBe('Rs. 100,000');
  });

  it('should return "Not specified" for zero range', () => {
    const salaryRange: SalaryRangeModel = { min: 0, max: 0 };
    expect(formatSalaryRange(salaryRange)).toBe('Not specified');
  });

  it('should return string as-is if already a string', () => {
    const salaryRange = 'Rs. 100,000 - Rs. 200,000';
    expect(formatSalaryRange(salaryRange)).toBe(salaryRange);
  });
});

describe('transformJobDetailToBackendFormat', () => {
  it('should transform job with string salaryRange to object', () => {
    const job = {
      id: 'job_001',
      title: 'Software Engineer',
      salaryRange: 'Rs. 100,000 - Rs. 200,000' as string | SalaryRangeModel,
      applicationDeadline: '2025-12-31',
    } as Parameters<typeof transformJobDetailToBackendFormat>[0];

    const result = transformJobDetailToBackendFormat(job);
    expect(result.salaryRange).toEqual({ min: 100000, max: 200000 });
    expect(result.closingDate).toBe('2025-12-31');
  });

  it('should use closingDate over applicationDeadline', () => {
    const job = {
      id: 'job_001',
      title: 'Software Engineer',
      closingDate: '2025-12-31',
      applicationDeadline: '2025-12-30',
    } as Parameters<typeof transformJobDetailToBackendFormat>[0];

    const result = transformJobDetailToBackendFormat(job);
    expect(result.closingDate).toBe('2025-12-31');
  });

  it('should use applicationDeadline if closingDate not provided', () => {
    const job = {
      id: 'job_001',
      title: 'Software Engineer',
      applicationDeadline: '2025-12-31',
    } as Parameters<typeof transformJobDetailToBackendFormat>[0];

    const result = transformJobDetailToBackendFormat(job);
    expect(result.closingDate).toBe('2025-12-31');
  });

  it('should set default postedBy and status', () => {
    const job = {
      id: 'job_001',
      title: 'Software Engineer',
    } as Parameters<typeof transformJobDetailToBackendFormat>[0];

    const result = transformJobDetailToBackendFormat(job);
    expect(result.postedBy).toBe('');
    expect(result.status).toBe('Active');
  });
});

describe('normalizeJobDetail', () => {
  it('should normalize job data with all fields', () => {
    const job = {
      id: 'job_001',
      title: 'Software Engineer',
      company: { id: 'comp_001', name: 'Test Company', logoUrl: '' },
      location: 'Colombo',
      jobType: 'Full-Time',
      postedDate: '2025-01-01',
      description: 'Test description',
      responsibilities: ['Write code'],
      qualifications: ['5+ years'],
      salaryRange: 'Rs. 100,000 - Rs. 200,000',
      experienceLevel: 'Senior',
      closingDate: '2025-12-31',
      postedBy: 'user_001',
      status: 'Active',
    };

    const result = normalizeJobDetail(job);
    expect(result.id).toBe('job_001');
    expect(result.salaryRange).toEqual({ min: 100000, max: 200000 });
    expect(result.closingDate).toBe('2025-12-31');
  });

  it('should handle missing optional fields', () => {
    const job = {
      id: 'job_001',
      title: 'Software Engineer',
      company: { id: 'comp_001', name: 'Test Company', logoUrl: '' },
      location: 'Colombo',
      jobType: 'Full-Time',
    };

    const result = normalizeJobDetail(job);
    expect(result.description).toBe('');
    expect(result.responsibilities).toEqual([]);
    expect(result.qualifications).toEqual([]);
  });
});
