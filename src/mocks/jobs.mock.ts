/**
 * Job Mock Data
 */

import type {
  JobSummaryModel as JobSummary,
  JobDetailModel as JobDetail,
  JobSearchHeroModel as JobSearchHero,
} from "@/models/jobPosts";
import type { CompanySmallModel as CompanySmall } from "@/models/companies";
import { MOCK_COMPANIES } from "./companies.mock";

/**
 * Helper function to get company by ID from MOCK_COMPANIES
 * Falls back to first company in list if not found (shouldn't happen with proper data)
 */
const getCompanyById = (id: string): CompanySmall => {
  const company = MOCK_COMPANIES.find((c) => c.id === id);
  if (company) {
    return company;
  }

  // Fallback if company not found (shouldn't happen with proper data)
  // Use first company as fallback instead of hardcoded values
  const fallbackCompany = MOCK_COMPANIES[0] || {
    id: "unknown",
    name: "Unknown Company",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67be8b19-c376-489e-8163-11d636dad84a.png",
  };

  // Try to infer name from ID if possible
  const inferredName = id.includes("tech")
    ? "Innovatech Solutions"
    : id.includes("fin")
    ? "Global Finance Corp"
    : id.includes("mar")
    ? "Creative Spark Agency"
    : id.includes("man")
    ? "Apex Manufacturing"
    : id.includes("health")
    ? "MediCare Plus"
    : id.includes("edu")
    ? "EduTech Solutions"
    : fallbackCompany.name;

  return {
    id,
    name: inferredName,
    logoUrl: fallbackCompany.logoUrl,
  };
};

export const MOCK_JOB_POSTS_MANAGE: JobSummary[] = [
  {
    id: "job_001",
    title: "Senior Full Stack Developer (React/Node)",
    company: getCompanyById("comp_tech_001"),
    location: "Colombo",
    jobType: "Full-Time",
    postedDate: "2025-11-10",
    industry: "Information Technology",
    experienceLevel: "Senior Level",
    status: "Active",
    views: 1250,
    applicationsCount: 42,
  },
  {
    id: "job_002",
    title: "Data Analyst - Financial Products",
    company: getCompanyById("comp_fin_002"),
    location: "Colombo",
    jobType: "Full-Time",
    postedDate: "2025-11-05",
    industry: "Finance",
    experienceLevel: "Mid Level",
    status: "Active",
    views: 890,
    applicationsCount: 18,
  },
  {
    id: "job_003",
    title: "Junior Marketing Associate",
    company: getCompanyById("comp_mar_003"),
    location: "Kandy",
    jobType: "Contract",
    postedDate: "2025-10-28",
    industry: "Marketing",
    experienceLevel: "Entry Level",
    status: "Inactive",
    views: 310,
    applicationsCount: 5,
  },
  {
    id: "job_004",
    title: "Mechanical Engineer Trainee",
    company: getCompanyById("comp_man_004"),
    location: "Galle",
    jobType: "Internship",
    postedDate: "2025-09-15",
    industry: "Manufacturing",
    experienceLevel: "Entry Level",
    status: "Closed",
    views: 600,
    applicationsCount: 12,
  },
];

export const MOCK_JOB_DETAIL: JobDetail = {
  id: "job_001",
  title: "Senior Full Stack Developer (React/Node)",
  company: getCompanyById("comp_tech_001"),
  location: "Colombo",
  jobType: "Full-Time",
  postedDate: "2025-11-10",
  description:
    "Join our dynamic engineering team to build and scale next-generation cloud services. This role demands strong expertise in both front-end (React) and back-end (Node.js) technologies, focusing on creating robust, high-performance applications.",
  responsibilities: [
    "Design and implement scalable RESTful APIs using Node.js.",
    "Develop reusable and maintainable front-end components with React and TypeScript.",
    "Collaborate with product managers and designers to define and ship new features.",
    "Ensure high service availability and operational performance through monitoring and testing.",
  ],
  qualifications: [
    "5+ years of professional software development experience.",
    "Expertise in modern JavaScript (ES6+), React 18+, and Node.js.",
    "Proficiency with SQL and NoSQL databases (e.g., PostgreSQL, MongoDB).",
    "Strong understanding of cloud platforms (AWS, Azure, or GCP).",
    "Bachelor's or Master's degree in Computer Science or related field.",
  ],
  salaryRange: "150000-250000", // ✅ Backend-aligned format (string)
  experienceLevel: "Senior Level",
  applicationDeadline: "2025-12-30", // ✅ Backend-aligned field name
  industry: "Information Technology",
  status: "Active",
  views: 1250,
  applicationsCount: 42,
};

export const MOCK_JOB_SEARCH_RESULTS: JobSummary[] = [
  ...MOCK_JOB_POSTS_MANAGE, // All 4 jobs from MOCK_JOB_POSTS_MANAGE
  {
    id: "job_005",
    title: "Project Coordinator (Construction)",
    company: getCompanyById("comp_man_004"),
    location: "Colombo",
    jobType: "Full-Time",
    postedDate: "2025-11-15",
    industry: "Manufacturing",
    experienceLevel: "Mid Level",
    status: "Active",
  },
  {
    id: "job_006",
    title: "UX/UI Designer",
    company: getCompanyById("comp_mar_003"),
    location: "Colombo",
    jobType: "Contract",
    postedDate: "2025-11-11",
    industry: "Marketing",
    experienceLevel: "Mid Level",
    status: "Active",
  },
];

export const MOCK_JOB_SEARCH_HERO: JobSearchHero = {
  title: "Find Your Dream Job Today",
  subtitle: "Explore thousands of vacancies from leading companies globally.",
  imageUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/34e47979-4af0-44f6-bd64-b21f2cc7df62.png",
};
