// Create company (for POST /api/companies)
import Company from '../models/Company';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      location,
      website,
      logoUrl,
      headerImageUrl,
      headquarters,
      establishedYear,
      employeeCountRange,
      industry
    } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ success: false, data: null, message: "Missing required fields" });
    }

    const company = await Company.create({
      name,
      description,
      location,
      website,
      logoUrl,
      headerImageUrl,
      headquarters,
      establishedYear,
      employeeCountRange,
      industry
    });
    res.status(201).json({ success: true, data: company, message: "Company created successfully" });
  } catch (err) {
    next(err);
  }
};
// --- New Company Endpoints ---
export const getCompanyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get userId from JWT token (set by auth middleware)
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, data: null, message: "Unauthorized" });
    }

    // Get user's fullName to find matching company
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "User not found" });
    }

    // Find company where name matches user's fullName
    // During registration, we set fullName = companyName, so this should match
    const company = await Company.findOne({ name: user.fullName });
    if (!company) {
      return res.status(404).json({ success: false, data: null, message: "Company profile not found" });
    }

    res.status(200).json({ success: true, data: company, message: "Company profile fetched successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateCompanyProfile = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement update company profile for authenticated company
  (res as any).sendSuccess(null, 'updateCompanyProfile not implemented');
};

export const createCompanyJob = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement create job for company
  (res as any).sendSuccess(null, 'createCompanyJob not implemented');
};

export const getCompanyJobs = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement get all jobs for company
  (res as any).sendSuccess(null, 'getCompanyJobs not implemented');
};

export const getCompanyJobById = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement get job by id for company
  (res as any).sendSuccess(null, 'getCompanyJobById not implemented');
};

export const updateCompanyJobById = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement update job by id for company
  (res as any).sendSuccess(null, 'updateCompanyJobById not implemented');
};

export const deleteCompanyJobById = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement delete job by id for company
  (res as any).sendSuccess(null, 'deleteCompanyJobById not implemented');
};

export const getCompanyApplications = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement get all applications for company
  (res as any).sendSuccess(null, 'getCompanyApplications not implemented');
};

export const getJobApplications = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement get all applications for a job (company)
  (res as any).sendSuccess(null, 'getJobApplications not implemented');
};
import { getPaginatedData } from '../services/paginationService';


export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || parseInt(req.query.pageSize as string) || 20;
    
    const result = await getPaginatedData(Company, req.query);
    const totalPages = Math.ceil(result.total / limit);
    
    // Transform to match frontend expected format
    const response = {
      items: result.data || [],
      total: result.total || 0,
      page: page,
      limit: limit,
      totalPages: totalPages,
    };
    
    (res as any).sendSuccess(response, 'Companies fetched');
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = (req: Request, res: Response, next: NextFunction) => {
  Company.findById(req.params.id)
    .then(company => {
      if (!company) {
        return res.status(404).json({ success: false, data: null, message: "Company not found" });
      }
      res.status(200).json({ success: true, data: company, message: "Company fetched" });
    })
    .catch(err => {
      next(err);
    });
};



export const updateCompany = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement update company logic
  (res as any).sendSuccess(null, 'updateCompany not implemented');
};

export const deleteCompany = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement delete company logic
  (res as any).sendSuccess(null, 'deleteCompany not implemented');
};
