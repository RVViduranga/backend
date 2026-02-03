/**
 * Footer Constants
 * Static configuration for footer links
 */

export interface FooterLink {
  label: string;
  href: string;
  external: boolean;
}

/**
 * Footer Links - Base structure
 * Note: Some links are conditionally added based on authentication state
 */
export const FOOTER_LINKS_BASE = {
  forJobSeekers: [
    { label: "Browse Jobs", href: "/jobs", external: false },
    { label: "Browse Companies", href: "/companies", external: false },
    { label: "Career Resources", href: "/resources", external: false },
  ] as const,
  forEmployers: [
    { label: "Post a Job", href: "/job-post", external: false },
    { label: "Pricing", href: "/pricing", external: false },
    { label: "Help & Support", href: "/help-support", external: false },
  ] as const,
  company: [
    { label: "About Us", href: "/about", external: false },
    { label: "Contact Us", href: "/contact", external: false },
    { label: "Resources", href: "/resources", external: false },
    { label: "Help & Support", href: "/help-support", external: false },
  ] as const,
  legal: [
    { label: "Privacy Policy", href: "/privacy", external: false },
    { label: "Terms of Service", href: "/terms", external: false },
    { label: "Cookie Policy", href: "/cookies", external: false },
  ] as const,
} as const;

/**
 * Footer Links - Authenticated User (Job Seeker) additions
 */
export const FOOTER_LINKS_USER_AUTH = [
  { label: "My Dashboard", href: "/user-dashboard", external: false },
  { label: "Saved Jobs", href: "/saved-jobs", external: false },
  { label: "My Applications", href: "/user-applications", external: false },
] as const;

/**
 * Footer Links - Authenticated Company additions
 */
export const FOOTER_LINKS_COMPANY_AUTH = [
  { label: "Company Dashboard", href: "/company-dashboard", external: false },
  { label: "Manage Jobs", href: "/manage-jobs", external: false },
  { label: "Applications", href: "/company-applications", external: false },
] as const;

/**
 * Footer Links - Unauthenticated Company additions
 */
export const FOOTER_LINKS_COMPANY_UNAUTH = [
  { label: "Company Login", href: "/company-login", external: false },
] as const;
