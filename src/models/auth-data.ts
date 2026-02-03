/**
 * Auth Data - Type Definitions and Static Configuration
 *
 * FOLDER STRUCTURE:
 * - src/data/     → Type definitions + Static config (this file)
 * - src/mocks/    → All mock data (centralized in @/mocks)
 * - src/types/    → New centralized types (gradual migration target)
 *
 * NOTE: This file contains authentication-related types and static configuration.
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
        
      
      