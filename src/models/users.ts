/**
 * Users Collection Model - Backend-Aligned
 * 
 * This model aligns with the backend `users` collection schema.
 * Maps to: users collection
 * 
 * BACKEND SCHEMA (backend/src/models/User.ts):
 * - fullName: string (required)
 * - email: string (required, unique)
 * - password: string (required)
 * - createdAt: Date (auto-generated)
 * - updatedAt: Date (auto-generated)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User Model (Backend Schema Alignment)
 * Maps to backend `users` collection exactly
 */
export interface UserModel {
  id: string; // _id from backend (ObjectId) - mapped from _id
  fullName: string; // ✅ Backend field name
  email: string;
  password?: string; // Only for registration/login, never store in frontend state
  createdAt?: string; // Document creation timestamp (ISO date string)
  updatedAt?: string; // Document last update timestamp (ISO date string)
}

/**
 * User Registration Input Model
 * Used for signup forms - matches backend register endpoint
 */
export interface UserRegistrationModel {
  fullName: string; // ✅ Backend expects fullName
  email: string;
  password: string;
  confirmPassword: string; // UI-only field, not sent to backend
}

/**
 * User Login Input Model
 * Used for login forms - matches backend login endpoint
 */
export interface UserLoginModel {
  email: string;
  password: string;
}

/**
 * Backend Auth Response User Object
 * Structure returned by backend auth endpoints
 */
export interface BackendAuthUser {
  id: string; // _id from backend
  fullName: string;
  email: string;
}

/**
 * Backend Auth Response
 * Structure returned by backend auth endpoints (login/register)
 */
export interface BackendAuthResponse {
  message: string;
  user: BackendAuthUser;
  token: string;
}
