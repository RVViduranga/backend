/**
 * Job Data Transformation Utilities
 * Converts form data to job detail model format
 * Updated to use backend-aligned models (SalaryRangeModel)
 */
import type { JobDetailModel, SalaryRangeModel } from '@/models/job';
import type { JobPostInputModel } from '@/models/job-data-forms';
import type { CompanySmallModel } from '@/models/company';

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
    salaryRange: { min: formData.salaryMin, max: formData.salaryMax }, // ✅ Changed to object
    closingDate: formData.applicationDeadline, // ✅ Renamed from applicationDeadline
    postedBy: postedBy || '', // ✅ Added
    status: 'Active', // ✅ Added
    responsibilities: formData.requirements,
    qualifications: formData.requirements || formData.qualifications || [],
  };
}


