/**
 * Navigation Constants
 * Static configuration arrays for navigation links and dashboard structures
 */

import type {
  DashboardStatModel,
  ProfileManagementLinkModel,
  PersonalDetailsLinkModel,
} from "@/models/profiles";
import type { NavigationLinkModel } from "@/models/site-data";
import type { DashboardLinkModel } from "@/models/companies";

// Re-export types for convenience
export type {
  DashboardStatModel,
  NavigationLinkModel,
  ProfileManagementLinkModel,
  PersonalDetailsLinkModel,
  DashboardLinkModel,
};

/**
 * Dashboard Stats Structure
 * Template for dashboard statistics (values come from backend)
 */
export const DASHBOARD_STATS_STRUCTURE: DashboardStatModel[] = [
  { iconName: "Briefcase", title: "Applied Jobs", value: 0 },
  { iconName: "Bookmark", title: "Saved Jobs", value: 0 },
  { iconName: "CalendarCheck", title: "Interviews Booked", value: 0 },
];

/**
 * User Dashboard Navigation Links
 */
export const USER_DASHBOARD_LINKS: NavigationLinkModel[] = [
  {
    title: "Find Jobs",
    iconName: "Search",
    url: "/search",
  },
  {
    title: "Manage Applications",
    iconName: "ListChecks",
    url: "/dashboard/applications",
  },
  {
    title: "Edit Profile",
    iconName: "UserCog",
    url: "/profile/manage",
  },
];

/**
 * Profile Management Navigation Links
 */
export const PROFILE_MANAGEMENT_LINKS: ProfileManagementLinkModel[] = [
  {
    title: "Personal Details",
    iconName: "Contact",
    url: "/profile/edit-details",
    description:
      "Update critical information like contact details and location.",
  },
  {
    title: "CV / Resume Management",
    iconName: "FileText",
    url: "/profile/cv-manage",
    description: "Upload and organize different versions of your CV.",
  },
  {
    title: "Profile Media & Portfolio",
    iconName: "GalleryHorizontal",
    url: "/profile/media-manage",
    description: "Add a profile photo, portfolio samples, or certifications.",
  },
];

/**
 * Personal Details Navigation Links
 */
export const PERSONAL_DETAILS_LINKS: PersonalDetailsLinkModel[] = [
  {
    title: "Contact Information",
    iconName: "Phone",
    url: "/profile/edit-details/contact",
    description: "Edit your phone number, email, and address.",
  },
  {
    title: "Experience & Education",
    iconName: "Briefcase",
    url: "/profile/edit-details/experience",
    description: "Manage your work history and academic background.",
  },
];

/**
 * Company Dashboard Navigation Links
 */
export const COMPANY_DASHBOARD_LINKS: DashboardLinkModel[] = [
  {
    title: "Post New Job",
    iconName: "PlusCircle",
    url: "/company/post-job",
    description: "Create a new job vacancy listing immediately.",
  },
  {
    title: "Manage Active Jobs",
    iconName: "Briefcase",
    url: "/company/jobs",
    description: "View, edit, or archive your current job postings.",
  },
  {
    title: "Review Applications",
    iconName: "Users",
    url: "/company/applications",
    description: "Track and evaluate candidates for open roles.",
  },
];

/**
 * Main Navigation Links - User (Job Seeker)
 */
export const MAIN_NAV_LINKS_USER = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Find Candidates", href: "/candidates" },
  { label: "Companies", href: "/companies" },
  { label: "Resources", href: "/resources" },
] as const;

/**
 * Main Navigation Links - Company (Employer)
 */
export const MAIN_NAV_LINKS_COMPANY = [
  { label: "Find Candidates", href: "/candidates" },
  { label: "Dashboard", href: "/company-dashboard" },
  { label: "Post Job", href: "/job-post" },
  { label: "Manage Jobs", href: "/manage-jobs" },
] as const;

/**
 * Dashboard Sidebar Menu Items - User
 */
export interface DashboardMenuItem {
  title: string;
  icon: string;
  href: string;
}

export const USER_DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  {
    title: "Overview",
    icon: "LayoutDashboard",
    href: "/user-dashboard",
  },
  {
    title: "My Applications",
    icon: "FileText",
    href: "/user-applications",
  },
  {
    title: "Saved Jobs",
    icon: "Bookmark",
    href: "/saved-jobs",
  },
  {
    title: "Profile",
    icon: "User",
    href: "/user-profile-view",
  },
  {
    title: "Settings",
    icon: "Settings",
    href: "/user-settings",
  },
];

/**
 * Dashboard Sidebar Menu Items - Company
 */
export const COMPANY_DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  {
    title: "Overview",
    icon: "LayoutDashboard",
    href: "/company-dashboard",
  },
  {
    title: "Post Job",
    icon: "PlusCircle",
    href: "/job-post",
  },
  {
    title: "Manage Jobs",
    icon: "Briefcase",
    href: "/manage-jobs",
  },
  {
    title: "Applications",
    icon: "Users",
    href: "/company-applications",
  },
  {
    title: "Company Profile",
    icon: "Building2",
    href: "/company-profile-edit",
  },
  {
    title: "Settings",
    icon: "Settings",
    href: "/company-settings",
  },
];
