/**
 * Job Data Transformation Utilities
 * Converts form data to job detail model format
 * Updated to use backend-aligned models (SalaryRangeModel)
 */
import type { JobDetailModel, SalaryRangeModel, JobPostInputModel } from '@/models/jobPosts';
import type { CompanySmallModel } from '@/models/companies';

/**
 * Transform form data to JobDetailModel format (Backend-Aligned)
 * Uses SalaryRangeModel object instead of string
 */
export function transformFormDataToJobDetail(
  formData: JobPostInputModel,
  jobId: string,
  companyProfile: { id: string; name: string; logoUrl: string } | null,
  postedBy?: string // ✅ Added: User ID who posted the job
): JobDetailModel {
  const fallbackCompany: CompanySmallModel = {
    id: 'unknown',
    name: 'Unknown Company',
    logoUrl: '',
  };

  return {
    id: jobId,
    title: formData.title,
    description: formData.description,
    company: companyProfile || fallbackCompany,
    location: formData.location,
    jobType: formData.jobType,
    postedDate: new Date().toISOString().split('T')[0],
    experienceLevel: formData.experienceLevel,
    salaryRange: `${formData.salaryMin}-${formData.salaryMax}`, // ✅ Backend uses string format
    applicationDeadline: formData.applicationDeadline, // ✅ Backend field name
    status: 'Active', // ✅ Added
    responsibilities: formData.requirements,
    qualifications: formData.requirements || formData.qualifications || [],
  };
}


