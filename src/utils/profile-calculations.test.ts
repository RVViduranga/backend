/**
 * Tests for Profile Calculation Utilities
 */
import { describe, it, expect } from 'vitest';
import {
  calculateExperienceYears,
  calculateQualificationScore,
  calculateSkillScore,
  splitFullName,
} from './profile-calculations';
import type { ExperienceModel } from '@/models/experience';
import type { EducationModel } from '@/models/education';

describe('calculateExperienceYears', () => {
  it('should return 0 for empty array', () => {
    expect(calculateExperienceYears([])).toBe(0);
  });

  it('should calculate years from startDate to endDate', () => {
    const experience: ExperienceModel[] = [
      {
        title: 'Developer',
        company: 'Company A',
        location: 'Colombo',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
        description: 'Worked on projects',
      },
    ];
    const result = calculateExperienceYears(experience);
    expect(result).toBeCloseTo(2, 1);
  });

  it('should use current date if endDate not provided', () => {
    const experience: ExperienceModel[] = [
      {
        title: 'Developer',
        company: 'Company A',
        location: 'Colombo',
        startDate: '2020-01-01',
        endDate: null,
        description: 'Current job',
      },
    ];
    const result = calculateExperienceYears(experience);
    const expectedYears = (new Date().getTime() - new Date('2020-01-01').getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    expect(result).toBeCloseTo(expectedYears, 1);
  });

  it('should sum multiple experiences', () => {
    const experience: ExperienceModel[] = [
      {
        title: 'Developer',
        company: 'Company A',
        location: 'Colombo',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        description: 'Job 1',
      },
      {
        title: 'Senior Developer',
        company: 'Company B',
        location: 'Colombo',
        startDate: '2021-01-01',
        endDate: '2023-01-01',
        description: 'Job 2',
      },
    ];
    const result = calculateExperienceYears(experience);
    expect(result).toBeCloseTo(3, 1);
  });

  it('should handle invalid dates gracefully', () => {
    const experience: ExperienceModel[] = [
      {
        title: 'Developer',
        company: 'Company A',
        location: 'Colombo',
        startDate: 'invalid-date',
        endDate: '2022-01-01',
        description: 'Invalid',
      },
    ];
    const result = calculateExperienceYears(experience);
    expect(result).toBe(0);
  });
});

describe('calculateQualificationScore', () => {
  it('should return 0 for empty array', () => {
    expect(calculateQualificationScore([])).toBe(0);
  });

  it('should return 10 for PhD', () => {
    const education: EducationModel[] = [
      {
        institution: 'University',
        degree: 'PhD in Computer Science',
        fieldOfStudy: 'CS',
        startDate: '2010-01-01',
        endDate: '2014-01-01',
      },
    ];
    expect(calculateQualificationScore(education)).toBe(10);
  });

  it('should return 8 for Master\'s', () => {
    const education: EducationModel[] = [
      {
        institution: 'University',
        degree: 'Master\'s in Computer Science',
        fieldOfStudy: 'CS',
        startDate: '2010-01-01',
        endDate: '2012-01-01',
      },
    ];
    expect(calculateQualificationScore(education)).toBe(8);
  });

  it('should return 6 for Bachelor\'s', () => {
    const education: EducationModel[] = [
      {
        institution: 'University',
        degree: 'Bachelor\'s in Computer Science',
        fieldOfStudy: 'CS',
        startDate: '2010-01-01',
        endDate: '2014-01-01',
      },
    ];
    expect(calculateQualificationScore(education)).toBe(6);
  });

  it('should return highest score for multiple degrees', () => {
    const education: EducationModel[] = [
      {
        institution: 'University',
        degree: 'Bachelor\'s',
        fieldOfStudy: 'CS',
        startDate: '2010-01-01',
        endDate: '2014-01-01',
      },
      {
        institution: 'University',
        degree: 'Master\'s',
        fieldOfStudy: 'CS',
        startDate: '2014-01-01',
        endDate: '2016-01-01',
      },
    ];
    expect(calculateQualificationScore(education)).toBe(8);
  });
});

describe('calculateSkillScore', () => {
  it('should calculate skill score from experience and education', () => {
    const experience: ExperienceModel[] = [
      {
        title: 'Developer',
        company: 'Company A',
        location: 'Colombo',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
        description: 'Worked',
      },
    ];
    const education: EducationModel[] = [
      {
        institution: 'University',
        degree: 'Bachelor\'s',
        fieldOfStudy: 'CS',
        startDate: '2010-01-01',
        endDate: '2014-01-01',
      },
    ];
    const result = calculateSkillScore(experience, education);
    // (2 years * 0.5) + (6 * 0.5) = 1 + 3 = 4
    expect(result).toBeCloseTo(4, 1);
  });

  it('should cap score at 10', () => {
    const experience: ExperienceModel[] = [
      {
        title: 'Developer',
        company: 'Company A',
        location: 'Colombo',
        startDate: '2010-01-01',
        endDate: '2025-01-01',
        description: 'Long experience',
      },
    ];
    const education: EducationModel[] = [
      {
        institution: 'University',
        degree: 'PhD',
        fieldOfStudy: 'CS',
        startDate: '2010-01-01',
        endDate: '2014-01-01',
      },
    ];
    const result = calculateSkillScore(experience, education);
    expect(result).toBeLessThanOrEqual(10);
  });
});

describe('splitFullName', () => {
  it('should split "John Doe" correctly', () => {
    const result = splitFullName('John Doe');
    expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
  });

  it('should split "John Michael Doe" correctly', () => {
    const result = splitFullName('John Michael Doe');
    expect(result).toEqual({ firstName: 'John', lastName: 'Michael Doe' });
  });

  it('should handle single name', () => {
    const result = splitFullName('John');
    expect(result).toEqual({ firstName: 'John', lastName: '' });
  });

  it('should handle empty string', () => {
    const result = splitFullName('');
    expect(result).toEqual({ firstName: '', lastName: '' });
  });

  it('should handle whitespace', () => {
    const result = splitFullName('  John   Doe  ');
    expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
  });
});
