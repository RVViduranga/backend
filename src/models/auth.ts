/**
 * Auth Model - Authentication & Registration Types
 * 
 * This model contains types for authentication, registration, and login forms.
 * Static configuration objects are in @/constants/app.ts
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AuthPageVisuals {
  illustrationUrl: string;
  loginBackgroundUrl: string;
}

// NOTE: Static configuration object has been moved to @/constants/app.ts
// - AUTH_VISUALS

// --- Company Registration Model ---

export interface CompanyRegistrationModel {
  companyName: string;
  industry: string;
  website: string;
  address: string; // ✅ Added: Required by backend companies collection
  phone: string; // ✅ Added: Required by backend users collection
  location: string; // ✅ Added: Required by backend users collection
  email: string;
  password: string;
  confirmPassword: string;
}

// --- User Signup Model ---

export interface UserSignupModel {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
