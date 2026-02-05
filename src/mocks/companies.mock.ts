/**
 * Company Mock Data
 */

import type {
  CompanySmallModel as CompanySmall,
  CompanySummaryModel as CompanySummary,
  CompanyDetailModel as CompanyDetail,
} from "@/models/companies";

// Base company data - single source of truth
export const MOCK_COMPANIES: CompanySmall[] = [
  {
    id: "comp_tech_001",
    name: "Innovatech Solutions",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67be8b19-c376-489e-8163-11d636dad84a.png",
  },
  {
    id: "comp_fin_002",
    name: "Global Finance Corp",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/682471d9-c4d8-4148-adca-c62d651b9199.png",
  },
  {
    id: "comp_mar_003",
    name: "Creative Spark Agency",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/72f42cd3-7665-4b38-b358-4492643751ec.png",
  },
  {
    id: "comp_man_004",
    name: "Apex Manufacturing",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/b81675fe-7826-4834-bba7-cde75b444ce3.png",
  },
  {
    id: "comp_health_005",
    name: "MediCare Plus",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67be8b19-c376-489e-8163-11d636dad84a.png",
  },
  {
    id: "comp_edu_006",
    name: "EduTech Solutions",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/682471d9-c4d8-4148-adca-c62d651b9199.png",
  },
];

// Company details - complete information for all companies
export const MOCK_COMPANY_DETAILS: Record<string, CompanyDetail> = {
  comp_tech_001: {
    id: "comp_tech_001",
    name: "Innovatech Solutions",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67be8b19-c376-489e-8163-11d636dad84a.png",
    headerImageUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/41a51722-ee93-43c5-ad10-faf2f4320db1.png",
    location: "Colombo, Sri Lanka", // ✅ Backend field name
    description:
      "Innovatech Solutions is a leading provider of cloud computing and AI services in Sri Lanka. We are committed to fostering innovation and driving digital transformation for our clients across the region.",
    website: "https://innovatech.com",
    headquarters: "Colombo, Sri Lanka", // UI convenience (alias for address)
    establishedYear: 2012,
    employeeCountRange: "501-1000 employees",
  },
  comp_fin_002: {
    id: "comp_fin_002",
    name: "Global Finance Corp",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/682471d9-c4d8-4148-adca-c62d651b9199.png",
    headerImageUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/41a51722-ee93-43c5-ad10-faf2f4320db1.png",
    location: "Colombo, Sri Lanka", // ✅ Backend field name
    description:
      "Global Finance Corp is a premier financial services company providing innovative banking and investment solutions across Sri Lanka and the region.",
    website: "https://globalfinance.com",
    headquarters: "Colombo, Sri Lanka", // UI convenience (alias for address)
    establishedYear: 2008,
    employeeCountRange: "1001-5000 employees",
  },
  comp_mar_003: {
    id: "comp_mar_003",
    name: "Creative Spark Agency",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/72f42cd3-7665-4b38-b358-4492643751ec.png",
    headerImageUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/41a51722-ee93-43c5-ad10-faf2f4320db1.png",
    address: "Kandy, Sri Lanka", // ✅ Added backend-aligned field
    description:
      "Creative Spark Agency specializes in digital marketing, branding, and creative campaigns that drive results for businesses across Sri Lanka.",
    website: "https://creativespark.com",
    headquarters: "Kandy, Sri Lanka", // UI convenience (alias for address)
    establishedYear: 2015,
    employeeCountRange: "51-200 employees",
  },
  comp_man_004: {
    id: "comp_man_004",
    name: "Apex Manufacturing",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/b81675fe-7826-4834-bba7-cde75b444ce3.png",
    headerImageUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/41a51722-ee93-43c5-ad10-faf2f4320db1.png",
    address: "Galle, Sri Lanka", // ✅ Added backend-aligned field
    description:
      "Apex Manufacturing is a leading industrial manufacturing company in Sri Lanka, producing high-quality products for local and international markets.",
    website: "https://apexmanufacturing.com",
    headquarters: "Galle, Sri Lanka", // UI convenience (alias for address)
    establishedYear: 1995,
    employeeCountRange: "501-1000 employees",
  },
  comp_health_005: {
    id: "comp_health_005",
    name: "MediCare Plus",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67be8b19-c376-489e-8163-11d636dad84a.png",
    headerImageUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/41a51722-ee93-43c5-ad10-faf2f4320db1.png",
    description:
      "MediCare Plus provides comprehensive healthcare services and medical solutions across Sri Lanka, improving patient outcomes and community health.",
    website: "https://medicareplus.com",
    address: "Colombo, Sri Lanka", // ✅ Added backend-aligned field
    headquarters: "Colombo, Sri Lanka", // UI convenience (alias for address)
    establishedYear: 2010,
    employeeCountRange: "1001-5000 employees",
  },
  comp_edu_006: {
    id: "comp_edu_006",
    name: "EduTech Solutions",
    logoUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/682471d9-c4d8-4148-adca-c62d651b9199.png",
    headerImageUrl:
      "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/41a51722-ee93-43c5-ad10-faf2f4320db1.png",
    location: "Colombo, Sri Lanka", // ✅ Backend field name
    description:
      "EduTech Solutions develops innovative educational technology platforms in Sri Lanka, transforming learning experiences for students and educators.",
    website: "https://edutechsolutions.com",
    headquarters: "Colombo, Sri Lanka", // UI convenience (alias for address)
    establishedYear: 2018,
    employeeCountRange: "51-200 employees",
  },
};

