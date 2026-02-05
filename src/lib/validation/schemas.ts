/**
 * Form Validation Schemas
 * Centralized Zod schemas for all form validations
 */

import { z } from "zod";

// ==================== Common Validation Utilities ====================

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number")
  .refine((val) => val.replace(/\D/g, "").length >= 10, {
    message: "Phone number must have at least 10 digits",
  });

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
  .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
  .regex(/(?=.*\d)/, "Password must contain at least one number");

const urlSchema = z
  .string()
  .min(1, "Website URL is required")
  .refine(
    (val) => {
      try {
        new URL(val.startsWith("http") ? val : `https://${val}`);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Please enter a valid website URL" }
  );

// ==================== Auth Forms ====================

export const emailLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const emailSignupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required").trim(), // ✅ Backend uses fullName
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const companyRegistrationSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required").trim(),
    industry: z.string().min(1, "Industry is required"),
    website: urlSchema.optional(),
    address: z.string().min(1, "Address is required").trim(), // ✅ UI field (maps to location in backend)
    phone: z.string().min(1, "Phone number is required").trim(),
    location: z.string().min(1, "Location is required").trim(), // ✅ Backend field name
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ==================== User Profile Forms ====================

export const personalDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required").trim(), // ✅ Backend uses fullName
  email: emailSchema,
  phone: phoneSchema.optional(),
  location: z.string().min(1, "Location is required").trim(), // ✅ Backend uses location
  headline: z.string().optional(), // ✅ Backend uses headline (not bio)
});

export const contactInfoSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  alternatePhone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  state: z.string().min(1, "State/Province is required").trim(),
  zipCode: z.string().min(1, "Zip/Postal code is required").trim(),
  country: z.string().min(1, "Country is required").trim(),
});

export const experienceSchema = z
  .object({
    jobTitle: z.string().min(1, "Job title is required").trim(),
    company: z.string().min(1, "Company name is required").trim(),
    employmentType: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    currentlyWorking: z.boolean().default(false),
    description: z.string().optional(),
  })
  .refine((data) => data.currentlyWorking || data.endDate, {
    message: "End date is required if not currently working",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.currentlyWorking || !data.startDate || !data.endDate) {
        return true;
      }
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const educationSchema = z
  .object({
    school: z.string().min(1, "School/University name is required").trim(),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required").trim(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    currentlyStudying: z.boolean().default(false),
    grade: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.currentlyStudying || data.endDate, {
    message: "End date is required if not currently studying",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.currentlyStudying || !data.startDate || !data.endDate) {
        return true;
      }
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// ==================== Job Application Forms ====================

export const jobApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required").trim(),
  email: emailSchema,
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Please enter a valid phone number"
    ),
  location: z.string().min(1, "Location is required").trim(),
  coverLetter: z
    .string()
    .max(1000, "Cover letter must be less than 1000 characters")
    .optional(),
  resumeFile: z.any().refine((file) => file !== null && file !== undefined, {
    message: "Please upload your resume",
  }),
});

// ==================== Job Post Forms ====================

export const jobPostSchema = z
  .object({
    title: z.string().min(1, "Job title is required").trim(),
    description: z.string().min(1, "Job description is required").trim(),
    requirements: z
      .array(z.string())
      .min(1, "At least one requirement is needed"),
    qualifications: z.array(z.string()).optional(),
    location: z.string().min(1, "Location is required"),
    jobType: z.string().min(1, "Job type is required"),
    experienceLevel: z.string().min(1, "Experience level is required"),
    salaryMin: z
      .number()
      .positive("Minimum salary must be greater than 0")
      .or(z.string().transform((val) => parseInt(val) || 0)),
    salaryMax: z
      .number()
      .positive("Maximum salary must be greater than 0")
      .or(z.string().transform((val) => parseInt(val) || 0)),
    applicationDeadline: z.string().min(1, "Application deadline is required"),
    industry: z.string().optional(),
  })
  .refine(
    (data) => {
      const min =
        typeof data.salaryMin === "number"
          ? data.salaryMin
          : parseInt(String(data.salaryMin));
      const max =
        typeof data.salaryMax === "number"
          ? data.salaryMax
          : parseInt(String(data.salaryMax));
      return max >= min;
    },
    {
      message: "Maximum salary must be greater than minimum",
      path: ["salaryMax"],
    }
  );

// ==================== Type Exports ====================

export type EmailLoginInput = z.infer<typeof emailLoginSchema>;
export type EmailSignupInput = z.infer<typeof emailSignupSchema>;
export type CompanyRegistrationInput = z.infer<
  typeof companyRegistrationSchema
>;
export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type JobPostInput = z.infer<typeof jobPostSchema>;
