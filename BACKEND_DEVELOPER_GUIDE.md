# Backend Developer Integration Guide

**Frontend Status**: ✅ **READY FOR BACKEND INTEGRATION**

This document provides everything the backend developer needs to integrate with the frontend.

---

## 🚀 Quick Start

### 1. API Base URL
The frontend expects the backend API at:
- **Development**: `http://localhost:3000/api` (default fallback)
- **Production**: Set via `VITE_API_BASE_URL` environment variable

### 2. Enable Backend Integration
1. Set `VITE_API_BASE_URL` environment variable
2. Uncomment backend API code sections in service files
3. Remove/comment out mock data sections

---

## 📡 API Endpoints Required

All endpoints are defined in `src/constants/index.ts`. Here's what the backend needs to implement:

### Authentication Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/google
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/change-password
```

### User Endpoints

```
GET    /api/users/profile
PATCH  /api/users/profile
GET    /api/users/profile/details
PATCH  /api/users/profile/details
GET    /api/users/saved-jobs
POST   /api/jobs/:id/save
DELETE /api/jobs/:id/unsave
GET    /api/users/applications
GET    /api/users/applications/:id
POST   /api/users/cv/upload
GET    /api/users/cv
GET    /api/users/cv/:id
PUT    /api/users/cv/:id/primary
DELETE /api/users/cv/:id
POST   /api/users/portfolio/upload
GET    /api/users/portfolio
GET    /api/users/portfolio/:id
DELETE /api/users/portfolio/:id
```

### Company Endpoints

```
GET    /api/companies/profile
PATCH  /api/companies/profile
GET    /api/companies/:id
GET    /api/companies
POST   /api/companies/jobs
GET    /api/companies/jobs
GET    /api/companies/jobs/:id
PATCH  /api/companies/jobs/:id
DELETE /api/companies/jobs/:id
GET    /api/companies/applications
GET    /api/companies/jobs/:id/applications
GET    /api/applications/:id
PATCH  /api/applications/:id
```

### Job Endpoints

```
GET    /api/jobs/search
GET    /api/jobs/:id
POST   /api/jobs/:id/apply
GET    /api/jobs/:id/related
```

### Analytics Endpoints

```
GET    /api/analytics/platform-stats
POST   /api/analytics/newsletter/subscribe
POST   /api/contact
```

---

## 📋 Request/Response Formats

### Authentication

#### Login Request
```typescript
POST /api/auth/login
Body: {
  email: string;
  password: string;
  userType?: "user" | "company"; // Optional, backend can determine
}
```

#### Login Response
```typescript
{
  user: {
    id: string;
    email: string;
    userType: "user" | "company";
    name: string;
  };
  token: string; // JWT access token
  refreshToken: string; // JWT refresh token
}
```

#### Register User Request
```typescript
POST /api/auth/register
Body: {
  email: string;
  password: string;
  role: "Seeker"; // Always "Seeker" for user registration
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  isVerified: boolean; // Default: false
  savedJobPosts: string[]; // Default: []
}
```

#### Register Company Request
```typescript
POST /api/auth/register
Body: {
  email: string;
  password: string;
  role: "Company"; // Always "Company" for company registration
  companyName: string;
  industry: string;
  website: string;
  address: string;
  phone: string;
  location: string;
  isVerified: boolean; // Default: false
}
```

### User Profile

#### Get User Profile Response
```typescript
GET /api/users/profile
Response: {
  id: string;
  email: string;
  role: "Seeker";
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  isVerified: boolean;
  savedJobPosts: string[]; // Array of job IDs
}
```

#### Get Profile Details Response
```typescript
GET /api/users/profile/details
Response: {
  id: string;
  user: string; // User ID
  cv?: string; // CV file URL
  experience: number; // Years of experience
  qualification: number; // Qualification score (0-10)
  skill: number; // Skill score (0-10)
  matchingData?: string; // Matching data ID
}
```

### Company Profile

#### Get Company Profile Response
```typescript
GET /api/companies/profile
Response: {
  id: string;
  name: string;
  address: string;
  logo?: string; // Logo URL
  isVerified: boolean;
}
```

### Jobs

#### Job Search Request
```typescript
GET /api/jobs/search?query=software&location=Colombo&industry=Technology&jobType=Full-Time&experienceLevel=Senior&salaryMin=100000&salaryMax=200000&page=1&limit=20&sortBy=recent
```

#### Job Search Response
```typescript
{
  jobs: JobSummaryModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

#### Job Detail Response
```typescript
{
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logoUrl: string;
  };
  location: string;
  jobType: string;
  postedDate: string; // ISO date string
  industry?: string;
  experienceLevel?: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  experienceLevel: string;
  closingDate: string; // ISO date string (NOT applicationDeadline)
  postedBy: string; // User ID
  status: "Active" | "Inactive" | "Pending Review" | "Closed";
}
```

### Applications

#### Application Response
```typescript
{
  id: string;
  jobPost: string; // Job ID (NOT jobId)
  candidate: string; // User ID
  date: string; // ISO date string (NOT appliedDate)
  status: "Pending" | "Reviewed" | "Shortlisted" | "Interview" | "Accepted" | "Rejected";
  coverLetter?: string;
  resume?: string; // Resume file URL
}
```

---

## 🔐 Authentication & Authorization

### Token Management
- **Access Token**: Stored in `localStorage` as `auth_token`
- **Refresh Token**: Stored in `localStorage` as `refresh_token`
- **Token Format**: `Bearer {token}` in Authorization header

### Token Refresh Flow
1. Frontend sends request with expired access token
2. Backend returns `401 Unauthorized`
3. Frontend automatically calls `/api/auth/refresh` with refresh token
4. Backend returns new access token
5. Frontend retries original request with new token

### Protected Routes
- All user/company endpoints require authentication
- Frontend automatically adds `Authorization: Bearer {token}` header
- Backend should return `401` if token is invalid/expired

---

## 📦 Data Models

### User Model
```typescript
interface UserModel {
  id: string;
  email: string;
  role: "Seeker" | "Company";
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  isVerified: boolean;
  savedJobPosts: string[]; // Array of job IDs
}
```

### Profile Model
```typescript
interface ProfileModel {
  id: string;
  user: string; // User ID
  cv?: string; // File URL
  experience: number; // Years
  qualification: number; // Score 0-10
  skill: number; // Score 0-10
  matchingData?: string; // Reference ID
}
```

### Company Model
```typescript
interface CompanyModel {
  id: string;
  name: string;
  address: string;
  logo?: string; // File URL
  isVerified: boolean;
}
```

### Job Model
```typescript
interface JobDetailModel {
  id: string;
  title: string;
  company: CompanySmallModel;
  location: string;
  jobType: string;
  postedDate: string;
  industry?: string;
  experienceLevel?: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  closingDate: string; // NOT applicationDeadline
  postedBy: string; // User ID
  status: "Active" | "Inactive" | "Pending Review" | "Closed";
}
```

### Application Model
```typescript
interface ApplicationModel {
  id: string;
  jobPost: string; // Job ID (NOT jobId)
  candidate: string; // User ID
  date: string; // ISO date (NOT appliedDate)
  status: "Pending" | "Reviewed" | "Shortlisted" | "Interview" | "Accepted" | "Rejected";
  coverLetter?: string;
  resume?: string; // File URL
}
```

---

## 🔄 Field Name Mapping

### Important Field Names
- **Job closing date**: Use `closingDate` (NOT `applicationDeadline`)
- **Application date**: Use `date` (NOT `appliedDate`)
- **Application job reference**: Use `jobPost` (NOT `jobId`)
- **Salary range**: Object `{ min: number, max: number }` (NOT string)

### Backward Compatibility
Frontend supports both old and new field names during migration, but backend should use the new names.

---

## 📤 File Uploads

### CV Upload
- **Endpoint**: `POST /api/users/cv/upload`
- **Content-Type**: `multipart/form-data`
- **Field Name**: `file`
- **Max Size**: 5 MB
- **Allowed Types**: PDF, DOC, DOCX

### Portfolio Upload
- **Endpoint**: `POST /api/users/portfolio/upload`
- **Content-Type**: `multipart/form-data`
- **Field Name**: `file`
- **Max Size**: 10 MB
- **Allowed Types**: PDF, DOCX, PPT, Images, Design files

### Company Logo Upload
- **Endpoint**: `PATCH /api/companies/profile` (include logo in form data)
- **Content-Type**: `multipart/form-data`
- **Max Size**: 2 MB
- **Allowed Types**: JPG, PNG, WEBP

---

## ⚠️ Important Notes

### 1. Error Handling
- Return standard HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Error response format:
```typescript
{
  error: string;
  message: string;
  details?: any; // Optional additional error details
}
```

### 2. Pagination
- Use query parameters: `page` (1-based) and `limit`
- Return pagination metadata:
```typescript
{
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### 3. CORS
- Enable CORS for frontend origin
- Allow credentials: `true`
- Allow headers: `Authorization`, `Content-Type`

### 4. Response Format
- Always return JSON
- Use consistent field names (see Data Models section)
- Dates should be ISO 8601 strings

### 5. Validation
- Validate all input data
- Return `400 Bad Request` with error details for validation failures
- Frontend uses Zod schemas for client-side validation

---

## 🧪 Testing the Integration

### Step 1: Set Environment Variable
```bash
# Create .env file
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 2: Enable Backend Code
In each service file (`src/services/*.ts`), uncomment the "BACKEND API" sections and comment out "MOCK DATA" sections.

### Step 3: Test Critical Flows
1. User registration → Login → Dashboard
2. Job search → View job → Apply
3. Company registration → Post job → View applications
4. Profile updates → Verify persistence

---

## 📞 Support

If you have questions about:
- **API endpoints**: Check `src/constants/index.ts`
- **Data models**: Check `src/models/*.ts`
- **Service implementations**: Check `src/services/*.ts`
- **Request/response formats**: See examples in service files

---

## ✅ Frontend Readiness Checklist

- [x] API client configured with interceptors
- [x] All API endpoints defined
- [x] Service layer ready (backend code commented, easy to enable)
- [x] Data models aligned with backend schema
- [x] Error handling implemented
- [x] Token refresh flow implemented
- [x] File upload handling ready
- [x] Environment configuration ready
- [x] TypeScript types defined for all models

---

**Status**: ✅ **FRONTEND IS READY FOR BACKEND INTEGRATION**

The frontend code is production-ready and waiting for backend API. Simply:
1. Implement the endpoints listed above
2. Set `VITE_API_BASE_URL`
3. Uncomment backend code sections in service files
4. Test the integration

Good luck! 🚀