// Company summary data with stats (derived from details + stats)
// - comp_mar_003: 1 active job (job_006), 1 inactive (job_003)
// - comp_man_004: 1 active job (job_005), 1 closed (job_004)
// - comp_health_005: 0 jobs
// - comp_edu_006: 0 jobs
export const MOCK_COMPANY_SUMMARIES: Record<string, CompanySummary> = {
  comp_tech_001: {
    id: "comp_tech_001",
    name: "Innovatech Solutions",
    logoUrl: MOCK_COMPANY_DETAILS["comp_tech_001"].logoUrl,
    activeJobsCount: 1, // job_001 (Active)
    totalApplicationsReceived: 145,
    industry: "Information Technology",
  },
  comp_fin_002: {
    id: "comp_fin_002",
    name: "Global Finance Corp",
    logoUrl: MOCK_COMPANY_DETAILS["comp_fin_002"].logoUrl,
    activeJobsCount: 1, // job_002 (Active)
    totalApplicationsReceived: 89,
    industry: "Finance",
  },
  comp_mar_003: {
    id: "comp_mar_003",
    name: "Creative Spark Agency",
    logoUrl: MOCK_COMPANY_DETAILS["comp_mar_003"].logoUrl,
    activeJobsCount: 1, // job_006 (Active), job_003 is Inactive
    totalApplicationsReceived: 34,
    industry: "Marketing",
  },
  comp_man_004: {
    id: "comp_man_004",
    name: "Apex Manufacturing",
    logoUrl: MOCK_COMPANY_DETAILS["comp_man_004"].logoUrl,
    activeJobsCount: 1, // job_005 (Active), job_004 is Closed
    totalApplicationsReceived: 52,
    industry: "Manufacturing",
  },
  comp_health_005: {
    id: "comp_health_005",
    name: "MediCare Plus",
    logoUrl: MOCK_COMPANY_DETAILS["comp_health_005"].logoUrl,
    activeJobsCount: 0, // No jobs
    totalApplicationsReceived: 67,
    industry: "Healthcare",
  },
  comp_edu_006: {
    id: "comp_edu_006",
    name: "EduTech Solutions",
    logoUrl: MOCK_COMPANY_DETAILS["comp_edu_006"].logoUrl,
    activeJobsCount: 0, // No jobs
    totalApplicationsReceived: 28,
    industry: "Education",
  },
};

// Backward compatibility exports (for gradual migration)
export const MOCK_COMPANY_DETAIL: CompanyDetail =
  MOCK_COMPANY_DETAILS["comp_tech_001"];
export const MOCK_COMPANY_SUMMARY: CompanySummary =
  MOCK_COMPANY_SUMMARIES["comp_tech_001"];

// Derive MOCK_COMPANIES_LIST from MOCK_COMPANY_SUMMARIES
export const MOCK_COMPANIES_LIST: CompanySummary[] = Object.values(
  MOCK_COMPANY_SUMMARIES
);
