/**
 * Application Mock Data
 */

import type { ApplicationModel as Application, UserApplicationModel as UserApplication } from "@/models/applications";
import type { JobSummaryModel as JobSummary } from "@/models/jobPosts";
import { MOCK_COMPANIES } from "./companies.mock";
import { MOCK_JOB_POSTS_MANAGE, MOCK_JOB_SEARCH_RESULTS } from "./jobs.mock";

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app_001",
    job: "job_001", // ✅ Backend field name
    applicant: "user_app_001", // ✅ Backend field name
    appliedAt: "2025-11-15", // ✅ Backend field name
    cvFilePath: "/api/download/cv_004", // ✅ Backend field name
    status: "Reviewed", // ✅ Capitalized status
    jobTitle: "Senior Full Stack Developer (React/Node)",
    candidateName: "John Smith",
    candidateEmail: "john.smith@example.com",
    candidateLocation: "Colombo",
    experienceLevel: "Senior Level",
  },
  {
    id: "app_002",
    job: "job_001",
    applicant: "user_app_002",
    appliedAt: "2025-11-14",
    cvFilePath: "/api/download/cv_005",
    status: "Reviewed", // ✅ Capitalized status
    jobTitle: "Senior Full Stack Developer (React/Node)",
    candidateName: "Sarah Johnson",
    candidateEmail: "sarah.j@example.com",
    candidateLocation: "Kandy",
    experienceLevel: "Mid Level",
  },
  {
    id: "app_003",
    job: "job_001",
    applicant: "user_app_003",
    appliedAt: "2025-11-13",
    cvFilePath: "/api/download/cv_006",
    status: "Reviewed", // ✅ Capitalized status (interview maps to Reviewed)
    jobTitle: "Senior Full Stack Developer (React/Node)",
    candidateName: "Michael Chen",
    candidateEmail: "m.chen@example.com",
    candidateLocation: "Galle",
    experienceLevel: "Senior Level",
  },
  {
    id: "app_004",
    job: "job_002",
    applicant: "user_app_004",
    appliedAt: "2025-11-12",
    cvFilePath: "/api/download/cv_007",
    status: "Pending", // ✅ Capitalized status
    jobTitle: "Data Analyst - Financial Products",
    candidateName: "Emma Williams",
    candidateEmail: "emma.w@example.com",
    candidateLocation: "Colombo",
    experienceLevel: "Mid Level",
  },
  {
    id: "app_005",
    job: "job_002",
    applicant: "user_app_005",
    appliedAt: "2025-11-11",
    cvFilePath: "/api/download/cv_008",
    status: "Reviewed", // ✅ Capitalized status
    jobTitle: "Data Analyst - Financial Products",
    candidateName: "David Brown",
    candidateEmail: "david.brown@example.com",
    candidateLocation: "Negombo",
    experienceLevel: "Mid Level",
  },
  {
    id: "app_006",
    job: "job_003",
    applicant: "user_app_006",
    appliedAt: "2025-11-10",
    cvFilePath: "/api/download/cv_009",
    status: "Accepted", // ✅ Capitalized status
    jobTitle: "Junior Marketing Associate",
    candidateName: "Lisa Anderson",
    candidateEmail: "lisa.a@example.com",
    candidateLocation: "Kandy",
    experienceLevel: "Entry Level",
  },
  {
    id: "app_007",
    job: "job_001",
    applicant: "user_app_007",
    appliedAt: "2025-11-09",
    cvFilePath: "/api/download/cv_010",
    status: "Rejected", // ✅ Capitalized status
    jobTitle: "Senior Full Stack Developer (React/Node)",
    candidateName: "Robert Taylor",
    candidateEmail: "r.taylor@example.com",
    candidateLocation: "Colombo",
    experienceLevel: "Mid Level",
  },
];

/**
 * Helper to create job summary for user applications
 * Fetches actual job data from mock jobs and merges with company info
 */
const createJobSummary = (
  id: string,
  title: string,
  companyId: string,
  companyName: string
): JobSummary => {
  // Find actual job data from all mock jobs
  const allMockJobs = [...MOCK_JOB_POSTS_MANAGE, ...MOCK_JOB_SEARCH_RESULTS];
  const actualJob = allMockJobs.find((job) => job.id === id);

  // Get company logo from MOCK_COMPANIES
  const company = MOCK_COMPANIES.find((c) => c.id === companyId);
  const logoUrl =
    company?.logoUrl ||
    MOCK_COMPANIES[0]?.logoUrl ||
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67be8b19-c376-489e-8163-11d636dad84a.png";

  // Use actual job data if found, otherwise use provided values with safe defaults
  return {
    id,
    title: actualJob?.title || title,
    company: {
      id: companyId,
      name: companyName,
      logoUrl,
    },
    location: actualJob?.location || "Colombo",
    jobType: actualJob?.jobType || "Full-Time",
    postedDate: actualJob?.postedDate || "2025-11-10",
    industry: actualJob?.industry || "Information Technology",
    experienceLevel: actualJob?.experienceLevel || "Senior Level",
  };
};

