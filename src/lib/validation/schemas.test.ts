/**
 * Tests for Zod validation schemas
 */
import { describe, it, expect } from 'vitest';
import {
  emailLoginSchema,
  emailSignupSchema,
  companyRegistrationSchema,
  personalDetailsSchema,
  contactInfoSchema,
  experienceSchema,
  educationSchema,
  jobApplicationSchema,
  jobPostSchema,
} from './schemas';

describe('emailLoginSchema', () => {
  it('should validate valid login credentials', () => {
    const valid = {
      email: 'test@example.com',
      password: 'password123',
    };
    expect(emailLoginSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalid = {
      email: 'invalid-email',
      password: 'password123',
    };
    expect(emailLoginSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject empty password', () => {
    const invalid = {
      email: 'test@example.com',
      password: '',
    };
    expect(emailLoginSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('emailSignupSchema', () => {
  it('should validate valid signup data', () => {
    const valid = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      location: 'Colombo',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: true,
    };
    expect(emailSignupSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject if passwords do not match', () => {
    const invalid = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      location: 'Colombo',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Different123',
      agreeToTerms: true,
    };
    const result = emailSignupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject weak password', () => {
    const invalid = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      location: 'Colombo',
      email: 'test@example.com',
      password: 'weak',
      confirmPassword: 'weak',
      agreeToTerms: true,
    };
    expect(emailSignupSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject if terms not agreed', () => {
    const invalid = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      location: 'Colombo',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: false,
    };
    expect(emailSignupSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('companyRegistrationSchema', () => {
  it('should validate valid company registration', () => {
    const valid = {
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'https://example.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };
    expect(companyRegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it('should accept website without http/https', () => {
    const valid = {
      companyName: 'Test Company',
      industry: 'Technology',
      website: 'example.com',
      address: '123 Main St',
      phone: '1234567890',
      location: 'Colombo',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };
    expect(companyRegistrationSchema.safeParse(valid).success).toBe(true);
  });
});

describe('personalDetailsSchema', () => {
  it('should validate valid personal details', () => {
    const valid = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Colombo',
      country: 'Sri Lanka',
      bio: 'Software developer',
    };
    expect(personalDetailsSchema.safeParse(valid).success).toBe(true);
  });

  it('should allow optional bio', () => {
    const valid = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Colombo',
      country: 'Sri Lanka',
    };
    expect(personalDetailsSchema.safeParse(valid).success).toBe(true);
  });
});

describe('contactInfoSchema', () => {
  it('should validate valid contact info', () => {
    const valid = {
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00100',
      country: 'Sri Lanka',
    };
    expect(contactInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('should allow optional alternatePhone', () => {
    const valid = {
      email: 'test@example.com',
      phone: '1234567890',
      alternatePhone: '',
      address: '123 Main St',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00100',
      country: 'Sri Lanka',
    };
    expect(contactInfoSchema.safeParse(valid).success).toBe(true);
  });
});

describe('experienceSchema', () => {
  it('should validate valid experience', () => {
    const valid = {
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      startDate: '2020-01-01',
      endDate: '2022-01-01',
      currentlyWorking: false,
    };
    expect(experienceSchema.safeParse(valid).success).toBe(true);
  });

  it('should allow currentlyWorking without endDate', () => {
    const valid = {
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      startDate: '2020-01-01',
      currentlyWorking: true,
    };
    expect(experienceSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject endDate before startDate', () => {
    const invalid = {
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      startDate: '2022-01-01',
      endDate: '2020-01-01',
      currentlyWorking: false,
    };
    expect(experienceSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('educationSchema', () => {
  it('should validate valid education', () => {
    const valid = {
      school: 'University',
      degree: 'Bachelor\'s',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-01-01',
      endDate: '2020-01-01',
      currentlyStudying: false,
    };
    expect(educationSchema.safeParse(valid).success).toBe(true);
  });

  it('should allow currentlyStudying without endDate', () => {
    const valid = {
      school: 'University',
      degree: 'Bachelor\'s',
      fieldOfStudy: 'Computer Science',
      startDate: '2020-01-01',
      currentlyStudying: true,
    };
    expect(educationSchema.safeParse(valid).success).toBe(true);
  });
});

describe('jobApplicationSchema', () => {
  it('should validate valid job application', () => {
    const valid = {
      fullName: 'John Doe',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Colombo',
      coverLetter: 'I am interested',
      resumeFile: new File([''], 'resume.pdf'),
    };
    expect(jobApplicationSchema.safeParse(valid).success).toBe(true);
  });

  it('should allow optional coverLetter', () => {
    const valid = {
      fullName: 'John Doe',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Colombo',
      resumeFile: new File([''], 'resume.pdf'),
    };
    expect(jobApplicationSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject missing resumeFile', () => {
    const invalid = {
      fullName: 'John Doe',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Colombo',
    };
    expect(jobApplicationSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('jobPostSchema', () => {
  it('should validate a valid job post', () => {
    const validJobPost = {
      title: 'Software Engineer',
      description: 'We are looking for a software engineer',
      location: 'New York',
      jobType: 'Full-Time',
      experienceLevel: 'Mid Level',
      salaryMin: 80000,
      salaryMax: 120000,
      requirements: ['Write code', 'Review PRs', 'Debug issues'],
      qualifications: ['5+ years experience', 'BSc in CS'],
      applicationDeadline: '2025-12-31',
      industry: 'Information Technology',
    };

    const result = jobPostSchema.safeParse(validJobPost);
    expect(result.success).toBe(true);
  });

  it('should reject invalid job post with missing required fields', () => {
    const invalidJobPost = {
      title: '',
      description: 'Test',
    };

    const result = jobPostSchema.safeParse(invalidJobPost);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('should reject empty requirements array', () => {
    const invalid = {
      title: 'Software Engineer',
      description: 'Test',
      location: 'New York',
      jobType: 'Full-Time',
      experienceLevel: 'Mid Level',
      salaryMin: 80000,
      salaryMax: 120000,
      requirements: [],
      applicationDeadline: '2025-12-31',
    };
    expect(jobPostSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject if salaryMax < salaryMin', () => {
    const invalid = {
      title: 'Software Engineer',
      description: 'Test',
      location: 'New York',
      jobType: 'Full-Time',
      experienceLevel: 'Mid Level',
      salaryMin: 120000,
      salaryMax: 80000,
      requirements: ['Write code'],
      applicationDeadline: '2025-12-31',
    };
    expect(jobPostSchema.safeParse(invalid).success).toBe(false);
  });
});






