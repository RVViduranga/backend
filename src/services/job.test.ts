/**
 * Integration Tests for Job Service
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { jobService } from './job';
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
});

describe('jobService.searchJobs', () => {
  it('should search jobs without filters', async () => {
    const result = await jobService.searchJobs({});

    expect(result.jobs).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBeDefined();
    expect(result.limit).toBeDefined();
  });

  it('should filter jobs by query', async () => {
    const result = await jobService.searchJobs({ query: 'Software' });

    expect(result.jobs).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
    // All results should match query
    result.jobs.forEach((job) => {
      const matches =
        job.title.toLowerCase().includes('software') ||
        job.company.name.toLowerCase().includes('software') ||
        (job.industry && job.industry.toLowerCase().includes('software'));
      expect(matches).toBe(true);
    });
  });

  it('should filter jobs by location', async () => {
    const result = await jobService.searchJobs({ location: ['Colombo'] });

    expect(result.jobs).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
    // All results should match location
    result.jobs.forEach((job) => {
      expect(job.location).toBe('Colombo');
    });
  });

  it('should filter jobs by job type', async () => {
    const result = await jobService.searchJobs({ jobType: ['Full-Time'] });

    expect(result.jobs).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
    // All results should match job type
    result.jobs.forEach((job) => {
      expect(job.jobType).toBe('Full-Time');
    });
  });

  it('should filter jobs by industry', async () => {
    const result = await jobService.searchJobs({ industry: ['Technology'] });

    expect(result.jobs).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
    // All results should match industry
    result.jobs.forEach((job) => {
      expect(job.industry).toBe('Technology');
    });
  });

  it('should filter jobs by experience level', async () => {
    const result = await jobService.searchJobs({ experienceLevel: ['Senior'] });

    expect(result.jobs).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
    // All results should match experience level
    result.jobs.forEach((job) => {
      expect(job.experienceLevel).toBe('Senior');
    });
  });

  it('should support pagination', async () => {
    const result = await jobService.searchJobs({ page: 1, limit: 5 });

    expect(result.jobs).toBeDefined();
    expect(result.page).toBe(1);
    expect(result.limit).toBe(5);
    expect(result.jobs.length).toBeLessThanOrEqual(5);
  });
});

describe('jobService.getJobById', () => {
  it('should get job by ID', async () => {
    const job = await jobService.getJobById('job_001');

    expect(job).toBeDefined();
    expect(job.id).toBe('job_001');
    expect(job.title).toBeDefined();
    expect(job.description).toBeDefined();
  });

  it('should return default job if ID not found', async () => {
    const job = await jobService.getJobById('nonexistent_id');

    expect(job).toBeDefined();
    expect(job.title).toBeDefined();
  });
});

// Note: getJobSearchHero is not implemented in jobService
// It's available as MOCK_JOB_SEARCH_HERO constant

describe('jobService.getFilterOptions', () => {
  it('should get filter options', async () => {
    const options = await jobService.getFilterOptions();

    expect(options.locations).toBeDefined();
    expect(Array.isArray(options.locations)).toBe(true);
    expect(options.industries).toBeDefined();
    expect(Array.isArray(options.industries)).toBe(true);
    expect(options.experienceLevels).toBeDefined();
    expect(Array.isArray(options.experienceLevels)).toBe(true);
    expect(options.jobTypes).toBeDefined();
    expect(Array.isArray(options.jobTypes)).toBe(true);
  });
});

// Note: applyToJob is not implemented in jobService
// Job applications are handled through userService or companyService