// User applications mapped by user ID
// Each user has their own set of applications
export const MOCK_USER_APPLICATIONS_MAP: Record<string, UserApplication[]> = {
  // Anya Sharma (user_001) - Senior Software Engineer
  user_001: [
    {
      id: "app_user_001_1",
      jobId: "job_001", // UserApplicationModel still uses jobId
      appliedDate: "2025-11-15", // UserApplicationModel still uses appliedDate
      status: "Reviewed",
      job: createJobSummary(
        "job_001",
        "Senior Full Stack Developer (React/Node)",
        "comp_tech_001",
        "Innovatech Solutions"
      ),
    },
    {
      id: "app_user_001_2",
      jobId: "job_002",
      appliedDate: "2025-11-10",
      status: "Reviewed",
      job: createJobSummary(
        "job_002",
        "Data Analyst - Financial Products",
        "comp_fin_002",
        "Global Finance Corp"
      ),
    },
  ],
  
  // John Doe (user_002) - Data Analyst
  user_002: [
    {
      id: "app_user_002_1",
      jobId: "job_002",
      appliedDate: "2025-11-12",
      status: "Pending",
      job: createJobSummary(
        "job_002",
        "Data Analyst - Financial Products",
        "comp_fin_002",
        "Global Finance Corp"
      ),
    },
  ],
  
  // John Smith (user_app_001) - Senior Developer
  user_app_001: [
    {
      id: "app_user_app_001_1",
      jobId: "job_001",
      appliedDate: "2025-11-15",
      status: "Reviewed",
      job: createJobSummary(
        "job_001",
        "Senior Full Stack Developer (React/Node)",
        "comp_tech_001",
        "Innovatech Solutions"
      ),
    },
  ],
  
  // Sarah Johnson (user_app_002) - Mid-Level Developer
  user_app_002: [
    {
      id: "app_user_app_002_1",
      jobId: "job_001",
      appliedDate: "2025-11-14",
      status: "Reviewed",
      job: createJobSummary(
        "job_001",
        "Senior Full Stack Developer (React/Node)",
        "comp_tech_001",
        "Innovatech Solutions"
      ),
    },
    {
      id: "app_user_app_002_2",
      jobId: "job_003",
      appliedDate: "2025-11-10",
      status: "Pending",
      job: createJobSummary(
        "job_003",
        "Junior Marketing Associate",
        "comp_mar_003",
        "Creative Spark Agency"
      ),
    },
  ],
  
  // Michael Chen (user_app_003) - Senior Developer
  user_app_003: [
    {
      id: "app_user_app_003_1",
      jobId: "job_001",
      appliedDate: "2025-11-13",
      status: "Reviewed",
      job: createJobSummary(
        "job_001",
        "Senior Full Stack Developer (React/Node)",
        "comp_tech_001",
        "Innovatech Solutions"
      ),
    },
  ],
  
  // Emma Williams (user_app_004) - Data Analyst
  user_app_004: [
    {
      id: "app_user_app_004_1",
      jobId: "job_002",
      appliedDate: "2025-11-12",
      status: "Pending",
      job: createJobSummary(
        "job_002",
        "Data Analyst - Financial Products",
        "comp_fin_002",
        "Global Finance Corp"
      ),
    },
  ],
  
  // David Brown (user_app_005) - Data Analyst
  user_app_005: [
    {
      id: "app_user_app_005_1",
      jobId: "job_002",
      appliedDate: "2025-11-11",
      status: "Reviewed",
      job: createJobSummary(
        "job_002",
        "Data Analyst - Financial Products",
        "comp_fin_002",
        "Global Finance Corp"
      ),
    },
  ],
  
  // Lisa Anderson (user_app_006) - Marketing Professional
  user_app_006: [
    {
      id: "app_user_app_006_1",
      jobId: "job_003",
      appliedDate: "2025-11-10",
      status: "Accepted",
      job: createJobSummary(
        "job_003",
        "Junior Marketing Associate",
        "comp_mar_003",
        "Creative Spark Agency"
      ),
    },
  ],
  
  // Robert Taylor (user_app_007) - Mid-Level Developer
  user_app_007: [
    {
      id: "app_user_app_007_1",
      jobId: "job_001",
      appliedDate: "2025-11-09",
      status: "Rejected",
      job: createJobSummary(
        "job_001",
        "Senior Full Stack Developer (React/Node)",
        "comp_tech_001",
        "Innovatech Solutions"
      ),
    },
    {
      id: "app_user_app_007_2",
      jobId: "job_004",
      appliedDate: "2025-10-20",
      status: "Reviewed",
      job: createJobSummary(
        "job_004",
        "Mechanical Engineer Trainee",
        "comp_man_004",
        "Apex Manufacturing"
      ),
    },
  ],
};

// Backward compatibility - default applications (for user_001)
export const MOCK_USER_APPLICATIONS: UserApplication[] = MOCK_USER_APPLICATIONS_MAP["user_001"] || [];
