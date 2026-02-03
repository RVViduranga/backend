/**
 * User Roles and Permissions
 */

export const USER_ROLES = {
  USER: 'user',
  COMPANY: 'company',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.USER]: 'Job Seeker',
  [USER_ROLES.COMPANY]: 'Employer',
} as const;

// Permission checks
export const PERMISSIONS = {
  USER: {
    APPLY_TO_JOBS: true,
    SAVE_JOBS: true,
    VIEW_APPLICATIONS: true,
    EDIT_PROFILE: true,
    UPLOAD_CV: true,
    UPLOAD_PORTFOLIO: true,
  },
  COMPANY: {
    POST_JOBS: true,
    MANAGE_JOBS: true,
    VIEW_APPLICATIONS: true,
    REVIEW_APPLICATIONS: true,
    EDIT_PROFILE: true,
  },
} as const;






