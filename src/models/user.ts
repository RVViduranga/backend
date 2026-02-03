/**
 * User Model - Backend-Aligned
 * 
 * This model aligns with the backend `users` collection schema.
 * For UI convenience, use UserProfileViewModel which combines User + Profile.
 */

export type UserRole = "Admin" | "Seeker" | "Company";

/**
 * User Model (Backend Schema Alignment)
 * Maps to backend `users` collection
 */
export interface UserModel {
  id: string; // _id from backend (ObjectId)
  email: string;
  password?: string; // Only for registration/login, never store in frontend state
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  isVerified: boolean;
  savedJobPosts: string[]; // Array of Job IDs (ObjectId[])
}

/**
 * User Registration Input Model
 * Used for signup forms
 */
export interface UserRegistrationModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  location: string;
}

/**
 * User Login Input Model
 * Used for login forms
 */
export interface UserLoginModel {
  email: string;
  password: string;
  role?: UserRole; // Optional, can be auto-detected
}
