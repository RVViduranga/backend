/**
 * Tests for Job Formatting Utilities
 */
import { describe, it, expect } from 'vitest';
import {
  formatSalaryRangeDisplay,
  getJobClosingDate,
  formatClosingDate,
} from './job-format';
import type { SalaryRangeModel } from '@/models/job';

describe('formatSalaryRangeDisplay', () => {
  it('should return "Not specified" for undefined', () => {
    expect(formatSalaryRangeDisplay(undefined)).toBe('Not specified');
  });

  it('should return string as-is if already a string', () => {
    const salaryRange = 'Rs. 100,000 - Rs. 200,000';
    expect(formatSalaryRangeDisplay(salaryRange)).toBe(salaryRange);
  });

  it('should format object to display string', () => {
    const salaryRange: SalaryRangeModel = { min: 100000, max: 200000 };
    expect(formatSalaryRangeDisplay(salaryRange)).toBe('Rs. 100,000 - Rs. 200,000');
  });

  it('should use custom currency', () => {
    const salaryRange: SalaryRangeModel = { min: 50000, max: 80000 };
    expect(formatSalaryRangeDisplay(salaryRange, '$')).toBe('$ 50,000 - $ 80,000');
  });
});

describe('getJobClosingDate', () => {
  it('should return closingDate if available', () => {
    const job = {
      closingDate: '2025-12-31',
      applicationDeadline: '2025-12-30',
    };
    expect(getJobClosingDate(job)).toBe('2025-12-31');
  });

  it('should return applicationDeadline if closingDate not available', () => {
    const job = {
      applicationDeadline: '2025-12-30',
    };
    expect(getJobClosingDate(job)).toBe('2025-12-30');
  });

  it('should return undefined if neither available', () => {
    const job = {};
    expect(getJobClosingDate(job)).toBeUndefined();
  });
});

describe('formatClosingDate', () => {
  it('should format closingDate', () => {
    const job = {
      closingDate: '2025-12-31',
    };
    const formatFn = (date: string) => new Date(date).toLocaleDateString();
    const result = formatClosingDate(job, formatFn);
    expect(result).toBeTruthy();
    expect(result).not.toBe('Not specified');
  });

  it('should format applicationDeadline if closingDate not available', () => {
    const job = {
      applicationDeadline: '2025-12-30',
    };
    const formatFn = (date: string) => new Date(date).toLocaleDateString();
    const result = formatClosingDate(job, formatFn);
    expect(result).toBeTruthy();
    expect(result).not.toBe('Not specified');
  });

  it('should return "Not specified" if no date available', () => {
    const job = {};
    const formatFn = (date: string) => date;
    expect(formatClosingDate(job, formatFn)).toBe('Not specified');
  });
});
